'use client';

import posthog from 'posthog-js';
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

// Initialize PostHog on the client when key is present
if (typeof window !== 'undefined' && ANALYTICS.posthogKey) {
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

  const options: Parameters<typeof posthog.init>[1] = {
    autocapture: true,
    capture_pageview: false, // we'll send $pageview manually via page()
    persistence: 'localStorage+cookie',
  };
  if (ANALYTICS.posthogHost) {
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
