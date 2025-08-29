import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VenmoTipButton } from '@/components/profile/VenmoTipButton';
import { track } from '@/lib/analytics';
import { LegacySocialLink } from '@/types/db';

// Mock the analytics track function
vi.mock('@/lib/analytics', () => ({
  track: vi.fn(),
}));

// Mock the useFeatureFlags hook
vi.mock('@/lib/hooks/useFeatureFlags', () => ({
  useFeatureFlags: () => ({
    venmoTipButtonEnabled: true,
  }),
}));

describe('VenmoTipButton', () => {
  // Mock window.open
  const originalOpen = window.open;
  beforeEach(() => {
    window.open = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    window.open = originalOpen;
  });

  it('renders the button when venmo link exists and feature flag is enabled', () => {
    const socialLinks: LegacySocialLink[] = [
      {
        id: '1',
        artist_id: 'artist1',
        platform: 'venmo',
        url: 'https://venmo.com/testuser',
        clicks: 0,
        created_at: '2023-01-01T00:00:00Z',
      },
    ];

    render(
      <VenmoTipButton
        socialLinks={socialLinks}
        artistHandle="testartist"
        artistName="Test Artist"
      />
    );

    expect(screen.getByText('Tip with Venmo')).toBeInTheDocument();
  });

  it('does not render when no venmo link exists', () => {
    const socialLinks: LegacySocialLink[] = [
      {
        id: '1',
        artist_id: 'artist1',
        platform: 'instagram',
        url: 'https://instagram.com/testuser',
        clicks: 0,
        created_at: '2023-01-01T00:00:00Z',
      },
    ];

    render(
      <VenmoTipButton
        socialLinks={socialLinks}
        artistHandle="testartist"
        artistName="Test Artist"
      />
    );

    expect(screen.queryByText('Tip with Venmo')).not.toBeInTheDocument();
  });

  it('tracks click event and opens venmo link when clicked', () => {
    const venmoUrl = 'https://venmo.com/testuser';
    const socialLinks: LegacySocialLink[] = [
      {
        id: '1',
        artist_id: 'artist1',
        platform: 'venmo',
        url: venmoUrl,
        clicks: 0,
        created_at: '2023-01-01T00:00:00Z',
      },
    ];

    render(
      <VenmoTipButton
        socialLinks={socialLinks}
        artistHandle="testartist"
        artistName="Test Artist"
      />
    );

    const button = screen.getByText('Tip with Venmo');
    fireEvent.click(button);

    // Verify analytics event was fired
    expect(track).toHaveBeenCalledWith('tip_click', {
      artist_handle: 'testartist',
      artist_name: 'Test Artist',
      platform: 'venmo',
      venmo_handle: 'testuser',
    });

    // Verify window.open was called with the correct URL
    expect(window.open).toHaveBeenCalledWith(
      venmoUrl,
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('extracts venmo handle correctly from different URL formats', () => {
    // Test with /u/ format
    const socialLinks1: LegacySocialLink[] = [
      {
        id: '1',
        artist_id: 'artist1',
        platform: 'venmo',
        url: 'https://venmo.com/u/testuser',
        clicks: 0,
        created_at: '2023-01-01T00:00:00Z',
      },
    ];

    const { unmount } = render(
      <VenmoTipButton
        socialLinks={socialLinks1}
        artistHandle="testartist"
      />
    );

    const button1 = screen.getByText('Tip with Venmo');
    fireEvent.click(button1);

    expect(track).toHaveBeenCalledWith(
      'tip_click',
      expect.objectContaining({
        venmo_handle: 'testuser',
      })
    );

    unmount();
    vi.clearAllMocks();

    // Test with direct username format
    const socialLinks2: LegacySocialLink[] = [
      {
        id: '2',
        artist_id: 'artist1',
        platform: 'venmo',
        url: 'https://venmo.com/directuser',
        clicks: 0,
        created_at: '2023-01-01T00:00:00Z',
      },
    ];

    render(
      <VenmoTipButton
        socialLinks={socialLinks2}
        artistHandle="testartist"
      />
    );

    const button2 = screen.getByText('Tip with Venmo');
    fireEvent.click(button2);

    expect(track).toHaveBeenCalledWith(
      'tip_click',
      expect.objectContaining({
        venmo_handle: 'directuser',
      })
    );
  });
});

