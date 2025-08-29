import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { TipShareCard } from '@/components/tipping/TipShareCard';
import * as shareUtils from '@/lib/share';

// Mock the share utilities
vi.mock('@/lib/share', () => ({
  shareContent: vi.fn(),
  isShareSupported: vi.fn(),
}));

describe('TipShareCard', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render with share button when Web Share API is supported', () => {
    vi.mocked(shareUtils.isShareSupported).mockReturnValue(true);

    render(<TipShareCard tipUrl='https://example.com/tip/123' />);

    expect(screen.getByText('Share Tip Link')).toBeInTheDocument();
    expect(
      screen.getByText('Opens native share options on your device')
    ).toBeInTheDocument();
  });

  it('should render with copy button when Web Share API is not supported', () => {
    vi.mocked(shareUtils.isShareSupported).mockReturnValue(false);

    render(<TipShareCard tipUrl='https://example.com/tip/123' />);

    expect(screen.getByText('Copy Tip Link')).toBeInTheDocument();
    expect(
      screen.getByText('Copies the tip link to your clipboard')
    ).toBeInTheDocument();
  });

  it('should call shareContent with correct parameters when share button is clicked', async () => {
    vi.mocked(shareUtils.isShareSupported).mockReturnValue(true);
    vi.mocked(shareUtils.shareContent).mockResolvedValue(true);

    render(
      <TipShareCard
        tipUrl='https://example.com/tip/123'
        artistName='Test Artist'
      />
    );

    const shareButton = screen.getByText('Share Tip Link');
    fireEvent.click(shareButton);

    expect(shareUtils.shareContent).toHaveBeenCalledWith({
      url: 'https://example.com/tip/123',
      title: 'Support Test Artist',
      text: 'Help support Test Artist with a tip!',
    });
  });

  it('should use generic text when artistName is not provided', async () => {
    vi.mocked(shareUtils.isShareSupported).mockReturnValue(true);
    vi.mocked(shareUtils.shareContent).mockResolvedValue(true);

    render(<TipShareCard tipUrl='https://example.com/tip/123' />);

    const shareButton = screen.getByText('Share Tip Link');
    fireEvent.click(shareButton);

    expect(shareUtils.shareContent).toHaveBeenCalledWith({
      url: 'https://example.com/tip/123',
      title: 'Support this artist',
      text: 'Help support this artist with a tip!',
    });
  });

  it('should show processing state while sharing', async () => {
    vi.mocked(shareUtils.isShareSupported).mockReturnValue(true);

    // Create a promise that we can resolve manually to control the timing
    let resolveSharePromise: (value: boolean) => void;
    const sharePromise = new Promise<boolean>(resolve => {
      resolveSharePromise = resolve;
    });

    vi.mocked(shareUtils.shareContent).mockReturnValue(sharePromise);

    render(<TipShareCard tipUrl='https://example.com/tip/123' />);

    const shareButton = screen.getByText('Share Tip Link');
    fireEvent.click(shareButton);

    // Button should show processing state
    expect(screen.getByText('Processing...')).toBeInTheDocument();

    // Resolve the share promise
    resolveSharePromise!(true);

    // Wait for the state to update
    await vi.waitFor(() => {
      expect(screen.getByText('Share Tip Link')).toBeInTheDocument();
    });
  });
});
