import { render, screen } from '@testing-library/react';
import { TipMetricsCard } from '@/components/tipping/TipMetricsCard';
import * as useFeatureFlagsModule from '@/lib/hooks/useFeatureFlags';

// Mock the useFeatureFlags hook
vi.mock('@/lib/hooks/useFeatureFlags', () => ({
  useFeatureFlags: vi.fn(),
}));

describe('TipMetricsCard', () => {
  beforeEach(() => {
    // Default mock implementation
    vi.mocked(useFeatureFlagsModule.useFeatureFlags).mockReturnValue({
      tipPromoEnabled: true,
    } as any);
  });

  it('should not render when tipPromoEnabled is false', () => {
    // Override the mock for this test
    vi.mocked(useFeatureFlagsModule.useFeatureFlags).mockReturnValue({
      tipPromoEnabled: false,
    } as any);

    const { container } = render(<TipMetricsCard />);
    expect(container.firstChild).toBeNull();
  });

  it('should display "Not available yet" when no manualAmount is provided', () => {
    render(<TipMetricsCard />);

    expect(screen.getByText('Total Tips')).toBeInTheDocument();
    expect(screen.getByText('Not available yet')).toBeInTheDocument();
    expect(
      screen.getByText('Stripe integration coming soon')
    ).toBeInTheDocument();
  });

  it('should display the manualAmount when provided', () => {
    render(<TipMetricsCard manualAmount={125.5} />);

    expect(screen.getByText('Total Tips')).toBeInTheDocument();
    expect(screen.getByText('$125.50')).toBeInTheDocument();
    expect(screen.queryByText('Not available yet')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Stripe integration coming soon')
    ).not.toBeInTheDocument();
  });

  it('should display zero amount correctly', () => {
    render(<TipMetricsCard manualAmount={0} />);

    expect(screen.getByText('Total Tips')).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });
});
