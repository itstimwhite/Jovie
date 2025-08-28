'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { completeOnboarding } from '@/app/onboarding/actions';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { APP_URL } from '@/constants/app';
import { identify, track } from '@/lib/analytics';

// Define the onboarding steps based on the new UX requirements
interface OnboardingStep {
  id: string;
  title: string;
  prompt: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: "Let's get you live.",
    prompt: "We'll set up your profile in 2 quick steps.",
  },
  {
    id: 'handle',
    title: 'Pick your @handle',
    prompt: 'This will be your link on Jovie.',
  },
  {
    id: 'done',
    title: "You're live.",
    prompt: "Here's your link.",
  },
];

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
  isSubmitting: boolean;
}

interface HandleValidationState {
  available: boolean;
  checking: boolean;
  error: string | null;
  clientValid: boolean;
  suggestions: string[];
}

export function AppleStyleOnboardingForm() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Track initial onboarding view
  useEffect(() => {
    if (user?.id) {
      track('onboarding_started', {
        user_id: user.id,
        timestamp: new Date().toISOString(),
      });
    }
  }, [user?.id]);

  // Extract domain from APP_URL for display - use branded domain in production
  const displayDomain =
    APP_URL.includes('localhost') || APP_URL.includes('vercel')
      ? 'jov.ie'
      : APP_URL.replace(/^https?:\/\//, '');

  // Current step in the onboarding flow
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Form state
  const [handle, setHandle] = useState('');
  const [handleInput, setHandleInput] = useState('');
  const [handleValidation, setHandleValidation] =
    useState<HandleValidationState>({
      available: false,
      checking: false,
      error: null,
      clientValid: false,
      suggestions: [],
    });

  // Process state
  const [state, setState] = useState<OnboardingState>({
    step: 'validating',
    progress: 0,
    error: null,
    retryCount: 0,
    isSubmitting: false,
  });

  // Prefill handle and selected artist data
  useEffect(() => {
    // Prefill handle from URL
    const urlHandle = searchParams?.get('handle');
    if (urlHandle) {
      setHandle(urlHandle);
      setHandleInput(urlHandle);
    } else {
      try {
        const pending = sessionStorage.getItem('pendingClaim');
        if (pending) {
          const parsed = JSON.parse(pending) as { handle?: string };
          if (parsed.handle) {
            setHandle(parsed.handle);
            setHandleInput(parsed.handle);
          }
        }
      } catch {}
    }

    // Remove any selected artist from sessionStorage since we removed the search step
    sessionStorage.removeItem('selectedArtist');
  }, [searchParams]);

  // Navigation handlers with smooth transitions
  const goToNextStep = useCallback(() => {
    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      const currentStep = ONBOARDING_STEPS[currentStepIndex];
      const nextStep = ONBOARDING_STEPS[currentStepIndex + 1];

      // Track step progression
      track('onboarding_step_completed', {
        step_id: currentStep.id,
        step_index: currentStepIndex,
        step_title: currentStep.title,
        next_step_id: nextStep.id,
        user_id: user?.id,
      });

      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStepIndex(currentStepIndex + 1);
        setIsTransitioning(false);

        // Track step viewed
        track('onboarding_step_viewed', {
          step_id: nextStep.id,
          step_index: currentStepIndex + 1,
          step_title: nextStep.title,
          user_id: user?.id,
        });

        // Focus management for accessibility
        setTimeout(() => {
          const heading = document.querySelector('h1');
          if (heading) {
            heading.focus();
          }
        }, 100);
      }, 300);
    }
  }, [currentStepIndex, user?.id]);

  const goToPreviousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStepIndex(currentStepIndex - 1);
        setIsTransitioning(false);
        // Focus management for accessibility
        setTimeout(() => {
          const heading = document.querySelector('h1');
          if (heading) {
            heading.focus();
          }
        }, 100);
      }, 300);
    }
  }, [currentStepIndex]);

  // Handle validation
  const validateHandle = useCallback((input: string) => {
    // Reset validation state
    setHandleValidation({
      available: false,
      checking: true,
      error: null,
      clientValid: false,
      suggestions: [],
    });

    // Basic client-side validation
    if (!input || input.length < 3) {
      setHandleValidation({
        available: false,
        checking: false,
        error: 'Handle must be at least 3 characters.',
        clientValid: false,
        suggestions: [],
      });
      return;
    }

    if (input.length > 20) {
      setHandleValidation({
        available: false,
        checking: false,
        error: 'Keep it under 20 characters.',
        clientValid: false,
        suggestions: [],
      });
      return;
    }

    // Check for valid characters (letters, numbers, dashes only)
    if (!/^[a-zA-Z0-9-]+$/.test(input)) {
      setHandleValidation({
        available: false,
        checking: false,
        error: 'Letters, numbers, dashes only.',
        clientValid: false,
        suggestions: [],
      });
      return;
    }

    // Simulate checking availability (in a real app, this would be an API call)
    setTimeout(() => {
      // For demo purposes, let's say handles with "taken" are already taken
      const isTaken = input.toLowerCase().includes('taken');

      setHandleValidation({
        available: !isTaken,
        checking: false,
        error: isTaken ? 'Already in use, try another.' : null,
        clientValid: true,
        suggestions: isTaken
          ? [`${input}123`, `${input}-music`, `the-${input}`]
          : [],
      });

      if (!isTaken) {
        setHandle(input);
      }
    }, 500);
  }, []);

  // Handle input change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (handleInput) {
        validateHandle(handleInput);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [handleInput, validateHandle]);

  // Form submission
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      if (
        !user ||
        state.isSubmitting ||
        !handleValidation.available ||
        !handleValidation.clientValid
      )
        return;

      // Track onboarding submission start
      track('onboarding_submission_started', {
        user_id: user.id,
        handle,
      });

      // Identify user for analytics
      identify(user.id, {
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        handle,
        onboarding_started_at: new Date().toISOString(),
      });

      setState(prev => ({
        ...prev,
        error: null,
        step: 'validating',
        progress: 0,
        isSubmitting: true,
      }));

      try {
        await completeOnboarding({
          username: handle.toLowerCase(),
          displayName: handle,
        });

        setState(prev => ({ ...prev, step: 'complete', progress: 100 }));

        // Track successful onboarding completion
        track('onboarding_completed', {
          user_id: user.id,
          handle,
          completion_time: new Date().toISOString(),
        });

        // Clear session data
        sessionStorage.removeItem('pendingClaim');

        // Go to final step
        goToNextStep();
      } catch (error) {
        console.error('Onboarding error:', error);

        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
          setState(prev => ({ ...prev, step: 'complete', progress: 100 }));
          return;
        }

        // Track onboarding error
        track('onboarding_error', {
          user_id: user.id,
          handle,
          error_message:
            error instanceof Error ? error.message : 'Unknown error',
          error_step: 'submission',
          timestamp: new Date().toISOString(),
        });

        // Map error to user-friendly message
        let userMessage =
          'Something went wrong saving your handle. Please try again.';
        if (error instanceof Error) {
          if (error.message.includes('INVALID_SESSION')) {
            userMessage = 'Your session expired. Please refresh and try again.';
          } else if (error.message.includes('USERNAME_TAKEN')) {
            userMessage =
              'This handle is already taken. Please choose another one.';
          } else if (error.message.includes('RATE_LIMITED')) {
            userMessage =
              'Too many attempts. Please try again in a few moments.';
          } else if (
            error.message.includes('NETWORK') ||
            error.message.includes('fetch')
          ) {
            userMessage =
              'Connection issue. Please check your internet and try again.';
          } else if (
            error.message.includes('DATABASE') ||
            error.message.includes('DB')
          ) {
            userMessage =
              'Something went wrong saving your handle. Please try again.';
          }
          // Don't show technical error messages to users
        }

        setState(prev => ({
          ...prev,
          error: userMessage,
          step: 'validating',
          progress: 0,
          isSubmitting: false,
        }));
      }
    },
    [
      user,
      state.isSubmitting,
      handleValidation.available,
      handleValidation.clientValid,
      handle,
      goToNextStep,
    ]
  );

  // Copy profile link to clipboard
  const copyProfileLink = useCallback(() => {
    const link = `${APP_URL}/${handle}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        // Show a temporary success message
        setState(prev => ({ ...prev, error: 'Link copied to clipboard!' }));
        setTimeout(() => {
          setState(prev => ({ ...prev, error: null }));
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
      });
  }, [handle]);

  // Go to dashboard
  const goToDashboard = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  // Retry operation on error
  const retryOperation = useCallback(() => {
    setState(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1,
      error: null,
    }));
  }, []);

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStepIndex) {
      // Step 1: Welcome
      case 0:
        return (
          <div className='flex flex-col items-center justify-center h-full text-center space-y-8'>
            <h1 className='text-4xl font-bold text-black dark:text-white'>
              {ONBOARDING_STEPS[0].title}
            </h1>
            <p className='text-gray-600 dark:text-gray-300 text-xl'>
              {ONBOARDING_STEPS[0].prompt}
            </p>
            <Button
              onClick={goToNextStep}
              className='w-full py-4 text-lg bg-black text-white dark:bg-white dark:text-black rounded-xl hover:opacity-90 transition-opacity'
            >
              Start
            </Button>
          </div>
        );

      // Step 2: Handle Selection
      case 1:
        return (
          <div className='flex flex-col items-center justify-center h-full space-y-8'>
            <div className='text-center space-y-3'>
              <h1 className='text-4xl font-bold text-black dark:text-white'>
                {ONBOARDING_STEPS[1].title}
              </h1>
              <p className='text-gray-600 dark:text-gray-300 text-xl'>
                {ONBOARDING_STEPS[1].prompt}
              </p>
            </div>

            <div className='w-full max-w-md space-y-6'>
              <div className='space-y-4'>
                <div className='relative'>
                  <input
                    type='text'
                    value={handleInput}
                    onChange={e => setHandleInput(e.target.value.toLowerCase())}
                    placeholder='yourhandle'
                    className={`w-full px-4 py-4 text-lg bg-gray-100 dark:bg-gray-800 border-2 rounded-xl transition-all ${
                      handleValidation.error
                        ? 'border-red-500 dark:border-red-500'
                        : handleValidation.available
                          ? 'border-green-500 dark:border-green-500'
                          : 'border-transparent'
                    } focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white`}
                  />
                  {handleValidation.checking && (
                    <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                      <LoadingSpinner size='sm' className='text-gray-400' />
                    </div>
                  )}
                </div>

                {/* Live preview */}
                <div className='text-center p-3 bg-gray-100 dark:bg-gray-800 rounded-xl'>
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>
                    Your profile link
                  </p>
                  <p className='font-mono text-black dark:text-white'>
                    {displayDomain}/{handleInput || 'yourhandle'}
                  </p>
                </div>

                {/* Validation feedback - directly under input */}
                <div className='min-h-[24px] flex items-center px-1'>
                  {handleValidation.error && (
                    <div className='text-red-500 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-1 duration-300'>
                      {handleValidation.error}
                    </div>
                  )}
                  {handleValidation.available &&
                    handleValidation.clientValid && (
                      <div className='flex items-center gap-2 text-green-600 dark:text-green-400 text-sm animate-in fade-in slide-in-from-bottom-1 duration-300'>
                        <svg
                          className='w-4 h-4'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            fillRule='evenodd'
                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span className='font-medium'>Handle is available</span>
                      </div>
                    )}
                </div>

                {/* Suggestions if handle is taken */}
                {handleValidation.suggestions.length > 0 && (
                  <div className='space-y-2'>
                    <p className='text-sm text-gray-600 dark:text-gray-300'>
                      Try one of these instead:
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {handleValidation.suggestions.map(suggestion => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            setHandleInput(suggestion);
                            validateHandle(suggestion);
                          }}
                          className='px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={
                    !handleValidation.available ||
                    !handleValidation.clientValid ||
                    state.isSubmitting
                  }
                  className={`w-full py-4 text-lg rounded-xl transition-all duration-300 ease-in-out ${
                    handleValidation.available &&
                    handleValidation.clientValid &&
                    !state.isSubmitting
                      ? 'bg-black text-white dark:bg-white dark:text-black hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed scale-100'
                  }`}
                >
                  {state.isSubmitting ? (
                    <div className='flex items-center justify-center space-x-2'>
                      <LoadingSpinner size='sm' className='text-current' />
                      <span>Saving…</span>
                    </div>
                  ) : (
                    'Continue'
                  )}
                </Button>
              </div>

              {/* Error display - only for submission errors */}
              {state.error && (
                <div className='p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-red-600 dark:text-red-300 text-sm space-y-2 animate-in fade-in slide-in-from-top-1 duration-300'>
                  <div className='flex items-center gap-2'>
                    <svg
                      className='w-4 h-4 flex-shrink-0'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span>{state.error}</span>
                  </div>
                  {state.retryCount < 3 && (
                    <button
                      onClick={retryOperation}
                      className='text-red-700 dark:text-red-200 underline hover:no-underline font-medium'
                    >
                      Try again
                    </button>
                  )}
                  {state.retryCount >= 3 && (
                    <p className='text-xs text-red-500 dark:text-red-400'>
                      If it keeps happening, contact support.
                    </p>
                  )}
                </div>
              )}

              {/* Back button */}
              <button
                onClick={goToPreviousStep}
                className='w-full text-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 py-2 text-sm'
              >
                Back
              </button>
            </div>
          </div>
        );

      // Step 3: Done
      case 2:
        return (
          <div className='flex flex-col items-center justify-center h-full space-y-8'>
            <div className='text-center space-y-3'>
              <h1 className='text-4xl font-bold text-black dark:text-white'>
                {ONBOARDING_STEPS[2].title}
              </h1>
              <p className='text-gray-600 dark:text-gray-300 text-xl'>
                {ONBOARDING_STEPS[2].prompt}
              </p>
            </div>

            <div className='w-full max-w-md space-y-6'>
              {/* Profile link */}
              <div className='text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-xl'>
                <p className='font-mono text-lg text-black dark:text-white'>
                  {displayDomain}/{handle}
                </p>
              </div>

              <div className='space-y-3'>
                <Button
                  onClick={goToDashboard}
                  className='w-full py-4 text-lg bg-black text-white dark:bg-white dark:text-black rounded-xl hover:opacity-90 transition-opacity'
                >
                  Go to Dashboard
                </Button>

                <Button
                  onClick={copyProfileLink}
                  variant='outline'
                  className='w-full py-4 text-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                >
                  Copy Link
                </Button>
              </div>

              {/* Success message when link is copied */}
              {state.error && (
                <div className='p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl text-green-600 dark:text-green-300 text-sm text-center'>
                  {state.error}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Progress indicator component - subtle top bar
  const ProgressIndicator = () => {
    return (
      <div className='fixed top-0 left-0 right-0 z-50'>
        <div className='h-1 bg-gray-200 dark:bg-gray-800'>
          <div
            className='h-full bg-black dark:bg-white transition-all duration-500 ease-in-out'
            style={{
              width: `${((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100}%`,
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className='min-h-screen flex flex-col'>
      {/* Progress indicator */}
      <ProgressIndicator />

      {/* Skip link for accessibility */}
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md z-50'
      >
        Skip to main content
      </a>

      {/* Screen reader announcements */}
      <div className='sr-only' aria-live='polite' aria-atomic='true'>
        Step {currentStepIndex + 1} of {ONBOARDING_STEPS.length}:{' '}
        {ONBOARDING_STEPS[currentStepIndex]?.title}
      </div>

      {/* Main content with smooth transitions */}
      <main
        className='flex-1 flex items-center justify-center px-4'
        id='main-content'
        role='main'
        aria-labelledby='step-heading'
      >
        <div id='step-heading' className='sr-only'>
          {ONBOARDING_STEPS[currentStepIndex]?.title} step content
        </div>
        <div
          className={`w-full max-w-2xl transform transition-all duration-500 ease-in-out ${
            isTransitioning
              ? 'opacity-0 translate-y-4'
              : 'opacity-100 translate-y-0'
          }`}
        >
          {renderStepContent()}
        </div>
      </main>
    </div>
  );
}
