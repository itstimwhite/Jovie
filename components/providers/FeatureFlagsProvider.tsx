'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { FeatureFlags, getFeatureFlags } from '@/lib/feature-flags';

interface FeatureFlagsContextType {
  flags: FeatureFlags;
  isLoading: boolean;
  error: string | null;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType>({
  flags: {
    waitlistEnabled: false,
    artistSearchEnabled: true,
    debugBannerEnabled: false, // Disabled by default
    tipPromoEnabled: true,
  },
  isLoading: true,
  error: null,
});

export function useFeatureFlags() {
  return useContext(FeatureFlagsContext);
}

interface FeatureFlagsProviderProps {
  children: React.ReactNode;
  initialFlags?: FeatureFlags;
}

export function FeatureFlagsProvider({
  children,
  initialFlags,
}: FeatureFlagsProviderProps) {
  const [flags, setFlags] = useState<FeatureFlags>(
    initialFlags || {
      waitlistEnabled: false,
      artistSearchEnabled: true,
      debugBannerEnabled: false, // Disabled by default
      tipPromoEnabled: true,
    }
  );
  const [isLoading, setIsLoading] = useState(!initialFlags);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialFlags) {
      // If we have initial flags from server, use them
      setFlags(initialFlags);
      setIsLoading(false);
      return;
    }

    // Otherwise, fetch flags on client side
    const fetchFlags = async () => {
      try {
        const fetchedFlags = await getFeatureFlags();
        setFlags(fetchedFlags);
        setError(null);
      } catch (err) {
        console.error('Error fetching feature flags:', err);
        setError('Failed to load feature flags');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlags();
  }, [initialFlags]);

  return (
    <FeatureFlagsContext.Provider value={{ flags, isLoading, error }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}
