'use client';

import { useEffect, useState } from 'react';
import { type FeatureFlags } from '@/lib/feature-flags';
import { getClientFeatureFlags } from '@/lib/feature-flags-client';

export function useFeatureFlags(): FeatureFlags {
  const [flags, setFlags] = useState<FeatureFlags>({
    artistSearchEnabled: true,
    debugBannerEnabled: false,
    tipPromoEnabled: true,
    pricingUseClerk: false,
    universalNotificationsEnabled: false,
    featureClickAnalyticsRpc: false,
    progressiveOnboardingEnabled: true,
    minimalistOnboardingEnabled: true,
    appleStyleOnboardingEnabled: true,
    venmoTipButtonEnabled: true,
  });

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const featureFlags = await getClientFeatureFlags();
        setFlags(featureFlags);
      } catch (error) {
        console.error('Failed to fetch feature flags:', error);
        // Keep default values on error
      }
    };

    fetchFlags();
  }, []);

  return flags;
}
