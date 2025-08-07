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
  const [touched, setTouched] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sanitizeHandle = useCallback((raw: string) => {
    // Lowercase, allow a–z, 0–9, hyphen; collapse consecutive hyphens
    const lowered = raw.toLowerCase();
    const filtered = lowered.replace(/[^a-z0-9-]+/g, '');
    const collapsed = filtered.replace(/-{2,}/g, '-');
    return collapsed.slice(0, 30);
  }, []);

  const handleError = useMemo(() => {
    if (!touched || !handle) return null;
    if (handle.length < 3) return 'Must be at least 3 characters';
    if (handle.length > 30) return 'Must be 30 characters or fewer';
    if (!/^[a-z0-9-]+$/.test(handle))
      return 'Letters, numbers, and hyphens only';
    return null;
  }, [handle, touched]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setTouched(true);
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
        router.push(`/sign-in?redirect_url=${encodeURIComponent(target)}`);
        return;
      }

      router.push(target);
    },
    [handle, handleError, isSignedIn, router]
  );

  return (
    <form onSubmit={onSubmit} className="space-y-3" aria-busy={checking}>
      <label htmlFor="claim-handle" className="sr-only">
        Claim your jov.ie handle
      </label>
      <div className="relative">
        <div
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 select-none text-sm text-gray-500 dark:text-gray-400"
          aria-hidden="true"
        >
          jov.ie/
        </div>
        <Input
          id="claim-handle"
          type="text"
          value={handle}
          onChange={(e) => setHandle(sanitizeHandle(e.target.value))}
          onBlur={() => setTouched(true)}
          placeholder="your-handle"
          aria-label="Handle"
          aria-invalid={Boolean(handleError)}
          aria-describedby={
            handleError ? 'handle-error handle-hint' : 'handle-hint'
          }
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          autoFocus
          className="font-mono pl-16 pr-32"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            aria-label="Claim handle"
            disabled={!!handleError || checking || !handle}
          >
            {checking ? (
              <span className="inline-flex items-center gap-2">
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white"
                  role="status"
                  aria-live="polite"
                />
                Redirecting…
              </span>
            ) : (
              'Claim'
            )}
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <p id="handle-hint" className="text-gray-500 dark:text-gray-400">
          Letters, numbers, hyphens. 3–30 characters.
        </p>
        <p className="text-gray-400 dark:text-gray-500" aria-hidden>
          {handle.length}/30
        </p>
      </div>
      {handle ? (
        <p
          className="text-xs text-gray-500 dark:text-gray-400"
          role="status"
          aria-live="polite"
        >
          Your profile will be live at jov.ie/{handle}
        </p>
      ) : null}
      {error || handleError ? (
        <p
          id="handle-error"
          className="text-xs text-red-600 dark:text-red-400"
          role="alert"
        >
          {error || handleError}
        </p>
      ) : null}
    </form>
  );
}
