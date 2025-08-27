'use client';

import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { completeOnboarding } from '@/app/onboarding/actions';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { APP_URL } from '@/constants/app';
import { useArtistSearch } from '@/lib/hooks/useArtistSearch';

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
    prompt: "We'll set up your profile in 3 quick steps.",
  },
  {
    id: 'artist',
    title: 'Find your artist',
    prompt: 'Search Spotify or paste a link.',
  },
  {
    id: 'handle',
    title: 'Choose your handle',
    prompt: 'This becomes your profile link.',
  },
  {
    id: 'done',
    title: "You're live.",
    prompt: "Here's your link.",
  },
];

interface SelectedArtist {
  spotifyId: string;
  artistName: string;
  imageUrl?: string;
  popularity?: number;
  followers?: number;
  spotifyUrl?: string;
  timestamp: number;
}

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

  // Extract domain from APP_URL for display
  const displayDomain = APP_URL.replace(/^https?:\/\//, '');

  // Current step in the onboarding flow
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Form state
  const [handle, setHandle] = useState('');
  const [handleInput, setHandleInput] = useState('');
  const [selectedArtist, setSelectedArtist] = useState<SelectedArtist | null>(
    null
  );
  const [artistSearchQuery, setArtistSearchQuery] = useState('');
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

  // Artist search hook
  const {
    searchResults,
    isLoading: isSearching,
    error: searchError,
    searchArtists,
  } = useArtistSearch();

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

    const stored = sessionStorage.getItem('selectedArtist');
    if (stored) {
      try {
        const artist = JSON.parse(stored) as SelectedArtist;
        setSelectedArtist(artist);
        // If we have an artist, skip to handle step
        setCurrentStepIndex(2);
      } catch (error) {
        console.error('Error parsing selected artist:', error);
      }
    }
  }, [searchParams]);

  // Navigation handlers with smooth transitions
  const goToNextStep = useCallback(() => {
    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStepIndex(currentStepIndex + 1);
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

  // Artist selection handlers
  const handleArtistSelect = useCallback(
    (artist: {
      id: string;
      name: string;
      imageUrl?: string;
      popularity?: number;
      followers?: number;
      spotifyUrl?: string;
    }) => {
      const selectedArtistData: SelectedArtist = {
        spotifyId: artist.id,
        artistName: artist.name,
        imageUrl: artist.imageUrl,
        popularity: artist.popularity,
        followers: artist.followers,
        spotifyUrl: artist.spotifyUrl,
        timestamp: Date.now(),
      };

      setSelectedArtist(selectedArtistData);

      // Store in sessionStorage
      sessionStorage.setItem(
        'selectedArtist',
        JSON.stringify(selectedArtistData)
      );

      // Auto-advance to next step
      setTimeout(() => {
        goToNextStep();
      }, 500);
    },
    [goToNextStep]
  );

  const handleSkipArtist = useCallback(() => {
    setSelectedArtist(null);
    sessionStorage.removeItem('selectedArtist');
    goToNextStep();
  }, [goToNextStep]);

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
          displayName: selectedArtist?.artistName || handle,
        });

        setState(prev => ({ ...prev, step: 'complete', progress: 100 }));

        // Clear session data
        sessionStorage.removeItem('selectedArtist');
        sessionStorage.removeItem('pendingClaim');

        // Go to final step
        goToNextStep();
      } catch (error) {
        console.error('Onboarding error:', error);

        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
          setState(prev => ({ ...prev, step: 'complete', progress: 100 }));
          return;
        }

        // Map error to user-friendly message
        let userMessage = 'An unexpected error occurred';
        if (error instanceof Error) {
          if (error.message.includes('INVALID_SESSION')) {
            userMessage = 'Session expired. Refresh to continue.';
          } else if (error.message.includes('USERNAME_TAKEN')) {
            userMessage = 'This handle is already taken.';
          } else if (error.message.includes('RATE_LIMITED')) {
            userMessage = 'Too many attempts. Please try again later.';
          } else {
            userMessage = error.message;
          }
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
      selectedArtist,
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

      // Step 2: Artist Search
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
                <input
                  type='text'
                  value={artistSearchQuery}
                  onChange={e => setArtistSearchQuery(e.target.value)}
                  placeholder='Search by artist name'
                  className='w-full px-4 py-4 text-lg bg-gray-100 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white transition-all'
                  onKeyDown={e => {
                    if (e.key === 'Enter' && artistSearchQuery.trim()) {
                      searchArtists(artistSearchQuery);
                    }
                  }}
                />
                <Button
                  onClick={() => searchArtists(artistSearchQuery)}
                  disabled={!artistSearchQuery.trim() || isSearching}
                  className='w-full py-4 text-lg bg-black text-white dark:bg-white dark:text-black rounded-xl hover:opacity-90 transition-opacity'
                >
                  {isSearching ? (
                    <div className='flex items-center justify-center space-x-2'>
                      <LoadingSpinner size='sm' className='text-current' />
                      <span>Searching...</span>
                    </div>
                  ) : (
                    'Search'
                  )}
                </Button>
              </div>

              {/* Search results */}
              {searchResults.length > 0 && (
                <div className='space-y-4 mt-6'>
                  <h3 className='text-lg font-medium text-black dark:text-white'>
                    Select your artist profile
                  </h3>
                  <div className='space-y-3 max-h-[300px] overflow-y-auto pr-2'>
                    {searchResults.map(artist => (
                      <button
                        key={artist.id}
                        onClick={() => handleArtistSelect(artist)}
                        className='w-full flex items-center space-x-3 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left'
                      >
                        {artist.imageUrl ? (
                          <Image
                            src={artist.imageUrl}
                            alt={artist.name}
                            width={48}
                            height={48}
                            className='w-12 h-12 rounded-full object-cover'
                          />
                        ) : (
                          <div className='w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
                            <span className='text-gray-500 dark:text-gray-300 font-medium'>
                              {artist.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className='font-medium text-black dark:text-white'>
                            {artist.name}
                          </div>
                          {artist.followers && (
                            <div className='text-sm text-gray-500 dark:text-gray-400'>
                              {new Intl.NumberFormat().format(artist.followers)}{' '}
                              followers
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchError && (
                <div className='p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-red-600 dark:text-red-300 text-sm'>
                  {searchError}
                </div>
              )}

              {/* Skip option */}
              <button
                onClick={handleSkipArtist}
                className='w-full text-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 py-2 text-sm'
              >
                Skip for now
              </button>
            </div>
          </div>
        );

      // Step 3: Handle Selection
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
                    } focus:ring-2 focus:ring-black dark:focus:ring-white`}
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

                {/* Validation feedback - inline below input */}
                {handleValidation.error && (
                  <div className='text-red-500 dark:text-red-400 text-sm px-1'>
                    {handleValidation.error}
                  </div>
                )}

                {handleValidation.available && handleValidation.clientValid && (
                  <div className='text-green-500 dark:text-green-400 text-sm px-1'>
                    Handle is available!
                  </div>
                )}

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
                  className={`w-full py-4 text-lg rounded-xl transition-all ${
                    handleValidation.available &&
                    handleValidation.clientValid &&
                    !state.isSubmitting
                      ? 'bg-black text-white dark:bg-white dark:text-black hover:opacity-90'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {state.isSubmitting ? (
                    <div className='flex items-center justify-center space-x-2'>
                      <LoadingSpinner size='sm' className='text-current' />
                      <span>Creating profile...</span>
                    </div>
                  ) : (
                    'Continue'
                  )}
                </Button>
              </div>

              {/* Error display */}
              {state.error && (
                <div className='p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-red-600 dark:text-red-300 text-sm'>
                  {state.error}
                  {state.retryCount < 3 && (
                    <button onClick={retryOperation} className='ml-2 underline'>
                      Retry
                    </button>
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

      // Step 4: Done
      case 3:
        return (
          <div className='flex flex-col items-center justify-center h-full space-y-8'>
            <div className='text-center space-y-3'>
              <h1 className='text-4xl font-bold text-black dark:text-white'>
                {ONBOARDING_STEPS[3].title}
              </h1>
              <p className='text-gray-600 dark:text-gray-300 text-xl'>
                {ONBOARDING_STEPS[3].prompt}
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
