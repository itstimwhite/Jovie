'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { OptimisticProgress } from '@/components/ui/OptimisticProgress';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { HandleInput } from '@/components/ui/HandleInput';
import { ArtistSelection } from '@/components/ui/ArtistSelection';
import { APP_URL } from '@/constants/app';
import { completeOnboarding } from '@/app/onboarding/actions';
import { 
  validateUsernameFormat, 
  generateUsernameSuggestions,
  debounce,
  type ClientValidationResult 
} from '@/lib/validation/client-username';

interface OnboardingState {
  step:
    | 'welcome'
    | 'artist'
    | 'handle'
    | 'confirm'
    | 'validating'
    | 'creating-user'
    | 'checking-handle'
    | 'creating-artist'
    | 'complete';
  progress: number;
  error: string | null;
  retryCount: number;
  isSubmitting: boolean;
}

type OnboardingStep = 'welcome' | 'artist' | 'handle' | 'confirm';

interface StepConfig {
  id: OnboardingStep;
  title: string;
  subtitle: string;
  fields: string[];
  canSkip?: boolean;
}

interface HandleValidation {
  available: boolean;
  checking: boolean;
  error: string | null;
  clientValid: boolean;
  suggestions: string[];
}

interface SelectedArtist {
  spotifyId: string;
  artistName: string;
  imageUrl?: string;
  timestamp: number;
  followerCount?: number;
}

