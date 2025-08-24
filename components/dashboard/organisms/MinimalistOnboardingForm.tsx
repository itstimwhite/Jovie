'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { type HandleValidationState } from '@/components/ui/SmartHandleInput';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { APP_URL } from '@/constants/app';
import { completeOnboarding } from '@/app/onboarding/actions';
import { useArtistSearch } from '@/lib/hooks/useArtistSearch';

// Progressive form steps
interface OnboardingStep {
  id: string;
  title: string;
  description: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    description: 'Get started',
  },
  {
    id: 'artist',
    title: 'Find Artist',
    description: 'Search Spotify',
  },
  {
    id: 'handle',
    title: 'Choose Handle',
    description: 'Pick your URL',
  },
  {
    id: 'confirm',
    title: 'Confirm Your Profile',
    description: 'Review your details before creating your account',
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

export function MinimalistOnboardingForm() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract domain from APP_URL for display
  const displayDomain = APP_URL.replace(/^https?:\/\//, '');

  // Current step in the progressive form
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Form state
  const [handle, setHandle] = useState('');
  const [selectedArtist, setSelectedArtist] = useState<SelectedArtist | null>(
    null
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        // If we have an artist, skip to handle step
        setCurrentStepIndex(2);
      } catch (error) {
        console.error('Error parsing selected artist:', error);
      }
    }
  }, [searchParams]);

  // Auto-advance to next step when requirements are met
  useEffect(() => {
    if (currentStepIndex === 1 && selectedArtist) {
      // Auto-advance from artist selection to handle step
      setTimeout(() => setCurrentStepIndex(2), 500);
    }
    if (
      currentStepIndex === 2 &&
      handleValidation?.available &&
      handleValidation?.clientValid
    ) {
      // Auto-advance from handle to confirmation when handle is valid and available
      setTimeout(() => setCurrentStepIndex(3), 1000);
    }
  }, [
    currentStepIndex,
    selectedArtist,
    handleValidation?.available,
    handleValidation?.clientValid,
  ]);

  // Navigation handlers with keyboard support and focus management
  const goToNextStep = useCallback(() => {
    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStepIndex(currentStepIndex + 1);
        setIsTransitioning(false);
        // Focus management for accessibility
        setTimeout(() => {
          const heading = document.querySelector('h2');
          if (heading) {
            heading.focus();
          }
        }, 100);
      }, 150);
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
          const heading = document.querySelector('h2');
          if (heading) {
            heading.focus();
          }
        }, 100);
      }, 150);
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
    },
    []
  );

  const handleSkipArtist = useCallback(() => {
    setSelectedArtist(null);
    sessionStorage.removeItem('selectedArtist');
    goToNextStep();
  }, [goToNextStep]);

  // Handle validation callback - kept for future use
  // const handleValidationChange = useCallback(
  //   (validation: HandleValidationState) => {
  //     setHandleValidation(validation);
  //   },
  //   []
  // );

  // Form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (
        !user ||
        state.isSubmitting ||
        !handleValidation?.available ||
        !handleValidation?.clientValid
      )
        return;

      setState((prev) => ({
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

        setState((prev) => ({ ...prev, step: 'complete', progress: 100 }));

        // Clear session data
        sessionStorage.removeItem('selectedArtist');
        sessionStorage.removeItem('pendingClaim');

        // Success animation before redirect
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } catch (error) {
        console.error('Onboarding error:', error);

        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
          setState((prev) => ({ ...prev, step: 'complete', progress: 100 }));
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

        setState((prev) => ({
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
      handle,
      selectedArtist,
      state.isSubmitting,
      handleValidation?.available,
      handleValidation?.clientValid,
      router,
    ]
  );

  // Retry operation
  const retryOperation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
      retryCount: prev.retryCount + 1,
    }));
  }, []);

  // Memoized progress steps for optimistic UI - not used in minimalist design
  // const progressSteps = useMemo(
  //   () => [
  //     { key: 'validating', label: 'Validating credentials', duration: 300 },
  //     { key: 'creating-user', label: 'Setting up account', duration: 400 },
  //     { key: 'checking-handle', label: 'Securing handle', duration: 300 },
  //     { key: 'creating-artist', label: 'Creating profile', duration: 500 },
  //   ],
  //   []
  // );

  // Determine if we can proceed to the next step
  const canProceedToNextStep = useMemo(() => {
    switch (currentStepIndex) {
      case 0: // Welcome
        return true;
      case 1: // Artist
        return selectedArtist !== null;
      case 2: // Handle
        return (
          handleValidation?.available &&
          handleValidation?.clientValid &&
          !handleValidation?.checking
        );
      case 3: // Confirm
        return (
          handleValidation?.available &&
          handleValidation?.clientValid &&
          !handleValidation?.checking
        );
      default:
        return false;
    }
  }, [currentStepIndex, selectedArtist, handleValidation]);

  // Render the current step content
  const renderStepContent = () => {
    switch (currentStepIndex) {
      case 0: // Welcome
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2
                className="text-2xl font-medium text-black dark:text-white"
                tabIndex={-1}
              >
                Welcome
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Let&apos;s set up your profile in a few simple steps.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={goToNextStep}
                variant="plain"
                className="w-full bg-black text-white dark:bg-white dark:text-black rounded-xl py-3 px-6"
                size="lg"
              >
                Get Started
              </Button>
            </div>
          </div>
        );

      case 1: // Artist Search
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2
                className="text-2xl font-medium text-black dark:text-white"
                tabIndex={-1}
              >
                Find Your Artist
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Search for your artist profile on Spotify.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by artist name"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                  onChange={(e) => searchArtists(e.target.value)}
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <LoadingSpinner
                      size="sm"
                      className="text-gray-400 dark:text-gray-500"
                    />
                  </div>
                )}
              </div>

              {searchError && (
                <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {searchError}
                  </p>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {searchResults.map((artist) => (
                    <div
                      key={artist.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      onClick={() => handleArtistSelect(artist)}
                    >
                      <div className="flex items-center space-x-3">
                        {artist.imageUrl ? (
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <Image
                              src={artist.imageUrl}
                              alt={artist.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-600 dark:text-gray-300 font-medium">
                              {artist.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium text-black dark:text-white">
                            {artist.name}
                          </h3>
                          {artist.followers && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {artist.followers.toLocaleString()} followers
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 space-y-3">
                <Button
                  onClick={handleSkipArtist}
                  variant="plain"
                  className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl py-3 px-6 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Skip This Step
                </Button>
                <Button
                  onClick={goToPreviousStep}
                  variant="plain"
                  className="w-full text-gray-500 dark:text-gray-400 py-2"
                >
                  Back
                </Button>
              </div>
            </div>
          </div>
        );

      case 2: // Handle Selection
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2
                className="text-2xl font-medium text-black dark:text-white"
                tabIndex={-1}
              >
                Choose Your Handle
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Select a unique identifier for your profile URL.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="handle-input"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Handle
                </label>
                <div className="relative">
                  <input
                    id="handle-input"
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="your-handle"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-gray-400 font-mono"
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoComplete="off"
                  />
                  {handleValidation?.checking && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <LoadingSpinner
                        size="sm"
                        className="text-gray-400 dark:text-gray-500"
                      />
                    </div>
                  )}
                  {handleValidation?.available &&
                    !handleValidation?.checking && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg
                          className="w-5 h-5 text-gray-500 dark:text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your profile will be live at {displayDomain}/
                  <span className="font-medium">{handle || 'your-handle'}</span>
                </p>

                {handleValidation?.error && (
                  <div className="mt-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {handleValidation.error}
                    </p>
                  </div>
                )}

                {handleValidation?.suggestions?.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Suggestions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {handleValidation.suggestions
                        .slice(0, 3)
                        .map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => setHandle(suggestion)}
                            className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  onClick={goToNextStep}
                  disabled={!canProceedToNextStep}
                  variant="plain"
                  className={`w-full rounded-xl py-3 px-6 ${
                    canProceedToNextStep
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continue
                </Button>
                <Button
                  onClick={goToPreviousStep}
                  variant="plain"
                  className="w-full text-gray-500 dark:text-gray-400 py-2"
                >
                  Back
                </Button>
              </div>
            </div>
          </div>
        );

      case 3: // Confirmation
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2
                className="text-2xl font-medium text-black dark:text-white"
                tabIndex={-1}
              >
                Confirm Your Profile
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Review your details before creating your account.
              </p>
            </div>

            <div className="space-y-6">
              {/* Profile preview card */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-6">
                <div className="flex items-center space-x-4">
                  {selectedArtist?.imageUrl ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={selectedArtist.imageUrl}
                        alt={selectedArtist.artistName}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 font-medium text-xl">
                        {(selectedArtist?.artistName || handle)
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-black dark:text-white text-lg">
                      {selectedArtist?.artistName || handle}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {displayDomain}/{handle}
                    </p>
                  </div>
                </div>

                {/* Profile details */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Handle:
                    </span>
                    <span className="font-mono text-black dark:text-white">
                      @{handle}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Profile URL:
                    </span>
                    <span className="font-mono text-black dark:text-white">
                      {displayDomain}/{handle}
                    </span>
                  </div>
                  {selectedArtist && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Spotify Artist:
                      </span>
                      <span className="text-black dark:text-white">
                        Connected
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Error display */}
              {state.error && (
                <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {state.error}
                    </p>
                    <Button
                      onClick={retryOperation}
                      variant="plain"
                      className="text-sm px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black rounded-lg"
                      disabled={state.retryCount >= 3}
                    >
                      {state.retryCount >= 3
                        ? 'Max retries'
                        : 'Refresh Session'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Final submission */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Button
                  type="submit"
                  disabled={!canProceedToNextStep || state.isSubmitting}
                  variant="plain"
                  className={`w-full rounded-xl py-3 px-6 ${
                    canProceedToNextStep && !state.isSubmitting
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {!state.isSubmitting ? (
                    'Create Account'
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <LoadingSpinner size="sm" className="text-current" />
                      <span>Creating profile...</span>
                    </div>
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={goToPreviousStep}
                  variant="plain"
                  className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl py-3 px-6 hover:bg-gray-50 dark:hover:bg-gray-800"
                  disabled={state.isSubmitting}
                >
                  Back
                </Button>
              </form>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Progress indicator component
  const ProgressIndicator = () => {
    return (
      <div className="mb-8">
        <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-black dark:bg-white transition-all duration-300 ease-in-out"
            style={{
              width: `${((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100}%`,
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {ONBOARDING_STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`text-xs ${
                index <= currentStepIndex
                  ? 'text-black dark:text-white'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className="max-w-md mx-auto space-y-6"
      role="main"
      aria-label="Onboarding form"
    >
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Step {currentStepIndex + 1} of {ONBOARDING_STEPS.length}:{' '}
        {ONBOARDING_STEPS[currentStepIndex]?.title}
      </div>

      {/* Progress indicator */}
      <ProgressIndicator />

      {/* Step content with smooth transitions */}
      <div
        className="min-h-[400px]"
        role="region"
        aria-labelledby="step-heading"
        id="main-content"
      >
        <div id="step-heading" className="sr-only">
          {ONBOARDING_STEPS[currentStepIndex]?.title} step content
        </div>
        <div
          className={`transform transition-all duration-300 ease-in-out ${
            isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {renderStepContent()}
        </div>
      </div>

      {/* Success completion */}
      {state.step === 'complete' && (
        <div className="text-center space-y-4 py-8">
          <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-white dark:text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-medium text-black dark:text-white">
            Profile Created
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Redirecting to your dashboard...
          </p>
        </div>
      )}
    </div>
  );
}
