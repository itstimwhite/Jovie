import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  FeatureFlagsProvider,
  useFeatureFlags,
} from '@/components/providers/FeatureFlagsProvider';
import { FeatureFlags } from '@/lib/feature-flags';

// Create a test component that uses the feature flags
const TestComponent = () => {
  const { flags, isLoading, error } = useFeatureFlags();

  if (isLoading) return <div data-testid="loading">Loading...</div>;
  if (error) return <div data-testid="error">{error}</div>;

  return (
    <div>
      <div data-testid="artist-search">
        {flags.artistSearchEnabled ? 'Enabled' : 'Disabled'}
      </div>
      <div data-testid="debug-banner">
        {flags.debugBannerEnabled ? 'Enabled' : 'Disabled'}
      </div>
      <div data-testid="tip-promo">
        {flags.tipPromoEnabled ? 'Enabled' : 'Disabled'}
      </div>
      <div data-testid="pricing-clerk">
        {flags.pricingUseClerk ? 'Enabled' : 'Disabled'}
      </div>
      <div data-testid="notifications">
        {flags.universalNotificationsEnabled ? 'Enabled' : 'Disabled'}
      </div>
      <div data-testid="analytics-rpc">
        {flags.featureClickAnalyticsRpc ? 'Enabled' : 'Disabled'}
      </div>
    </div>
  );
};

describe('FeatureFlagsProvider', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should provide default feature flags when no initialFlags are provided', () => {
    render(
      <FeatureFlagsProvider>
        <TestComponent />
      </FeatureFlagsProvider>
    );

    // Default flags should be used
    expect(screen.getByTestId('artist-search')).toHaveTextContent('Enabled');
    expect(screen.getByTestId('debug-banner')).toHaveTextContent('Disabled');
    expect(screen.getByTestId('tip-promo')).toHaveTextContent('Enabled');
    expect(screen.getByTestId('pricing-clerk')).toHaveTextContent('Disabled');
    expect(screen.getByTestId('notifications')).toHaveTextContent('Disabled');
    expect(screen.getByTestId('analytics-rpc')).toHaveTextContent('Disabled');
  });

  it('should use provided initialFlags', () => {
    const initialFlags: FeatureFlags = {
      artistSearchEnabled: false,
      debugBannerEnabled: true,
      tipPromoEnabled: false,
      pricingUseClerk: true,
      universalNotificationsEnabled: true,
      featureClickAnalyticsRpc: true,
    };

    render(
      <FeatureFlagsProvider initialFlags={initialFlags}>
        <TestComponent />
      </FeatureFlagsProvider>
    );

    // Custom flags should be used
    expect(screen.getByTestId('artist-search')).toHaveTextContent('Disabled');
    expect(screen.getByTestId('debug-banner')).toHaveTextContent('Enabled');
    expect(screen.getByTestId('tip-promo')).toHaveTextContent('Disabled');
    expect(screen.getByTestId('pricing-clerk')).toHaveTextContent('Enabled');
    expect(screen.getByTestId('notifications')).toHaveTextContent('Enabled');
    expect(screen.getByTestId('analytics-rpc')).toHaveTextContent('Enabled');
  });

  it('should not show loading state when initialFlags are provided', () => {
    const initialFlags: FeatureFlags = {
      artistSearchEnabled: true,
      debugBannerEnabled: false,
      tipPromoEnabled: true,
      pricingUseClerk: false,
      universalNotificationsEnabled: false,
      featureClickAnalyticsRpc: false,
    };

    render(
      <FeatureFlagsProvider initialFlags={initialFlags}>
        <TestComponent />
      </FeatureFlagsProvider>
    );

    // Loading state should not be shown
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });

  it('should update flags when initialFlags change', () => {
    // Initial render with one set of flags
    const { rerender } = render(
      <FeatureFlagsProvider
        initialFlags={{
          artistSearchEnabled: true,
          debugBannerEnabled: false,
          tipPromoEnabled: true,
          pricingUseClerk: false,
          universalNotificationsEnabled: false,
          featureClickAnalyticsRpc: false,
        }}
      >
        <TestComponent />
      </FeatureFlagsProvider>
    );

    // Verify initial flags
    expect(screen.getByTestId('artist-search')).toHaveTextContent('Enabled');
    expect(screen.getByTestId('debug-banner')).toHaveTextContent('Disabled');

    // Rerender with new flags
    rerender(
      <FeatureFlagsProvider
        initialFlags={{
          artistSearchEnabled: false,
          debugBannerEnabled: true,
          tipPromoEnabled: false,
          pricingUseClerk: true,
          universalNotificationsEnabled: true,
          featureClickAnalyticsRpc: true,
        }}
      >
        <TestComponent />
      </FeatureFlagsProvider>
    );

    // Verify flags were updated
    expect(screen.getByTestId('artist-search')).toHaveTextContent('Disabled');
    expect(screen.getByTestId('debug-banner')).toHaveTextContent('Enabled');
  });
});
