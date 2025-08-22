'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { FeatureFlags, getFeatureFlags } from '@/lib/feature-flags';
import { isFeatureEnabled } from '@/lib/analytics';
import {
  isSsrCriticalFlag,
  isExperimentalFlag,
} from '@/lib/server/feature-flags-config';

interface FeatureFlagsContextType {
  flags: FeatureFlags;
  isLoading: boolean;
  error: string | null;
  isSsrCriticalFlag: (flagName: string) => boolean;
  isExperimentalFlag: (flagName: string) => boolean;
}

// Default flags as fallback
const defaultFlags: FeatureFlags = {
  artistSearchEnabled: true,
  debugBannerEnabled: false, // UI banner removed; keep flag for compatibility
  tipPromoEnabled: true,
  pricingUseClerk: false,
  universalNotificationsEnabled: false,
  featureClickAnalyticsRpc: false,
};

const FeatureFlagsContext = createContext<FeatureFlagsContextType>({
  flags: defaultFlags,
  isLoading: true,
  error: null,
  isSsrCriticalFlag,
  isExperimentalFlag,
});

export function useFeatureFlags() {
  return useContext(FeatureFlagsContext);
}

interface FeatureFlagsProviderProps {
  children: React.ReactNode;
  initialFlags?: FeatureFlags;
  /**
   * Server-side flags that should take precedence over client-side flags
   * These are typically SSR-critical flags that must be consistent between server and client
   */
  serverFlags?: Partial<FeatureFlags>;
}

export function FeatureFlagsProvider({
  children,
  initialFlags,
  serverFlags,
}: FeatureFlagsProviderProps) {
  // Initialize with server flags (if available) merged with initial/default flags
  const [flags, setFlags] = useState<FeatureFlags>(() => {
    // Start with default flags
    const baseFlags = initialFlags || defaultFlags;

    // If we have server flags, they take precedence for SSR-critical flags
    if (serverFlags) {
      return { ...baseFlags, ...serverFlags };
    }

    return baseFlags;
  });

  const [isLoading, setIsLoading] = useState(!initialFlags && !serverFlags);
  const [error, setError] = useState<string | null>(null);

  // Fetch client-side flags if we don't have initial flags
  useEffect(() => {
    if (!initialFlags && !serverFlags) {
      const fetchFlags = async () => {
        try {
          const clientFlags = await getFeatureFlags();

          // Merge client flags with server flags, giving precedence to server flags
          setFlags((prevFlags) => ({
            ...clientFlags,
            // Preserve any server flags that were set
            ...Object.entries(prevFlags)
              .filter(([key]) => serverFlags && key in serverFlags)
              .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
          }));

          setIsLoading(false);
        } catch (err) {
          console.error('Error fetching feature flags:', err);
          setError('Failed to load feature flags');
          setIsLoading(false);
        }
      };

      fetchFlags();
    } else {
      setIsLoading(false);
    }
  }, [initialFlags, serverFlags]);

  // For experimental flags, we can use PostHog's real-time updates
  // But for SSR-critical flags, we stick with the server-provided values
  useEffect(() => {
    // Only subscribe to PostHog updates for experimental flags
    const experimentalFlagKeys = Object.keys(flags).filter(isExperimentalFlag);

    // Set up listeners for PostHog flag updates
    const handlePostHogFlagUpdate = () => {
      setFlags((prevFlags) => {
        const updatedFlags = { ...prevFlags };

        // Only update experimental flags from PostHog
        experimentalFlagKeys.forEach((key) => {
          // Only update if it's not a server-provided flag
          if (!(serverFlags && key in serverFlags)) {
            updatedFlags[key as keyof FeatureFlags] = isFeatureEnabled(key);
          }
        });

        return updatedFlags;
      });
    };

    // Set up PostHog flag update listener if available
    if (typeof window !== 'undefined' && typeof (window as any).posthog?.onFeatureFlags === 'function') {
      (window as any).posthog.onFeatureFlags(handlePostHogFlagUpdate);
      return () => {
        // Clean up listener
        if (typeof (window as any).posthog?.onFeatureFlags === 'function') {
          (window as any).posthog.onFeatureFlags(() => {});
        }
      };
    }
  }, [flags, serverFlags]);

  return (
    <FeatureFlagsContext.Provider
      value={{
        flags,
        isLoading,
        error,
        isSsrCriticalFlag,
        isExperimentalFlag,
      }}
    >
      {children}
    </FeatureFlagsContext.Provider>
  );
}
