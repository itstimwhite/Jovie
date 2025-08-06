import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { SocialBar } from '@/components/profile/SocialBar';
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

    const socialButtons = screen.getAllByRole('button');
    expect(socialButtons).toHaveLength(2);

    socialButtons.forEach((button) => {
      expect(button).toHaveClass('cursor-pointer');
    });
  });

  it('hides container when no social links provided', () => {
    const { container } = render(
      <SocialBar
        handle="test-artist"
        artistName="Test Artist"
        socialLinks={[]}
      />
    );

    const socialContainer = container.firstChild as HTMLElement;
    expect(socialContainer).toHaveClass('hidden');
  });

  it('applies proper accessibility attributes', () => {
    render(
      <SocialBar
        handle="test-artist"
        artistName="Test Artist"
        socialLinks={mockSocialLinks}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('title', 'Follow on instagram');
    expect(buttons[0]).toHaveAttribute(
      'aria-label',
      'Follow Test Artist on instagram'
    );
    expect(buttons[1]).toHaveAttribute('title', 'Follow on twitter');
    expect(buttons[1]).toHaveAttribute(
      'aria-label',
      'Follow Test Artist on twitter'
    );
  });
});
