import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { Analytics } from '@/components/Analytics';
import * as analyticsModule from '@/lib/analytics';
import * as useConsentModule from '@/lib/cookies/useConsent';

// Mock the analytics module
vi.mock('@/lib/analytics', () => ({
  page: vi.fn(),
  initPostHog: vi.fn(),
}));

// Mock the useConsent hook
vi.mock('@/lib/cookies/useConsent', () => ({
  useConsent: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/test-path',
}));

describe('Analytics with consent', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not initialize PostHog or track page views when consent is not given', async () => {
    // Mock consent as not given
    vi.mocked(useConsentModule.useConsent).mockReturnValue({
      consent: { essential: true, analytics: false, marketing: false },
      loading: false,
      hasAnalyticsConsent: false,
    });

    render(<Analytics />);

    // Wait for any async operations
    await waitFor(() => {
      expect(analyticsModule.initPostHog).not.toHaveBeenCalled();
      expect(analyticsModule.page).not.toHaveBeenCalled();
    });
  });

  it('should initialize PostHog and track page views when consent is given', async () => {
    // Mock consent as given
    vi.mocked(useConsentModule.useConsent).mockReturnValue({
      consent: { essential: true, analytics: true, marketing: false },
      loading: false,
      hasAnalyticsConsent: true,
    });

    render(<Analytics />);

    // Wait for any async operations
    await waitFor(() => {
      expect(analyticsModule.initPostHog).toHaveBeenCalled();
      expect(analyticsModule.page).toHaveBeenCalledWith('/test-path', {
        url: '/test-path',
      });
    });
  });

  it('should not initialize PostHog or track page views when consent is still loading', async () => {
    // Mock consent as loading
    vi.mocked(useConsentModule.useConsent).mockReturnValue({
      consent: null,
      loading: true,
      hasAnalyticsConsent: false,
    });

    render(<Analytics />);

    // Wait for any async operations
    await waitFor(() => {
      expect(analyticsModule.initPostHog).not.toHaveBeenCalled();
      expect(analyticsModule.page).not.toHaveBeenCalled();
    });
  });
});
