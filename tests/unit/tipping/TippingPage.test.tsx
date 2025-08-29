import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TippingPage from '@/app/dashboard/tipping/page';
import { type FeatureFlags } from '@/lib/feature-flags';

// Helper function to create default feature flags with overrides
function createTestFlags(overrides: Partial<FeatureFlags> = {}): FeatureFlags {
  return {
    artistSearchEnabled: true,
    debugBannerEnabled: false,
    tipPromoEnabled: true,
    pricingUseClerk: false,
    universalNotificationsEnabled: false,
    featureClickAnalyticsRpc: false,
    progressiveOnboardingEnabled: true,
    tipping_mvp: false,
    ...overrides,
  };
}

// Mock the auth function
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(() => ({ userId: 'test-user-id' })),
}));

// Mock the feature flags
vi.mock('@/lib/feature-flags', () => ({
  getServerFeatureFlags: vi.fn(),
}));

// Mock the TippingClient component
vi.mock('@/components/tipping/TippingClient', () => ({
  TippingClient: () => <div data-testid="tipping-client">Tipping Client</div>,
}));

// Mock the next/navigation module
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('TippingPage', () => {
  it('renders the tipping page when feature flag is enabled', async () => {
    // Set up the mock to return enabled feature flag
    const { getServerFeatureFlags } = await import('@/lib/feature-flags');
    vi.mocked(getServerFeatureFlags).mockResolvedValue(
      createTestFlags({ tipping_mvp: true })
    );

    // Render the component
    const page = await TippingPage();
    render(page);

    // Check if the page title is rendered
    expect(screen.getByText('Tipping')).toBeInTheDocument();
    expect(screen.getByText('Set up and manage your tipping options')).toBeInTheDocument();
    expect(screen.getByTestId('tipping-client')).toBeInTheDocument();
  });

  it('redirects to dashboard when feature flag is disabled', async () => {
    // Set up the mock to return disabled feature flag
    const { getServerFeatureFlags } = await import('@/lib/feature-flags');
    vi.mocked(getServerFeatureFlags).mockResolvedValue(
      createTestFlags({ tipping_mvp: false })
    );

    const { redirect } = await import('next/navigation');

    // Render the component
    await TippingPage();

    // Check if redirect was called with the correct path
    expect(redirect).toHaveBeenCalledWith('/dashboard');
  });
});