export function OnboardingFormProgressive() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract domain from APP_URL for display
  const displayDomain = APP_URL.replace(/^https?:\/\//, '');

  // Multi-step configuration
  const steps: StepConfig[] = useMemo(() => [
    {
      id: 'welcome',
      title: 'Welcome!',
      subtitle: 'Let\'s get you set up with your artist profile',
      fields: [],
    },
    {
      id: 'artist',
      title: 'Find Your Artist',
      subtitle: 'Connect your Spotify artist profile (optional)',
      fields: ['artistSearch'],
      canSkip: true,
    },
    {
      id: 'handle',
      title: 'Choose Your Handle',
      subtitle: 'This will be your unique URL on Jovie',
      fields: ['handle'],
    },
    {
      id: 'confirm',
      title: 'Confirm & Create',
      subtitle: 'Review your profile before we create it',
      fields: ['review'],
    },
  ], []);

  // Current step state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];

  // Form state
  const [handle, setHandle] = useState('');
  const [selectedArtist, setSelectedArtist] = useState<SelectedArtist | null>(
    null
  );

  // Process state
  const [state, setState] = useState<OnboardingState>({
    step: 'welcome',
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
    clientValid: false,
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
  const lastValidatedRef = useRef<{
    handle: string;
    available: boolean;
  } | null>(null);

  // Instant client-side validation (optimized for <50ms response time)
  const validateClientSide = useCallback((handleValue: string): ClientValidationResult => {
    return validateUsernameFormat(handleValue);
  }, []);

  // Memoized client validation result
  const clientValidation = useMemo(() => validateClientSide(handle), [handle, validateClientSide]);

  // Memoized username suggestions
  const usernameSuggestions = useMemo(() => {
    if (clientValidation.valid || !handle) return [];
    return generateUsernameSuggestions(handle, selectedArtist?.artistName);
  }, [handle, selectedArtist?.artistName, clientValidation.valid]);

  // Debounced API validation (only for format-valid handles)
  const debouncedApiValidation = useMemo(
    () => debounce(async (handleValue: string) => {
      if (!clientValidation.valid) return;

      // Check cache first
      if (lastValidatedRef.current?.handle === handleValue) {
        const { available } = lastValidatedRef.current;
        setHandleValidation(prev => ({
          ...prev,
          available,
          checking: false,
          error: available ? null : 'Handle already taken',
        }));
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setHandleValidation(prev => ({ ...prev, checking: true, error: null }));

      try {
        const response = await fetch(
          `/api/handle/check?handle=${encodeURIComponent(handleValue.toLowerCase())}`,
          { signal: abortController.signal }
        );

        if (abortController.signal.aborted) return;

        const result = await response.json();
        const available = !!result.available && response.ok;

        setHandleValidation(prev => ({
          ...prev,
          available,
          checking: false,
          error: response.ok 
            ? (available ? null : 'Handle already taken')
            : (result.error || 'Error checking availability'),
        }));

        lastValidatedRef.current = { handle: handleValue, available };
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        
        console.error('Handle validation error:', error);
        setHandleValidation(prev => ({
          ...prev,
          available: false,
          checking: false,
          error: 'Network error',
        }));
        lastValidatedRef.current = { handle: handleValue, available: false };
      }
    }, 1000),
    [clientValidation.valid]
  );

  // Update validation state when handle or client validation changes
  useEffect(() => {
    // Update client validation state immediately
    setHandleValidation(prev => ({
      ...prev,
      clientValid: clientValidation.valid,
      error: clientValidation.error,
      suggestions: usernameSuggestions,
      available: clientValidation.valid ? prev.available : false,
    }));

    // Only trigger API validation for format-valid handles
    if (clientValidation.valid && handle.length >= 3) {
      debouncedApiValidation(handle);
    }
  }, [handle, clientValidation, usernameSuggestions, debouncedApiValidation]);

  // Prefetch dashboard route when handle is valid
  useEffect(() => {
    if (handleValidation.available && !handleValidation.checking) {
      // Prefetch dashboard assets for faster navigation after onboarding
      router.prefetch('/dashboard');
    }
  }, [handleValidation.available, handleValidation.checking, router]);

  // Memoized validation state for performance
  const validationState = useMemo(() => ({
    error: handleValidation.error,
    isClientValid: handleValidation.clientValid,
    isAvailable: handleValidation.available,
    isChecking: handleValidation.checking,
    canSubmit: handleValidation.clientValid && handleValidation.available && !handleValidation.checking
  }), [handleValidation]);

  // Memoized progress steps for optimistic UI
  const progressSteps = useMemo(() => [
    { key: 'validating', label: 'Validating credentials', duration: 300 },
    { key: 'creating-user', label: 'Setting up account', duration: 400 },
    { key: 'checking-handle', label: 'Securing handle', duration: 300 },
    { key: 'creating-artist', label: 'Creating profile', duration: 500 },
  ], []);

  // Navigation helpers
  const canGoNext = useMemo(() => {
    switch (currentStep.id) {
      case 'welcome':
        return true;
      case 'artist':
        return true; // Always can skip artist selection
      case 'handle':
        return validationState.canSubmit;
      case 'confirm':
        return handle && validationState.canSubmit;
      default:
        return false;
    }
  }, [currentStep.id, validationState.canSubmit, handle]);

  const canGoBack = currentStepIndex > 0;

  const handleNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentStepIndex, steps.length]);

  const handleBack = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  // Mock artist search function (replace with real implementation)
  const searchArtists = useCallback(async (query: string): Promise<SelectedArtist[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock results
    return [
      {
        spotifyId: '1',
        artistName: `${query} Artist`,
        imageUrl: 'https://via.placeholder.com/160x160',
        timestamp: Date.now(),
        followerCount: 10000,
      },
    ];
  }, []);

  // Retry mechanism
  const retryOperation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
      retryCount: prev.retryCount + 1,
    }));
  }, []);

  // Final submission handler
  const handleFinalSubmit = useCallback(
    async () => {
      if (!user || state.isSubmitting || !validationState.canSubmit) return;

      setState((prev) => ({
        ...prev,
        error: null,
        step: 'validating',
        progress: 0,
        isSubmitting: true,
      }));

      try {
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
          step: 'welcome',
          progress: 0,
          isSubmitting: false,
        }));
        setCurrentStepIndex(0);
      }
    },
    [user, handle, selectedArtist, state.isSubmitting, validationState.canSubmit]
  );

  // Handle step-specific next action
  const handleStepNext = useCallback(() => {
    if (currentStep.id === 'confirm') {
      handleFinalSubmit();
    } else {
      handleNext();
    }
  }, [currentStep.id, handleNext, handleFinalSubmit]);

  // Render step content
  const renderStepContent = () => {
    switch (currentStep.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {currentStep.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {currentStep.subtitle}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-2">
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                What we'll set up:
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Your unique artist handle</li>
                <li>• Link to your Spotify profile (optional)</li>
                <li>• Your public artist page</li>
              </ul>
            </div>
          </div>
        );

      case 'artist':
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {currentStep.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {currentStep.subtitle}
              </p>
            </div>
            <ArtistSelection
              selectedArtist={selectedArtist}
              onArtistSelect={setSelectedArtist}
              onSearch={searchArtists}
              allowSkip={true}
              disabled={state.isSubmitting}
            />
          </div>
        );

      case 'handle':
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {currentStep.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {currentStep.subtitle}
              </p>
            </div>
            <HandleInput
              value={handle}
              onChange={setHandle}
              prefix={`${displayDomain}/`}
              showAvailability={true}
              showLivePreview={true}
              formatHints={true}
              suggestions={handleValidation.suggestions}
              isChecking={handleValidation.checking}
              isAvailable={handleValidation.available}
              error={handleValidation.error}
              disabled={state.isSubmitting}
              placeholder="your-handle"
            />
          </div>
        );

      case 'confirm':
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {currentStep.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {currentStep.subtitle}
              </p>
            </div>
            
            {/* Profile Preview */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                Profile Preview:
              </h3>
              
              {selectedArtist && (
                <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-700/50 rounded-lg">
                  {selectedArtist.imageUrl && (
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={selectedArtist.imageUrl}
                        alt={selectedArtist.artistName}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedArtist.artistName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Spotify Artist
                    </p>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Handle:</span>
                  <span className="font-mono text-gray-900 dark:text-white">@{handle}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">URL:</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400">
                    {displayDomain}/{handle}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                ✓ Your profile will be live immediately after creation
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <ProgressIndicator
        currentStep={currentStepIndex + 1}
        totalSteps={steps.length}
        stepLabels={steps.map(s => s.title)}
        showTimeEstimate={true}
      />

      {/* Optimistic Progress for Final Submission */}
      {state.isSubmitting && (
        <OptimisticProgress
          isActive={state.isSubmitting}
          steps={progressSteps}
          onComplete={() => {
            // Progress complete, waiting for server redirect
          }}
        />
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

      {/* Step Content */}
      <div className="min-h-[300px]">
        {!state.isSubmitting && renderStepContent()}
      </div>

      {/* Navigation */}
      {!state.isSubmitting && (
        <div className="flex items-center justify-between pt-4">
          <Button
            onClick={handleBack}
            variant="ghost"
            disabled={!canGoBack}
            className="min-w-[100px]"
          >
            {canGoBack ? 'Back' : ''}
          </Button>
          
          <div className="flex items-center space-x-2">
            {currentStep.canSkip && currentStepIndex < steps.length - 1 && (
              <Button
                onClick={handleNext}
                variant="ghost"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Skip
              </Button>
            )}
            
            <Button
              onClick={handleStepNext}
              disabled={!canGoNext}
              variant="primary"
              className="min-w-[120px] h-11"
              data-test={currentStep.id === 'confirm' ? 'claim-btn' : 'next-btn'}
            >
              {currentStep.id === 'confirm' ? (
                <div className="flex items-center justify-center space-x-2">
                  <span>Create Profile</span>
                </div>
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}