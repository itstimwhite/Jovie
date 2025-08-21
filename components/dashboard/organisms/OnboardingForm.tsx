'use client';

import { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { OptimisticProgress } from '@/components/ui/OptimisticProgress';
import { APP_URL } from '@/constants/app';
import { completeOnboarding } from '@/app/onboarding/actions';
import { 
  validateUsernameClient, 
  shouldValidateWithAPI, 
  debounce 
} from '@/lib/validation/client-username';

interface OnboardingState {
  step:
    | 'validating'
    | 'creating-user'
    | 'checking-handle'
    | 'creating-artist'
    | 'complete';
  progress: number;
  error: string | null;
  retryCount: number;
  isSubmitting: boolean; // Prevent double submissions
}

interface HandleValidation {
  available: boolean;
  checking: boolean;
  error: string | null;
  isFormatValid: boolean;
  suggestions?: string[];
}

interface SelectedArtist {
  spotifyId: string;
  artistName: string;
  imageUrl?: string;
  timestamp: number;
}

export function OnboardingForm() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract domain from APP_URL for display
  const displayDomain = APP_URL.replace(/^https?:\/\//, '');

  // Form state
  const [handle, setHandle] = useState('');
  const [selectedArtist, setSelectedArtist] = useState<SelectedArtist | null>(
    null
  );

  // Process state
  const [state, setState] = useState<OnboardingState>({
    step: 'validating',
    progress: 0,
    error: null,
    retryCount: 0,
    isSubmitting: false,
  });

  // Handle validation state
  const [handleValidation, setHandleValidation] = useState<HandleValidation>({
    available: false,
    checking: false,
    error: null,
    isFormatValid: false,
    suggestions: [],
  });

  // Prefill handle and selected artist data
  useEffect(() => {
    // Prefill handle from URL
    const urlHandle = searchParams?.get('handle');
    if (urlHandle) {
      setHandle(urlHandle);
    } else {
      try {
        const pending = sessionStorage.getItem('pendingClaim');
        if (pending) {
          const parsed = JSON.parse(pending) as { handle?: string };
          if (parsed.handle) setHandle(parsed.handle);
        }
      } catch {}
    }

    const stored = sessionStorage.getItem('selectedArtist');
    if (stored) {
      try {
        const artist = JSON.parse(stored) as SelectedArtist;
        setSelectedArtist(artist);
      } catch (error) {
        console.error('Error parsing selected artist:', error);
      }
    }
  }, [searchParams]);

  // Abort controller for canceling in-flight requests
  const abortControllerRef = useRef<AbortController | null>(null);
  const loaderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastValidatedRef = useRef<{
    handle: string;
    available: boolean;
  } | null>(null);
  const [showLoader, setShowLoader] = useState(false);

  // Optimistic progress steps
  const progressSteps = useMemo(() => [
    'Validating profile details',
    'Securing your handle',
    'Creating your account',
    'Setting up your profile',
    'Finalizing setup'
  ], []);

  // Instant client-side validation
  const validateHandleInstant = useCallback((handleValue: string) => {
    const clientResult = validateUsernameClient(handleValue);
    
    setHandleValidation(prev => ({
      ...prev,
      isFormatValid: clientResult.isFormatValid,
      error: clientResult.error || null,
      suggestions: clientResult.suggestions || [],
      available: clientResult.isFormatValid && prev.available, // Keep previous availability if format is valid
    }));
    
    return clientResult;
  }, []);

  // Debounced API validation (only for format-valid handles)
  const validateHandleAPI = useCallback(
    async (handleValue: string): Promise<boolean> => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (loaderTimeoutRef.current) {
        clearTimeout(loaderTimeoutRef.current);
      }
      setShowLoader(false);

      if (!shouldValidateWithAPI(handleValue)) {
        return false;
      }

      if (lastValidatedRef.current?.handle === handleValue) {
        const { available } = lastValidatedRef.current;
        setHandleValidation(prev => ({
          ...prev,
          available,
          checking: false,
        }));
        return available;
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setHandleValidation((prev) => ({ ...prev, checking: true }));
      loaderTimeoutRef.current = setTimeout(() => setShowLoader(true), 150);

      try {
        const response = await fetch(
          `/api/handle/check?handle=${encodeURIComponent(
            handleValue.toLowerCase()
          )}`,
          { signal: abortController.signal }
        );

        if (abortController.signal.aborted) return false;

        const result = await response.json();
        const available = !!result.available && response.ok;
        
        setHandleValidation(prev => ({
          ...prev,
          available,
          checking: false,
          error: prev.isFormatValid ? (
            response.ok
              ? available
                ? null
                : 'Handle already taken'
              : result.error || 'Error checking availability'
          ) : prev.error,
        }));
        
        lastValidatedRef.current = { handle: handleValue, available };
        return available;
      } catch (validationError) {
        if (
          validationError instanceof Error &&
          validationError.name === 'AbortError'
        ) {
          return false;
        }
        console.error('Handle validation error:', validationError);
        setHandleValidation(prev => ({
          ...prev,
          available: false,
          checking: false,
          error: prev.isFormatValid ? 'Network error' : prev.error,
        }));
        lastValidatedRef.current = { handle: handleValue, available: false };
        return false;
      } finally {
        if (loaderTimeoutRef.current) {
          clearTimeout(loaderTimeoutRef.current);
        }
        setShowLoader(false);
      }
    },
    []
  );

  // Debounced API validation
  const debouncedAPIValidation = useMemo(
    () => debounce(validateHandleAPI, 1000),
    [validateHandleAPI]
  );

  // Instant validation on handle change
  useEffect(() => {
    const clientResult = validateHandleInstant(handle);
    
    // Only trigger API validation if format is valid
    if (clientResult.isFormatValid && handle.length >= 3) {
      debouncedAPIValidation(handle);
    } else {
      // Clear API validation state if format is invalid
      if (!clientResult.isFormatValid) {
        setHandleValidation(prev => ({
          ...prev,
          available: false,
          checking: false,
        }));
      }
    }
  }, [handle, validateHandleInstant, debouncedAPIValidation]);

  // Prefetch dashboard route when handle is valid
  useEffect(() => {
    if (handleValidation.available && !handleValidation.checking) {
      // Prefetch dashboard assets for faster navigation after onboarding
      router.prefetch('/dashboard');
    }
  }, [handleValidation.available, handleValidation.checking, router]);

  // Memoized validation state
  const validationState = useMemo(() => {
    const clientResult = validateUsernameClient(handle);
    return {
      handleError: handleValidation.error,
      isFormatValid: clientResult.isFormatValid,
      isAvailable: handleValidation.available,
      isChecking: handleValidation.checking,
      suggestions: handleValidation.suggestions || [],
    };
  }, [handle, handleValidation]);

  // Retry mechanism
  const retryOperation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
      retryCount: prev.retryCount + 1,
    }));
  }, []);

  // Memoized handle change handler
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setHandle(e.target.value);
  }, []);

  // Main submission handler using server action
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user || state.isSubmitting) return;

      let available = handleValidation.available;
      if (handleValidation.checking || !available) {
        available = await validateHandleAPI(handle);
      }

      const isValid = validationState.isFormatValid && available && !state.error;

      if (!isValid) return;

      setState((prev) => ({
        ...prev,
        error: null,
        step: 'validating',
        progress: 0,
        isSubmitting: true,
      }));

      try {
        // Optimistic UI updates with realistic timing
        const progressUpdates = [
          { step: 'creating-user', progress: 20 },
          { step: 'checking-handle', progress: 40 },
          { step: 'creating-artist', progress: 70 },
        ];

        // Start optimistic progress immediately
        progressUpdates.forEach(({ step, progress }, index) => {
          setTimeout(() => {
            setState((prev) => ({ ...prev, step: step as any, progress }));
          }, index * 300); // Stagger updates every 300ms
        });

        // Use the server action which handles authentication properly
        await completeOnboarding({
          username: handle.toLowerCase(),
          displayName: selectedArtist?.artistName || handle,
        });

        // Success! Server action will handle redirect
        setState((prev) => ({ ...prev, step: 'complete', progress: 100 }));

        // Clear session data
        sessionStorage.removeItem('selectedArtist');
        sessionStorage.removeItem('pendingClaim');

        // Server action redirects to dashboard - no client redirect needed
      } catch (error) {
        console.error('Onboarding error:', error);

        // Check if this is a Next.js redirect (which is expected)
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
          // This is expected behavior - the redirect is working
          setState((prev) => ({ ...prev, step: 'complete', progress: 100 }));
          return;
        }

        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
          step: 'validating',
          progress: 0,
          isSubmitting: false,
        }));
      }
    },
    [
      user,
      handle,
      selectedArtist,
      state.error,
      state.isSubmitting,
      validationState.isAvailable,
      validationState.isChecking,
      validationState.isFormatValid,
      validateHandleAPI,
    ]
  );

  // Progress indicator
  const getProgressText = () => {
    switch (state.step) {
      case 'validating':
        return 'Validating...';
      case 'creating-user':
        return 'Setting up your account...';
      case 'checking-handle':
        return 'Securing your handle...';
      case 'creating-artist':
        return 'Creating your profile...';
      case 'complete':
        return 'Profile created successfully!';
      default:
        return 'Processing...';
    }
  };

  return (
    <div className="space-y-4">
      {/* Optimistic Progress indicator */}
      <OptimisticProgress
        isActive={state.step !== 'validating' && state.isSubmitting}
        steps={progressSteps}
        currentStep={
          state.step === 'creating-user' ? 0 :
          state.step === 'checking-handle' ? 1 :
          state.step === 'creating-artist' ? 2 :
          state.step === 'complete' ? 4 : 0
        }
        className="mb-4"
      />

      {/* Selected artist info */}
      {selectedArtist && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            {selectedArtist.imageUrl && (
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={selectedArtist.imageUrl}
                  alt={selectedArtist.artistName}
                  width={40}
                  height={40}
                />
              </div>
            )}
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100 text-sm">
                {selectedArtist.artistName}
              </h3>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Spotify Artist Profile
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error display */}
      {state.error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 transition-all duration-200">
          <div className="flex items-center justify-between">
            <p className="text-red-800 dark:text-red-200 text-sm" role="alert">
              {state.error}
            </p>
            <Button
              onClick={retryOperation}
              variant="secondary"
              size="sm"
              disabled={state.retryCount >= 3}
              aria-label="Retry onboarding process"
            >
              {state.retryCount >= 3 ? 'Max retries' : 'Retry'}
            </Button>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Handle"
          error={validationState.handleError || undefined}
        >
          <div className="relative">
            <Input
              type="text"
              value={handle}
              onChange={handleChange}
              placeholder="your-handle"
              required
              disabled={state.step !== 'validating'}
              className="font-mono pr-8"
              aria-describedby="handle-preview-onboarding"
              aria-invalid={
                handleError || handleValidation.error ? 'true' : 'false'
              }
              aria-label="Enter your desired handle"
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              inputMode="text"
              data-test="username-input"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
              {validationState.isChecking && showLoader && (
                <LoadingSpinner size="sm" />
              )}
              {validationState.isAvailable &&
                (!validationState.isChecking || !showLoader) && (
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
            </div>
          </div>
          <p
            className="text-xs text-gray-500 dark:text-gray-400 mt-1"
            id="handle-preview-onboarding"
          >
            Your profile will be live at {displayDomain}/
            {handle || 'your-handle'}
          </p>
        </FormField>

        <Button
          type="submit"
          disabled={
            !validationState.isFormatValid ||
            !validationState.isAvailable ||
            state.step !== 'validating' ||
            state.isSubmitting
          }
          variant="primary"
          className="w-full"
          aria-describedby="form-status"
          data-test="claim-btn"
        >
          {state.step === 'validating' && !state.isSubmitting ? (
            'Create Profile'
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <LoadingSpinner size="sm" />
              <span>{getProgressText()}</span>
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}
