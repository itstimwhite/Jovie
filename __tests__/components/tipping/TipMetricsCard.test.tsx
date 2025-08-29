import { render, screen } from '@testing-library/react';
import { TipMetricsCard } from '@/components/tipping/TipMetricsCard';
import { useFeatureFlag } from '@/lib/analytics';

// Mock the analytics library
jest.mock('@/lib/analytics', () => ({
  useFeatureFlag: jest.fn(),
}));

describe('TipMetricsCard', () => {
  beforeEach(() => {
    (useFeatureFlag as jest.MockedFunction<typeof useFeatureFlag>).mockClear();
  });

  it('renders nothing when feature flag is disabled', () => {
    // Mock the feature flag to be disabled
    (useFeatureFlag as jest.MockedFunction<typeof useFeatureFlag>).mockReturnValue(false);
    
    const { container } = render(<TipMetricsCard artistHandle="artist123" />);
    
    // Component should not render anything when feature flag is disabled
    expect(container.firstChild).toBeNull();
  });

  it('renders the card with loading state when feature flag is enabled', () => {
    // Mock the feature flag to be enabled
    (useFeatureFlag as jest.MockedFunction<typeof useFeatureFlag>).mockReturnValue(true);
    
    render(<TipMetricsCard artistHandle="artist123" />);
    
    // Check that the card title is rendered
    expect(screen.getByText('Venmo Tip Clicks')).toBeInTheDocument();
    
    // Check that the loading state is shown initially
    expect(screen.getByText('Total clicks on "Tip with Venmo" button')).toBeInTheDocument();
  });
});

