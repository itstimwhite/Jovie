'use client';

import { useEffect, useState } from 'react';
import { FeatureFlags, getFeatureFlags } from '@/lib/feature-flags';

// Default feature flags for initial render
const initialFlags: FeatureFlags = {
  artistSearchEnabled: true,
  debugBannerEnabled: false,
  tipPromoEnabled: true,
  pricingUseClerk: false,
  universalNotificationsEnabled: process.env.NODE_ENV === 'development',
  featureClickAnalyticsRpc: false,
  claimHandleEnabled: false,
};

/**
 * Hook to access all feature flags in a type-safe way
 * @returns Object containing all feature flags and loading state
 */
export function useFeatureFlags(): FeatureFlags & { loading: boolean } {
  const [flags, setFlags] = useState<FeatureFlags>(initialFlags);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchFlags = async () => {
      try {
        const fetchedFlags = await getFeatureFlags();
        if (isMounted) {
          setFlags(fetchedFlags);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch feature flags:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFlags();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    ...flags,
    loading,
  };
}
