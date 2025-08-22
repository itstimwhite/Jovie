'use client';

import posthog from 'posthog-js';
import { useEffect, useState } from 'react';
import { ANALYTICS } from '@/constants/app';
import { env as publicEnv } from '@/lib/env';
import { useConsent } from '@/lib/cookies/useConsent';
import type { Consent } from '@/lib/cookies/consent';

// Type definitions for analytics

// Extend window interface for analytics
declare global {
  interface Window {
    va?: (event: string, data: Record<string, unknown>) => void;
    gtag?: (
      command: string,
      event: string,
      properties?: Record<string, unknown>
    ) => void;
    // Add PostHog initialization state
    _JV_POSTHOG_INITIALIZED?: boolean;
  }
}

// Helper to determine environment tag
const getEnvTag = (): 'dev' | 'preview' | 'prod' => {
  try {
    if (typeof window === 'undefined') {
      return process.env.NODE_ENV === 'development' ? 'dev' : 'prod';
    }
    
    const prodHost = new URL(publicEnv.NEXT_PUBLIC_APP_URL).hostname;
    const host = window.location.hostname;
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.endsWith('.local')
    ) {
      return 'dev';
    }
    if (host === prodHost || host === `www.${prodHost}`) {
      return 'prod';
    }
    return 'preview';
  } catch {
    return process.env.NODE_ENV === 'development' ? 'dev' : 'prod';
  }
};

// Check if current path should be excluded from analytics
const shouldExcludePath = (path: string): boolean => {
  // Exclude sensitive routes and error pages
  return (
    path.startsWith('/go/') ||
    path.startsWith('/out/') ||
    path.startsWith('/api/') ||
    path.includes('/404') ||
    path.includes('/500')
  );
};

// Initialize PostHog with privacy-focused settings
const initializePostHog = (consent: Consent) => {
  // Skip if already initialized or no key available
  if (
    typeof window === 'undefined' ||
    !ANALYTICS.posthogKey ||
    window._JV_POSTHOG_INITIALIZED ||
    !consent.analytics // Only initialize if analytics consent is given
  ) {
    return;
  }

  // Mark as initialized to prevent duplicate initialization
  window._JV_POSTHOG_INITIALIZED = true;

  // Configure PostHog with privacy-focused settings
  const options: posthog.Config = {
    // Disable autocapture by default for privacy
    autocapture: false,
    // We'll send $pageview manually via page()
    capture_pageview: false,
    // Use both localStorage and cookie for persistence
    persistence: 'localStorage+cookie',
    // Respect Do Not Track setting
    respect_dnt: true,
    // Mask text inputs by default
    mask_all_text: true,
    // Don't capture performance metrics
    capture_performance: false,
  };

  // Set custom API host if configured
  if (ANALYTICS.posthogHost) {
    options.api_host = ANALYTICS.posthogHost;
  }

  try {
    posthog.init(ANALYTICS.posthogKey, options);
    // Ensure every event has env attached
    posthog.register({ env: getEnvTag() });
  } catch (error) {
    // noop – avoid breaking the app if analytics fails to init
    // eslint-disable-next-line no-console
    console.warn('PostHog init failed:', error);
  }
};

// Hook to initialize PostHog when consent is available
export function useInitializeAnalytics() {
  const consent = useConsent();
  
  useEffect(() => {
    if (consent && typeof window !== 'undefined') {
      // Initialize PostHog when consent is available
      if (consent.analytics && ANALYTICS.posthogKey) {
        // Defer analytics initialization to not block initial paint
        setTimeout(() => {
          initializePostHog(consent);
        }, 0);
      } else if (!consent.analytics && window._JV_POSTHOG_INITIALIZED) {
        // If consent was revoked, attempt to clear PostHog data
        try {
          posthog.opt_out_capturing();
          // Reset initialization flag
          window._JV_POSTHOG_INITIALIZED = false;
        } catch {
          // Ignore errors
        }
      }
    }
  }, [consent]);
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    // Skip tracking on excluded paths
    if (shouldExcludePath(window.location.pathname)) {
      return;
    }

    const envTag = getEnvTag();

    // Track with PostHog
    try {
      if (ANALYTICS.posthogKey && window._JV_POSTHOG_INITIALIZED) {
        posthog.capture(event, properties);
      }
    } catch {}

    // Track with Vercel Analytics (if available)
    if (window.va) {
      window.va('event', {
        name: event,
        properties: { ...(properties || {}), env: envTag },
      });
    }

    // Track with Google Analytics (if available)
    if (window.gtag) {
      window.gtag('event', event, { ...(properties || {}), env: envTag });
    }
  }
}

