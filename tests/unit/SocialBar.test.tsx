import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { SocialBar } from '@/components/organisms/SocialBar';
import type { SocialLink } from '@/types/db';

// Mock fetch for API calls
global.fetch = vi.fn();

describe('SocialBar', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const mockSocialLinks: SocialLink[] = [
    {
      id: '1',
      artist_id: 'test-artist',
      platform: 'instagram',
      url: 'https://instagram.com/test',
      clicks: 0,
      created_at: '2023-01-01T00:00:00Z',
    },
    {
      id: '2',
      artist_id: 'test-artist',
      platform: 'twitter',
      url: 'https://twitter.com/test',
      clicks: 0,
      created_at: '2023-01-01T00:00:00Z',
    },
  ];

  it('renders social icons with cursor pointer styling', () => {
    render(
      <SocialBar
        handle="test-artist"
        artistName="Test Artist"
        socialLinks={mockSocialLinks}
      />
    );

    // Check for specific social platforms instead of counting all links
    const instagramLink = screen.getByLabelText('Follow Test Artist on instagram');
    const twitterLink = screen.getByLabelText('Follow Test Artist on twitter');
    
    expect(instagramLink).toBeInTheDocument();
    expect(twitterLink).toBeInTheDocument();
    expect(instagramLink).toHaveClass('cursor-pointer');
    expect(twitterLink).toHaveClass('cursor-pointer');
  });

  it('returns null when no social links and no tip button provided', () => {
    const { container } = render(
      <SocialBar
        handle="test-artist"
        artistName="Test Artist"
        socialLinks={[]}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders tip button when showTipButton is true', () => {
    render(
      <SocialBar
        handle="test-artist"
        artistName="Test Artist"
        socialLinks={[]}
        showTipButton={true}
      />
    );

    const tipButton = screen.getByLabelText('Send a tip to Test Artist');
    expect(tipButton).toBeInTheDocument();
    expect(tipButton).toHaveTextContent('Tip');
  });

  it('renders both social links and tip button when both are provided', () => {
    render(
      <SocialBar
        handle="test-artist"
        artistName="Test Artist"
        socialLinks={mockSocialLinks}
        showTipButton={true}
      />
    );

    const instagramLink = screen.getByLabelText('Follow Test Artist on instagram');
    const twitterLink = screen.getByLabelText('Follow Test Artist on twitter');
    const tipButton = screen.getByLabelText('Send a tip to Test Artist');
    
    expect(instagramLink).toBeInTheDocument();
    expect(twitterLink).toBeInTheDocument();
    expect(tipButton).toBeInTheDocument();
  });

  it('applies proper accessibility attributes', () => {
    render(
      <SocialBar
        handle="test-artist"
        artistName="Test Artist"
        socialLinks={mockSocialLinks}
      />
    );

    const instagramLink = screen.getByLabelText('Follow Test Artist on instagram');
    const twitterLink = screen.getByLabelText('Follow Test Artist on twitter');
    
    expect(instagramLink).toHaveAttribute('title', 'Follow on instagram');
    expect(instagramLink).toHaveAttribute(
      'aria-label',
      'Follow Test Artist on instagram'
    );
    expect(twitterLink).toHaveAttribute('title', 'Follow on twitter');
    expect(twitterLink).toHaveAttribute(
      'aria-label',
      'Follow Test Artist on twitter'
    );
  });
});
