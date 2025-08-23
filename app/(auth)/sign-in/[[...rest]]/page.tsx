'use client';

import { SignIn } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { track } from '@/lib/analytics';
import { useFeatureFlag } from '@/lib/analytics';
import { restoreDraftSnapshot, clearDraftSnapshot, hasDraftSnapshot } from '@/lib/drafts';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const isExpiredAuthFlowEnabled = useFeatureFlag('feature_expired_auth_flow', false);

  // Check for returnTo parameter (new) or redirect_url parameter (legacy)
  const returnTo = searchParams.get('returnTo') || searchParams.get('redirect_url');

  // Check for reason=expired parameter
  const reason = searchParams.get('reason');
  const isExpiredSession = reason === 'expired';

  // Check for artistId parameter (legacy flow)
  const artistId = searchParams.get('artistId');

  // Determine destination: prioritize returnTo, then artistId flow, then default to dashboard
  const destination =
    returnTo ||
    (artistId ? `/dashboard?artistId=${artistId}` : '/dashboard');

  // Handle draft restoration after successful sign-in
  useEffect(() => {
    if (!isExpiredAuthFlowEnabled) return;

    // Track analytics for expired session
    if (isExpiredSession && returnTo) {
      track('auth.session.expired.signin', { returnTo });
    }

    // Set up event listener for successful sign-in
    const handleSignInSuccess = () => {
      // Check if we have a draft to restore
      if (returnTo && hasDraftSnapshot(returnTo)) {
        // We'll restore the draft when the user navigates back to the original page
        track('draft.pending_restore', { path: returnTo });
      }
    };

    // Listen for Clerk's sign-in success event
    document.addEventListener('clerk.user.signed-in', handleSignInSuccess);

    return () => {
      document.removeEventListener('clerk.user.signed-in', handleSignInSuccess);
    };
  }, [isExpiredSession, returnTo, isExpiredAuthFlowEnabled]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-[#0D0E12] transition-colors">
      {/* Expired session banner */}
      {isExpiredAuthFlowEnabled && isExpiredSession && (
        <div className="mb-6 w-full max-w-md rounded-lg bg-amber-50 p-4 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          <p className="text-center text-sm font-medium">
            Your session has expired. Please sign in again to continue.
          </p>
        </div>
      )}

      <SignIn
        redirectUrl={destination}
        afterSignInUrl={destination}
        afterSignUpUrl={destination}
      />
    </div>
  );
}

