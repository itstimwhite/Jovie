'use client';

import posthog from 'posthog-js';
import { useEffect, useState } from 'react';
import { ANALYTICS } from '@/constants/app';
import { env as publicEnv } from '@/lib/env';
import { shouldSuppressAnalytics } from './analytics/route-suppression';
import { filterSensitiveQueryParams } from './analytics/query-param-filter';

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
    doNotTrack?: string;
  }
  
  interface Navigator {
    doNotTrack?: string;
    msDoNotTrack?: string;
  }
}

// Check if Do Not Track is enabled
const isDntEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Check for Do Not Track setting
  return (
    window.doNotTrack === '1' ||
    navigator.doNotTrack === '1' ||
    navigator.doNotTrack === 'yes' ||
    navigator.msDoNotTrack === '1'
  );
};

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

    // Check if analytics should be disabled based on DNT or route
    const shouldDisableAnalytics = (): boolean => {
      // Respect Do Not Track
      if (isDntEnabled()) {
        return true;
      }

      // Check for suppressed routes
      if (shouldSuppressAnalytics(window.location.pathname)) {
        return true;
      }

      return false;
    };

    const options: Parameters<typeof posthog.init>[1] = {
      capture_pageview: false, // we'll send $pageview manually via page()
      persistence: 'localStorage+cookie',
      // Respect Do Not Track browser setting
      respect_dnt: true,
      // Opt out by default if DNT is enabled or on suppressed routes
      opt_out_capturing_by_default: shouldDisableAnalytics(),
      // Privacy-focused configuration
      mask_all_text: true, // Mask all text inputs by default
      mask_all_element_attributes: ['data-private', 'data-sensitive'], // Mask elements with these attributes
      // Configure autocapture for sensitive elements
      autocapture: {
        // Enable autocapture
        enable: true,
        // Only capture clicks (not form inputs)
        dom_event_allowlist: ['click'],
        // Ignore elements with these attributes
        element_attribute_ignorelist: [
          'data-ph-no-capture',
          'data-private',
          'data-sensitive',
        ],
      },
      // Process events before sending to PostHog
      before_send_fn: (payload: any) => {
        // Don't send events if analytics should be disabled
        if (shouldDisableAnalytics()) {
          return null;
        }
        return payload;
      },
    };

    if (ANALYTICS.posthogHost && options) {
      options.api_host = ANALYTICS.posthogHost;
    }

    try {
      posthog.init(ANALYTICS.posthogKey, options);
      // Ensure every event has env attached
      posthog.register({ env: getEnvTag() });
    } catch (e) {
      // noop – avoid breaking the app if analytics fails to init
      // eslint-disable-next-line no-console
      console.warn('PostHog init failed:', e);
    }
  }, 0); // Execute on next tick to not block initial paint
}

export function track(
  event: string,
  properties?: Record<string, unknown>,
  statusCode?: number
) {
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

    // Check if analytics should be suppressed for this page
    if (
      isDntEnabled() ||
      shouldSuppressAnalytics(window.location.pathname, statusCode)
    ) {
      return; // Skip tracking for suppressed routes or when DNT is enabled
    }

    // Track with PostHog
    try {
      if (ANALYTICS.posthogKey) {
        // Filter any URL properties that might be in the event properties
        const safeProperties = properties ? { ...properties } : {};

        // Filter URL properties if they exist
        if (safeProperties.url && typeof safeProperties.url === 'string') {
          safeProperties.url = filterSensitiveQueryParams(safeProperties.url);
        }
        if (safeProperties.path && typeof safeProperties.path === 'string') {
          safeProperties.path = filterSensitiveQueryParams(safeProperties.path);
        }
        if (
          safeProperties.pathname &&
          typeof safeProperties.pathname === 'string'
        ) {
          safeProperties.pathname = filterSensitiveQueryParams(
            safeProperties.pathname
          );
        }

        posthog.capture(event, safeProperties);
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

export function page(
  name?: string,
  properties?: Record<string, unknown>,
  statusCode?: number
) {
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

    // Check if analytics should be suppressed for this page
    if (
      isDntEnabled() ||
      shouldSuppressAnalytics(window.location.pathname, statusCode)
    ) {
      return; // Skip tracking for suppressed routes or when DNT is enabled
    }

    // Filter sensitive query parameters from URL
    const safePathname = filterSensitiveQueryParams(
      window.location.pathname + window.location.search
    );

    // Track with PostHog as a pageview
    try {
      if (ANALYTICS.posthogKey) {
        posthog.capture('$pageview', {
          name,
          url: safePathname,
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
