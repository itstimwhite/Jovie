'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui';
import { APP_URL } from '@/constants/app';
import { completeOnboarding } from '@/app/onboarding/actions';

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
}

interface HandleValidation {
  available: boolean;
  checking: boolean;
  error: string | null;
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
  });

  // Handle validation state
  const [handleValidation, setHandleValidation] = useState<HandleValidation>({
    available: false,
    checking: false,
    error: null,
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

  // Debounced handle validation
  const validateHandle = useCallback(async (handleValue: string) => {
    if (!handleValue || handleValue.length < 3) {
      setHandleValidation({ available: false, checking: false, error: null });
      return;
    }

    setHandleValidation({ available: false, checking: true, error: null });

    try {
      // Use the API endpoint instead of direct database access during onboarding
      const response = await fetch(
        `/api/handle/check?handle=${encodeURIComponent(
          handleValue.toLowerCase()
        )}`
      );
      const result = await response.json();

      if (!response.ok) {
        setHandleValidation({
          available: false,
          checking: false,
          error: result.error || 'Error checking availability',
        });
      } else {
        setHandleValidation({
          available: result.available,
          checking: false,
          error: result.available ? null : 'Handle already taken',
        });
      }
    } catch (validationError) {
      console.error('Handle validation error:', validationError);
      setHandleValidation({
        available: false,
        checking: false,
        error: 'Network error',
      });
    }
  }, []);

  // Validate handle when it changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateHandle(handle);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [handle, validateHandle]);

  // Handle validation rules
  const handleError = useMemo(() => {
    if (!handle) return null;
    if (handle.length < 3) return 'Handle must be at least 3 characters';
    if (handle.length > 30) return 'Handle must be less than 30 characters';
    if (!/^[a-zA-Z0-9-]+$/.test(handle))
      return 'Handle can only contain letters, numbers, and hyphens';
    if (handleValidation.error) return handleValidation.error;
    return null;
  }, [handle, handleValidation.error]);

  const isFormValid = useMemo(() => {
    return (
      handle.length >= 3 &&
      handle.length <= 30 &&
      /^[a-zA-Z0-9-]+$/.test(handle) &&
      handleValidation.available &&
      !state.error
    );
  }, [handle, handleValidation.available, state.error]);

  // Retry mechanism
  const retryOperation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
      retryCount: prev.retryCount + 1,
    }));
  }, []);

  // Main submission handler using server action
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user || !isFormValid) return;

      setState((prev) => ({
        ...prev,
        error: null,
        step: 'validating',
        progress: 0,
      }));

      try {
        setState((prev) => ({ ...prev, step: 'creating-user', progress: 25 }));
        setState((prev) => ({
          ...prev,
          step: 'checking-handle',
          progress: 50,
        }));
        setState((prev) => ({
          ...prev,
          step: 'creating-artist',
          progress: 75,
        }));

        // Use the server action which handles authentication properly
        await completeOnboarding({
          username: handle.toLowerCase(),
          displayName: selectedArtist?.artistName || handle,
        });

        // Success!
        setState((prev) => ({ ...prev, step: 'complete', progress: 100 }));

        // Clear session data
        sessionStorage.removeItem('selectedArtist');
        sessionStorage.removeItem('pendingClaim');

        // Redirect immediately to the dashboard to reduce wait time
        window.location.href = '/dashboard';
      } catch (error) {
        console.error('Onboarding error:', error);
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
          step: 'validating',
          progress: 0,
        }));
      }
    },
    [user, handle, selectedArtist, isFormValid]
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
      {/* Progress indicator */}
      {state.step !== 'validating' && (
        <div className="space-y-2" id="form-status" aria-live="polite">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{getProgressText()}</span>
            <span>{state.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${state.progress}%` }}
              role="progressbar"
              aria-valuenow={state.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Onboarding progress"
            />
          </div>
        </div>
      )}

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
          error={handleError || handleValidation.error || undefined}
        >
          <div className="relative">
            <Input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="your-handle"
              required
              disabled={state.step !== 'validating'}
              className="font-mono pr-8"
              aria-describedby="handle-preview-onboarding"
              aria-invalid={
                handleError || handleValidation.error ? 'true' : 'false'
              }
              aria-label="Enter your desired handle"
            />
            {handleValidation.checking && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Spinner size="sm" />
              </div>
            )}
            {handleValidation.available && !handleValidation.checking && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
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
              </div>
            )}
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
          disabled={!isFormValid || state.step !== 'validating'}
          variant="primary"
          className="w-full"
          aria-describedby="form-status"
        >
          {state.step === 'validating' ? 'Create Profile' : getProgressText()}
        </Button>
      </form>
    </div>
  );
}
