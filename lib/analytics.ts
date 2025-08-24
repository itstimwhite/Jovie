'use client';

import posthog from 'posthog-js';
import { useEffect, useState } from 'react';
import { ANALYTICS } from '@/constants/app';
import { env as publicEnv } from '@/lib/env';

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
  }
}

// Initialize PostHog on the client when key is present - deferred to not block paint
if (typeof window !== 'undefined' && ANALYTICS.posthogKey) {
  // Defer analytics initialization to not block initial paint
  setTimeout(() => {
    const getEnvTag = (): 'dev' | 'preview' | 'prod' => {
      try {
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

    // Determine environment for PostHog configuration
    const isLocalDev = getEnvTag() === 'dev';

    // Define PostHog options with proper typing
    const options: {
      autocapture: boolean;
      capture_pageview: boolean;
      persistence: string;
      disable_toolbar: boolean;
      disable_session_recording: boolean;
      loaded: (ph: typeof posthog) => void;
      api_host?: string;
    } = {
      autocapture: true,
      capture_pageview: false, // we'll send $pageview manually via page()
      persistence: 'localStorage+cookie',
      // Disable Toolbar in local development to prevent 401 errors
      disable_toolbar: isLocalDev,
      // Disable session recording in local development
      disable_session_recording: isLocalDev,
      // Only load feature flags when properly configured
      loaded: (ph: typeof posthog) => {
        if (isLocalDev) {
          // Prevent experiments/feature flags API calls in local dev
          // This eliminates the 401 errors from /web_experiments endpoint
          ph._send_request = function () {
            return Promise.resolve();
          };
        }
      },
    };

    if (ANALYTICS.posthogHost) {
      options.api_host = ANALYTICS.posthogHost;
    }
    try {
      posthog.init(ANALYTICS.posthogKey, options);
      // Ensure every event has env attached
      posthog.register({ env: getEnvTag() });

      // Handle token expiry errors more gracefully
      const originalOnError = window.onerror;
      window.onerror = function (
        message: string | Event,
        source?: string,
        lineno?: number,
        colno?: number,
        error?: Error
      ) {
        // Filter out PostHog token expiry errors to prevent console spam
        if (
          typeof source === 'string' &&
          source.includes('posthog') &&
          typeof message === 'string' &&
          (message.includes('token expired') ||
            message.includes('Unauthorized') ||
            message.includes('401'))
        ) {
          // Suppress repeated PostHog auth errors
          return true;
        }

        // Call the original handler for other errors
        if (originalOnError) {
          return originalOnError(message, source, lineno, colno, error);
        }
        return false;
      };
    } catch (e) {
      // noop – avoid breaking the app if analytics fails to init
      // eslint-disable-next-line no-console
      const isLocalDev = getEnvTag() === 'dev';
      if (!isLocalDev) {
        // Only log in non-local environments to reduce noise
        console.warn('PostHog init failed:', e);
      }
    }
  }, 0); // Execute on next tick to not block initial paint
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    const envTag = (() => {
      try {
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
    })();

    // Track with PostHog
    try {
      if (ANALYTICS.posthogKey) {
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
    const envTag = (() => {
      try {
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
    })();

    // Track with PostHog as a pageview
    try {
      if (ANALYTICS.posthogKey) {
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
      if (ANALYTICS.posthogKey) {
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
  if (!ANALYTICS.posthogKey) return false;
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

  useEffect(() => {
    if (!ANALYTICS.posthogKey) {
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
  }, [flag, defaultValue]);

  return enabled;
}

// Hook with loading state to prevent flash of content
export function useFeatureFlagWithLoading(
  flag: FeatureFlagName | string,
  defaultValue: boolean = false
): { enabled: boolean; loading: boolean } {
  const [enabled, setEnabled] = useState<boolean>(defaultValue);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!ANALYTICS.posthogKey) {
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
  }, [flag, defaultValue]);

  return { enabled, loading };
}
