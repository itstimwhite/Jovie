'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function ClaimHandleForm() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const [handle, setHandle] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useMemo(() => {
    if (!handle) return null;
    if (handle.length < 3) return 'Handle must be at least 3 characters';
    if (handle.length > 30) return 'Handle must be less than 30 characters';
    if (!/^[a-zA-Z0-9-]+$/.test(handle))
      return 'Handle can only contain letters, numbers, and hyphens';
    return null;
  }, [handle]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      if (handleError) return;

      // Persist pending claim so onboarding can pick it up
      try {
        sessionStorage.setItem(
          'pendingClaim',
          JSON.stringify({ handle: handle.toLowerCase(), ts: Date.now() })
        );
      } catch {}

      const target = `/onboarding?handle=${encodeURIComponent(
        handle.toLowerCase()
      )}`;

      if (!isSignedIn) {
        setChecking(true);
        // Send users to sign up, not sign in; include redirect to onboarding with handle
        router.push(`/sign-up?redirect_url=${encodeURIComponent(target)}`);
        return;
      }

      router.push(target);
    },
    [handle, handleError, isSignedIn, router]
  );

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="relative">
        <Input
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="your-handle"
          aria-label="Claim your handle"
          className="font-mono pr-28"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!!handleError || checking || !handle}
          >
            {checking ? 'Redirecting…' : 'Claim'}
          </Button>
        </div>
      </div>
      {handle ? (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Your profile will be live at jov.ie/{handle}
        </p>
      ) : null}
      {error || handleError ? (
        <p className="text-xs text-red-600 dark:text-red-400">
          {error || handleError}
        </p>
      ) : null}
    </form>
  );
}