export function page(name?: string, properties?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    // Skip tracking on excluded paths
    if (shouldExcludePath(window.location.pathname)) {
      return;
    }

    const envTag = getEnvTag();

    // Track with PostHog as a pageview
    try {
      if (ANALYTICS.posthogKey && window._JV_POSTHOG_INITIALIZED) {
        posthog.capture('$pageview', {
          name,
          url: window.location.pathname,
          ...properties,
        });
      }
    } catch {}

    // Track with Vercel Analytics (if available)
    if (window.va) {
      window.va('page_view', {
        name,
        properties: { ...(properties || {}), env: envTag },
      });
    }
  }
}

export function identify(userId: string, traits?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    // Identify in PostHog
    try {
      if (ANALYTICS.posthogKey && window._JV_POSTHOG_INITIALIZED) {
        posthog.identify(userId, traits);
      }
    } catch {}

    // Track with Vercel Analytics (if available)
    if (window.va) {
      window.va('identify', {
        userId,
        traits,
      });
    }
  }
}

// Feature flag constants for type safety
export const FEATURE_FLAGS = {
  CLAIM_HANDLE: 'feature_claim_handle',
} as const;

export type FeatureFlagName =
  (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];

// Lightweight feature flag helpers (client-only)
// Use defaultValue for safe rendering before flags load
export function isFeatureEnabled(flag: FeatureFlagName | string): boolean {
  if (typeof window === 'undefined') return false;
  if (!ANALYTICS.posthogKey || !window._JV_POSTHOG_INITIALIZED) return false;
  try {
    return Boolean(posthog.isFeatureEnabled(flag));
  } catch {
    return false;
  }
}

export function useFeatureFlag(
  flag: FeatureFlagName | string,
  defaultValue: boolean = false
): boolean {
  const [enabled, setEnabled] = useState<boolean>(defaultValue);
  const consent = useConsent();

  useEffect(() => {
    if (!ANALYTICS.posthogKey || !window._JV_POSTHOG_INITIALIZED || !consent?.analytics) {
      setEnabled(defaultValue);
      return;
    }

    // Initial check (if PostHog already loaded)
    try {
      const initial = posthog.isFeatureEnabled(flag);
      setEnabled(Boolean(initial));
    } catch (error) {
      console.warn(`PostHog feature flag check failed for "${flag}":`, error);
      setEnabled(defaultValue);
    }

    // Subscribe to updates (PostHog refreshes feature flags asynchronously)
    try {
      posthog.onFeatureFlags(() => {
        try {
          const current = posthog.isFeatureEnabled(flag);
          setEnabled(Boolean(current));
        } catch (error) {
          console.warn(
            `PostHog feature flag update failed for "${flag}":`,
            error
          );
        }
      });
    } catch (error) {
      console.warn(
        `PostHog feature flag subscription failed for "${flag}":`,
        error
      );
    }
  }, [flag, defaultValue, consent]);

  return enabled;
}

// Hook with loading state to prevent flash of content
export function useFeatureFlagWithLoading(
  flag: FeatureFlagName | string,
  defaultValue: boolean = false
): { enabled: boolean; loading: boolean } {
  const [enabled, setEnabled] = useState<boolean>(defaultValue);
  const [loading, setLoading] = useState<boolean>(true);
  const consent = useConsent();

  useEffect(() => {
    if (!ANALYTICS.posthogKey || !window._JV_POSTHOG_INITIALIZED || !consent?.analytics) {
      setEnabled(defaultValue);
      setLoading(false);
      return;
    }

    // Check if PostHog is ready
    const checkPostHogReady = () => {
      try {
        if (posthog && typeof posthog.isFeatureEnabled === 'function') {
          const initial = posthog.isFeatureEnabled(flag);
          setEnabled(Boolean(initial));
          setLoading(false);
          return true;
        }
        return false;
      } catch (error) {
        console.warn(`PostHog feature flag check failed for "${flag}":`, error);
        setEnabled(defaultValue);
        setLoading(false);
        return true;
      }
    };

    // Try immediate check
    if (checkPostHogReady()) {
      // Subscribe to updates
      try {
        posthog.onFeatureFlags(() => {
          try {
            const current = posthog.isFeatureEnabled(flag);
            setEnabled(Boolean(current));
          } catch (error) {
            console.warn(
              `PostHog feature flag update failed for "${flag}":`,
              error
            );
          }
        });
      } catch (error) {
        console.warn(
          `PostHog feature flag subscription failed for "${flag}":`,
          error
        );
      }
    } else {
      // PostHog not ready, wait a bit and try again
      const timeout = setTimeout(() => {
        checkPostHogReady();
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [flag, defaultValue, consent]);

  return { enabled, loading };
}

