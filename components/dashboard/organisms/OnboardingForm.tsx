'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui';
import { useAuthenticatedSupabase } from '@/lib/supabase';

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
  const { getAuthenticatedClient } = useAuthenticatedSupabase();
  const searchParams = useSearchParams();

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
  const validateHandle = useCallback(
    async (handleValue: string) => {
      if (!handleValue || handleValue.length < 3) {
        setHandleValidation({ available: false, checking: false, error: null });
        return;
      }

      setHandleValidation({ available: false, checking: true, error: null });

      try {
        const supabase = await getAuthenticatedClient();

        if (!supabase) {
          setHandleValidation({
            available: false,
            checking: false,
            error: 'Database connection failed',
          });
          return;
        }

        const { data, error: validationError } = await supabase
          .from('artists')
          .select('id')
          .eq('handle', handleValue.toLowerCase())
          .single();

        if (validationError && validationError.code !== 'PGRST116') {
          setHandleValidation({
            available: false,
            checking: false,
            error: 'Error checking availability',
          });
        } else if (data) {
          setHandleValidation({
            available: false,
            checking: false,
            error: 'Handle already taken',
          });
        } else {
          setHandleValidation({
            available: true,
            checking: false,
            error: null,
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
    },
    [getAuthenticatedClient]
  );

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

  // Main submission handler with improved error handling
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
        // Step 1: Get authentication token
        setState((prev) => ({ ...prev, step: 'validating', progress: 10 }));
        // Get authenticated Supabase client using native integration
        const supabase = getAuthenticatedClient();

        if (!supabase) {
          throw new Error('Database connection failed');
        }

        // Step 2: Create or get user
        setState((prev) => ({ ...prev, step: 'creating-user', progress: 30 }));
        let userId: string;

        try {
          const { data: existingUser, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('clerk_id', user.id)
            .single();

          if (userError && userError.code !== 'PGRST116') {
            // User doesn't exist, create them
            const userEmail = user.emailAddresses[0]?.emailAddress;
            if (!userEmail) throw new Error('Email address is required');

            const { data: newUser, error: createUserError } = await supabase
              .from('users')
              .insert({
                clerk_id: user.id,
                email: userEmail,
              })
              .select('id')
              .single();

            if (createUserError) throw createUserError;
            userId = newUser.id as string;
          } else if (userError) {
            throw userError;
          } else {
            userId = existingUser.id as string;
          }
        } catch (error) {
          throw new Error(
            `User creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }

        // Step 3: Final handle availability check
        setState((prev) => ({
          ...prev,
          step: 'checking-handle',
          progress: 60,
        }));
        try {
          const { data: existingArtist, error: checkError } = await supabase
            .from('artists')
            .select('id')
            .eq('handle', handle.toLowerCase())
            .single();

          if (checkError && checkError.code !== 'PGRST116') throw checkError;
          if (existingArtist) throw new Error('Handle is no longer available');
        } catch (error) {
          throw new Error(
            `Handle validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }

        // Step 4: Create artist profile
        setState((prev) => ({
          ...prev,
          step: 'creating-artist',
          progress: 80,
        }));
        try {
          const { error: artistError } = await supabase
            .from('artists')
            .insert({
              owner_user_id: userId,
              handle: handle.toLowerCase(),
              name: selectedArtist?.artistName || 'Your Artist Name',
              spotify_id: selectedArtist?.spotifyId || 'placeholder',
              image_url: selectedArtist?.imageUrl || null,
              published: true,
            })
            .select('*')
            .single();

          if (artistError) throw artistError;

          // Success!
          setState((prev) => ({ ...prev, step: 'complete', progress: 100 }));

          // Clear session data
          sessionStorage.removeItem('selectedArtist');
          sessionStorage.removeItem('pendingClaim');

          // Redirect with a small delay to show completion
          setTimeout(() => {
            window.location.href = `/${encodeURIComponent(handle.toLowerCase())}`;
          }, 500);
        } catch (error) {
          throw new Error(
            `Artist creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
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
    [user, handle, selectedArtist, isFormValid, getAuthenticatedClient]
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
    <div className="space-y-6">
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
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            {selectedArtist.imageUrl && (
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={selectedArtist.imageUrl}
                  alt={selectedArtist.artistName}
                  width={48}
                  height={48}
                />
              </div>
            )}
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100">
                {selectedArtist.artistName}
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Spotify Artist Profile
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error display with consistent height to prevent layout jump */}
      <div className="min-h-[4rem]" aria-live="polite">
        {state.error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 transition-all duration-200">
            <div className="flex items-center justify-between">
              <p
                className="text-red-800 dark:text-red-200 text-sm"
                role="alert"
              >
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
      </div>

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
            Your profile will be live at jov.ie/{handle || 'your-handle'}
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
