'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function ClaimHandleForm() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const [handle, setHandle] = useState('');
  // Navigating (redirecting after submit)
  const [navigating, setNavigating] = useState(false);
  // Live availability
  const [checkingAvail, setCheckingAvail] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [availError, setAvailError] = useState<string | null>(null);
  // UI micro-interactions
  const [isShaking, setIsShaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const lastQueriedRef = useRef<string>('');

  const handleError = useMemo(() => {
    if (!handle) return null;
    if (handle.length < 3) return 'Handle must be at least 3 characters';
    if (handle.length > 30) return 'Handle must be less than 30 characters';
    if (!/^[a-zA-Z0-9-]+$/.test(handle))
      return 'Handle can only contain letters, numbers, and hyphens';
    return null;
  }, [handle]);

  // Debounced live availability check
  useEffect(() => {
    setAvailError(null);
    setCopied(false);
    if (!handle || handleError) {
      setAvailable(null);
      setCheckingAvail(false);
      return;
    }

    const value = handle.toLowerCase();
    lastQueriedRef.current = value;
    setCheckingAvail(true);
    const controller = new AbortController();
    const id = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/handle/check?handle=${encodeURIComponent(value)}`,
          { signal: controller.signal }
        );
        const json = await res
          .json()
          .catch(() => ({ available: false, error: 'Parse error' }));
        // Ignore out-of-order responses
        if (lastQueriedRef.current !== value) return;
        if (!res.ok) {
          setAvailable(null);
          setAvailError(json?.error || 'Error checking availability');
        } else {
          setAvailable(Boolean(json?.available));
          setAvailError(null);
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        if (lastQueriedRef.current !== value) return;
        setAvailable(null);
        setAvailError('Network error');
      } finally {
        if (lastQueriedRef.current === value) setCheckingAvail(false);
      }
    }, 400);

    return () => {
      clearTimeout(id);
      controller.abort();
    };
  }, [handle, handleError]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Guard: invalid or unavailable or still checking
      if (handleError || checkingAvail || available !== true) {
        // Micro shake for quick feedback
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 180);
        return;
      }

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

      setNavigating(true);
      if (!isSignedIn) {
        // Send users to sign up; include redirect to onboarding with handle
        router.push(`/sign-up?redirect_url=${encodeURIComponent(target)}`);
        return;
      }

      router.push(target);
    },
    [available, checkingAvail, handle, handleError, isSignedIn, router]
  );

  // Button state logic
  const showChecking = checkingAvail;
  const unavailable = available === false || !!handleError || !!availError;
  const canSubmit = available === true && !checkingAvail && !navigating;
  const btnLabel = showChecking
    ? 'Checking…'
    : unavailable
      ? 'Choose Another'
      : available === true
        ? 'Claim Handle'
        : 'Claim';
  const btnColor: 'green' | 'indigo' = available === true ? 'green' : 'indigo';
  const btnDisabled = !canSubmit;

  // Status icon to show inside the input
  const StatusIcon = () => {
    if (showChecking) {
      return (
        <LoadingSpinner
          size="sm"
          className="text-zinc-500 dark:text-zinc-400"
        />
      );
    }
    if (!handle) return null;
    if (available === true && !handleError) {
      return (
        <svg
          className="h-4 w-4 text-green-600"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 10-1.214-.882l-3.2 4.4-1.63-1.63a.75.75 0 10-1.06 1.06l2.25 2.25a.75.75 0 001.145-.089l3.71-5.109z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    if (unavailable) {
      return (
        <svg
          className="h-4 w-4 text-red-600"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM7.75 7.75a.75.75 0 011.06 0L10 8.94l1.19-1.19a.75.75 0 111.06 1.06L11.06 10l1.19 1.19a.75.75 0 11-1.06 1.06L10 11.06l-1.19 1.19a.75.75 0 11-1.06-1.06L8.94 10 7.75 8.81a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    return null;
  };

  const previewTone = showChecking
    ? 'text-gray-500 dark:text-gray-400'
    : available === true
      ? 'text-green-600 dark:text-green-500'
      : unavailable
        ? 'text-red-600 dark:text-red-400'
        : 'text-gray-500 dark:text-gray-400';

  const helperText = (() => {
    if (handleError) return handleError;
    if (availError) return availError;
    if (available === false) return 'Handle already taken';
    return null;
  })();

  const onCopyPreview = async () => {
    try {
      await navigator.clipboard.writeText(`jov.ie/${handle}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input
        type="text"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
        placeholder="your-handle"
        aria-label="Claim your handle"
        className={`${isShaking ? 'jv-shake' : ''} ${available === true ? 'jv-available' : ''}`}
        inputClassName="text-[16px] sm:text-[15px] leading-6 tracking-tight font-medium placeholder:text-zinc-500 pr-36 sm:pr-40"
        trailing={
          <div className="flex items-center gap-2">
            {/* Live status icon */}
            <div aria-hidden className="flex items-center justify-center">
              <StatusIcon />
            </div>
            {/* Action button */}
            <Button
              type="submit"
              variant="primary"
              color={btnColor}
              size="sm"
              className="min-w-[128px] sm:min-w-[136px] justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={btnDisabled || !handle}
            >
              {showChecking ? (
                <span className="inline-flex items-center gap-2">
                  <LoadingSpinner size="sm" className="text-white" />
                  <span>Checking…</span>
                </span>
              ) : navigating ? (
                'Redirecting…'
              ) : (
                btnLabel
              )}
            </Button>
          </div>
        }
      />

      {handle ? (
        <p
          onClick={available ? onCopyPreview : undefined}
          className={`text-xs ${previewTone} select-none ${
            available ? 'cursor-pointer' : ''
          }`}
          title={available ? (copied ? 'Copied!' : 'Click to copy') : undefined}
        >
          Your profile will be live at{' '}
          <span className="text-current">jov.ie/</span>
          <span className="font-semibold text-current">{handle}</span>
          {available ? (
            <span className="ml-2 text-[11px] text-green-600 dark:text-green-500">
              {copied ? 'Copied!' : 'Tap to copy'}
            </span>
          ) : null}
        </p>
      ) : null}

      {helperText ? (
        <p
          className={`flex items-center gap-1.5 text-[12px] transition-opacity duration-150 ${
            unavailable
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {unavailable ? (
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 6h2v6H9V6zm0 7h2v2H9v-2z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 10-1.214-.882l-3.2 4.4-1.63-1.63a.75.75 0 10-1.06 1.06l2.25 2.25a.75.75 0 001.145-.089l3.71-5.109z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <span>{helperText}</span>
        </p>
      ) : null}

      <style jsx>{`
        .jv-shake {
          animation: jv-shake 150ms ease-in-out;
        }
        @keyframes jv-shake {
          0% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-2px);
          }
          50% {
            transform: translateX(2px);
          }
          75% {
            transform: translateX(-2px);
          }
          100% {
            transform: translateX(0);
          }
        }
        .jv-available {
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.35);
          animation: jv-available-pulse 900ms ease-out 1;
          border-radius: 0.5rem;
        }
        @keyframes jv-available-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }
      `}</style>
    </form>
  );
}
