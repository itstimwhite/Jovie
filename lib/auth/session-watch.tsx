'use client';

import { useEffect, useCallback, useState } from 'react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { track } from '@/lib/analytics';
import { saveDraftSnapshot, cleanupExpiredDrafts } from '@/lib/drafts';
import { useFeatureFlag } from '@/lib/analytics';

/**
 * Hook for monitoring session state and handling expiry
 */
export function useSessionMonitor() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isExpiredAuthFlowEnabled = useFeatureFlag('feature_expired_auth_flow', false);
  
  // Handle session expiry by saving draft and redirecting to sign-in
  const handleSessionExpiry = useCallback(async () => {
    if (!isSignedIn || !isLoaded) return;
    
    try {
      // Save draft data before redirecting
      saveDraftSnapshot(pathname);
      
      // Track analytics event
      track('auth.session.expired.redirect', {
        path: pathname,
      });
      
      // Build the returnTo URL with current path and query params
      const query = searchParams ? Array.from(searchParams.entries())
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&') : '';
      
      const returnTo = query 
        ? `${encodeURIComponent(pathname)}?${encodeURIComponent(query)}`
        : encodeURIComponent(pathname);
      
      // Sign out and redirect to sign-in page
      await signOut({
        redirectUrl: `/sign-in?reason=expired&returnTo=${returnTo}`,
      });
    } catch (error) {
      console.error('Error handling session expiry:', error);
      
      // Fallback to simple redirect if sign-out fails
      router.push(`/sign-in?reason=expired&returnTo=${encodeURIComponent(pathname)}`);
    }
  }, [isSignedIn, isLoaded, pathname, searchParams, signOut, router]);
  
  // Attempt to silently refresh the session
  const refreshSession = useCallback(async () => {
    if (!isSignedIn || !isLoaded) return false;
    
    try {
      // Get a fresh token - this will refresh the session if needed
      // Important: Do NOT use the deprecated template parameter
      const token = await getToken();
      
      if (token) {
        // Track successful refresh
        track('auth.silent_refresh.success');
        return true;
      }
      
      // If no token returned, session is invalid
      track('auth.silent_refresh.fail', { reason: 'no_token' });
      return false;
    } catch (error) {
      console.error('Error refreshing session:', error);
      
      // Track failed refresh
      track('auth.silent_refresh.fail', { 
        reason: error instanceof Error ? error.message : 'unknown',
      });
      
      return false;
    }
  }, [isSignedIn, isLoaded, getToken]);
  
  return {
    handleSessionExpiry,
    refreshSession,
  };
}

/**
 * Component that monitors session state and handles expiry
 * Mount this in protected layouts or pages
 */
export function SessionWatch() {
  const { refreshSession, handleSessionExpiry } = useSessionMonitor();
  const [initialized, setInitialized] = useState(false);
  const isExpiredAuthFlowEnabled = useFeatureFlag('feature_expired_auth_flow', false);
  
  // Listen for custom session expiry events
  useEffect(() => {
    if (!isExpiredAuthFlowEnabled) return;
    
    const handleExpiredEvent = async () => {
      const refreshSuccessful = await refreshSession();
      
      if (!refreshSuccessful) {
        handleSessionExpiry();
      }
    };
    
    // Listen for custom session expiry event
    window.addEventListener('auth:session-expired', handleExpiredEvent);
    
    // Clean up expired drafts on mount
    cleanupExpiredDrafts();
    
    return () => {
      window.removeEventListener('auth:session-expired', handleExpiredEvent);
    };
  }, [refreshSession, handleSessionExpiry, isExpiredAuthFlowEnabled]);
  
  // Attempt to refresh session on visibility change (tab focus)
  useEffect(() => {
    if (!isExpiredAuthFlowEnabled) return;
    
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && initialized) {
        await refreshSession();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Mark as initialized after first mount
    setInitialized(true);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshSession, initialized, isExpiredAuthFlowEnabled]);
  
  // Initial session refresh on mount
  useEffect(() => {
    if (isExpiredAuthFlowEnabled) {
      refreshSession();
    }
  }, [refreshSession, isExpiredAuthFlowEnabled]);
  
  // This component doesn't render anything
  return null;
}

