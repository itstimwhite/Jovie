'use client';

import { useEffect, useCallback } from 'react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { track } from '@/lib/analytics';
import { useFeatureFlag } from '@/lib/analytics';
import { saveDraftSnapshot, clearDraftSnapshot } from '@/lib/drafts';

// Custom hook for session monitoring
export function useSessionMonitor() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isExpiredAuthFlowEnabled = useFeatureFlag('feature_expired_auth_flow', false);

  // Silent refresh function
  const refreshSession = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return false;

    try {
      // Attempt to get a fresh token - this will refresh if needed
      await getToken({ skipCache: true });
      track('auth.silent_refresh.success');
      return true;
    } catch (error) {
      console.error('Session refresh failed:', error);
      track('auth.silent_refresh.fail', { error: String(error) });
      return false;
    }
  }, [isLoaded, isSignedIn, getToken]);

  // Handle session expiry
  const handleSessionExpiry = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;

    try {
      // Try silent refresh first
      const refreshed = await refreshSession();
      if (refreshed) return;

      // If refresh failed, save draft and sign out
      const currentPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      
      // Save draft data for current path
      saveDraftSnapshot(currentPath);
      
      // Track the event
      track('auth.session.expired.redirect', { path: currentPath });
      
      // Sign out and redirect to sign-in with returnTo
      await signOut({
        redirectUrl: `/sign-in?reason=expired&returnTo=${encodeURIComponent(currentPath)}`,
      });
    } catch (error) {
      console.error('Error handling session expiry:', error);
      
      // Fallback to basic redirect if signOut fails
      const currentPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      router.push(`/sign-in?reason=expired&returnTo=${encodeURIComponent(currentPath)}`);
    }
  }, [isLoaded, isSignedIn, refreshSession, pathname, searchParams, signOut, router]);

  // Expose the functions
  return {
    refreshSession,
    handleSessionExpiry,
    isExpiredAuthFlowEnabled,
  };
}

// Session watch component to be mounted on protected pages
export function SessionWatch() {
  const { isLoaded, isSignedIn } = useAuth();
  const { handleSessionExpiry, refreshSession, isExpiredAuthFlowEnabled } = useSessionMonitor();

  // Listen for SESSION_EXPIRED events from guardedFetch
  useEffect(() => {
    if (!isExpiredAuthFlowEnabled) return;
    
    const handleSessionExpiredEvent = () => {
      handleSessionExpiry();
    };

    // Listen for custom session expired event
    window.addEventListener('auth:session-expired', handleSessionExpiredEvent);
    
    return () => {
      window.addEventListener('auth:session-expired', handleSessionExpiredEvent);
    };
  }, [handleSessionExpiry, isExpiredAuthFlowEnabled]);

  // Periodic token refresh for long-lived sessions
  useEffect(() => {
    if (!isExpiredAuthFlowEnabled || !isLoaded || !isSignedIn) return;

    // Refresh token on mount
    refreshSession();

    // Set up periodic refresh (every 10 minutes)
    const refreshInterval = setInterval(() => {
      refreshSession();
    }, 10 * 60 * 1000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [isLoaded, isSignedIn, refreshSession, isExpiredAuthFlowEnabled]);

  // Handle tab visibility changes (refresh token when tab becomes visible after being hidden)
  useEffect(() => {
    if (!isExpiredAuthFlowEnabled || !isLoaded || !isSignedIn) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isLoaded, isSignedIn, refreshSession, isExpiredAuthFlowEnabled]);

  // This is a monitoring component, so it doesn't render anything
  return null;
}

