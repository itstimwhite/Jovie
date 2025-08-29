'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { completeOnboarding } from '@/app/onboarding/actions';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { APP_URL } from '@/constants/app';

interface SubmissionState {
  isSubmitting: boolean;
  error: string | null;
}

export function ClaimHandleForm(): JSX.Element {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [handle, setHandle] = useState<string>('');
  const [state, setState] = useState<SubmissionState>({
    isSubmitting: false,
    error: null,
  });

  // Prefill from URL or session
  useEffect(() => {
    const urlHandle = searchParams?.get('handle');
    if (urlHandle) {
      setHandle(urlHandle);
      return;
    }
    try {
      const pending = sessionStorage.getItem('pendingClaim');
      if (pending) {
        const parsed = JSON.parse(pending) as { handle?: string };
        if (parsed.handle) setHandle(parsed.handle);
      }
    } catch {}
  }, [searchParams]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!user || state.isSubmitting || !handle.trim()) return;

      setState({ isSubmitting: true, error: null });
      try {
        await completeOnboarding({ username: handle.trim().toLowerCase() });
        // completeOnboarding redirects on success; fallback here for safety
        router.push('/dashboard');
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'An unexpected error occurred';
        setState({ isSubmitting: false, error: msg });
      }
    },
    [user, state.isSubmitting, handle, router]
  );

  const displayDomain = APP_URL.replace(/^https?:\/\//, '');

  return (
    <div
      className='w-full max-w-md mx-auto'
      role='form'
      aria-label='Claim your handle'
    >
      <div className='space-y-6'>
        <div className='space-y-1'>
          <h1 className='text-xl font-medium text-primary'>
            Claim your handle
          </h1>
          <p className='text-sm text-secondary'>
            This becomes your public profile URL.
          </p>
        </div>

        <form onSubmit={onSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label
              htmlFor='handle'
              className='block text-sm font-medium text-secondary'
            >
              Handle
            </label>
            <div className='relative'>
              <input
                id='handle'
                type='text'
                value={handle}
                onChange={e => setHandle(e.target.value)}
                placeholder='your-handle'
                className='w-full px-3 py-2 border border-subtle rounded-lg bg-transparent text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent font-mono'
                autoCapitalize='none'
                autoCorrect='off'
                autoComplete='off'
                minLength={2}
                maxLength={32}
                required
              />
              {state.isSubmitting && (
                <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                  <LoadingSpinner size='sm' className='text-secondary' />
                </div>
              )}
            </div>
            <p className='text-xs text-secondary'>
              Your profile will be {displayDomain}/
              <span className='font-mono'>{handle || 'your-handle'}</span>
            </p>
          </div>

          {state.error && (
            <div className='bg-surface-1 border border-subtle rounded-lg p-3'>
              <p className='text-sm text-secondary'>{state.error}</p>
            </div>
          )}

          <Button
            type='submit'
            disabled={state.isSubmitting || !handle.trim()}
            variant='plain'
            className={`w-full rounded-lg py-2.5 px-4 ${
              state.isSubmitting || !handle.trim()
                ? 'bg-surface-hover-token text-secondary cursor-not-allowed'
                : 'bg-black text-white dark:bg-white dark:text-black'
            }`}
          >
            {state.isSubmitting ? 'Claiming…' : 'Claim handle'}
          </Button>
        </form>
      </div>
    </div>
  );
}
