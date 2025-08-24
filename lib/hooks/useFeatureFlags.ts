'use client';

import { useContext } from 'react';
import { FeatureFlagsContext } from '@/components/providers/FeatureFlagsProvider';

export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext);
  
  if (!context) {
    // Provide default flags if context is not available
    return {
      flags: {
        artistSearchEnabled: true,
        debugBannerEnabled: false,
        tipPromoEnabled: true,
        pricingUseClerk: false,
        universalNotificationsEnabled: false,
        featureClickAnalyticsRpc: false,
        progressiveOnboardingEnabled: true,
        feature_expired_auth_flow: false,
      },
      isLoading: false,
      error: null,
    };
  }
  
  return context;
}

