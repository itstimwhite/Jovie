'use client';
import React, { useEffect } from 'react';
import { initPosthog } from './posthog/client';
import { getServerFlag, identifyServerUser } from './posthog/server';

// Feature flags interface (keep existing for compatibility)
export interface FeatureFlags {
  artistSearchEnabled: boolean;
  debugBannerEnabled: boolean;
  tipPromoEnabled: boolean;
}

// Default feature flags (fallback)
const defaultFeatureFlags: FeatureFlags = {
  artistSearchEnabled: true,
  debugBannerEnabled: true,
  tipPromoEnabled: true,
};

// Context for identifying users
interface UserContext {
  distinctId: string;
  properties?: Record<string, unknown>;
}

// Server-first flag evaluation
export async function isEnabled(
  key: string,
  ctx?: UserContext
): Promise<boolean> {
  // Server-side evaluation
  if (typeof window === 'undefined') {
    if (!ctx?.distinctId) return getDefaultFlag(key);

    try {
      const flag = await getServerFlag<boolean>(
        key,
        ctx.distinctId,
        ctx.properties
      );
      return flag ?? getDefaultFlag(key);
    } catch {
      return getDefaultFlag(key);
    }
  }

  // Client-side evaluation (uses bootstrapped flags or PostHog client)
  try {
    const { getClientFlag } = await import('./posthog/client');
    const flag = getClientFlag(key);
    return typeof flag === 'boolean' ? flag : getDefaultFlag(key);
  } catch {
    return getDefaultFlag(key);
  }
}

// Get variant for multivariate flags
export async function getVariant<T = string | object>(
  key: string,
  ctx?: UserContext
): Promise<T | undefined> {
  // Server-side evaluation
  if (typeof window === 'undefined') {
    if (!ctx?.distinctId) return undefined;

    try {
      return await getServerFlag<T>(key, ctx.distinctId, ctx.properties);
    } catch {
      return undefined;
    }
  }

  // Client-side evaluation
  try {
    const { getClientFlag } = await import('./posthog/client');
    const variant = getClientFlag(key);
    return variant === false || variant === true ? undefined : (variant as T);
  } catch {
    return undefined;
  }
}

// Get default flag value based on key
function getDefaultFlag(key: string): boolean {
  switch (key) {
    case 'artistSearchEnabled':
    case 'artist_search_enabled':
      return defaultFeatureFlags.artistSearchEnabled;
    case 'debugBannerEnabled':
    case 'debug_banner_enabled':
      return defaultFeatureFlags.debugBannerEnabled;
    case 'tipPromoEnabled':
    case 'tip_promo_enabled':
      return defaultFeatureFlags.tipPromoEnabled;
    default:
      return false;
  }
}

// FlagProvider for server-to-client bootstrapping
export function FlagProvider({
  flags,
  children,
}: {
  flags: Record<string, boolean | string>;
  children: React.ReactNode;
}) {
  useEffect(() => {
    initPosthog(flags);
  }, [flags]);

  return <>{children}</>;
}

// User identification for both server and client
export async function identifyUser(
  distinctId: string,
  props: Record<string, unknown>
): Promise<void> {
  // Server-side
  if (typeof window === 'undefined') {
    await identifyServerUser(distinctId, props);
    return;
  }

  // Client-side
  try {
    const { identifyClientUser } = await import('./posthog/client');
    identifyClientUser(distinctId, props);
  } catch {
    // ignore client-side identification errors
  }
}

// Compatibility functions for existing code
export async function getFeatureFlags(): Promise<FeatureFlags> {
  return getServerFeatureFlags();
}

export async function getServerFeatureFlags(): Promise<FeatureFlags> {
  const defaultId = 'anonymous-' + Date.now();

  try {
    const [artistSearch, debugBanner, tipPromo] = await Promise.all([
      isEnabled('artistSearchEnabled', { distinctId: defaultId }),
      isEnabled('debugBannerEnabled', { distinctId: defaultId }),
      isEnabled('tipPromoEnabled', { distinctId: defaultId }),
    ]);

    return {
      artistSearchEnabled: artistSearch,
      debugBannerEnabled: debugBanner,
      tipPromoEnabled: tipPromo,
    };
  } catch {
    return defaultFeatureFlags;
  }
}
