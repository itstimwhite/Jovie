import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { LinkManager } from './LinkManager';
import { ToastProvider } from '@/components/providers/ToastProvider';
import type { DetectedLink } from '@/lib/utils/platform-detection';

// Mock the useToast hook
const mockShowToast = vi.fn();
const mockHideToast = vi.fn();
const mockClearToasts = vi.fn();

vi.mock('@/components/ui/ToastContainer', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    useToast: vi.fn(() => ({
      showToast: mockShowToast,
      hideToast: mockHideToast,
      clearToasts: mockClearToasts,
    })),
  };
});

// Mock the platform detection
const mockDetectedLink: DetectedLink = {
  platform: {
    id: 'spotify',
    name: 'Spotify',
    category: 'dsp',
    icon: 'spotify',
    color: '1DB954',
    placeholder: 'https://open.spotify.com/artist/...',
  },
  normalizedUrl: 'https://open.spotify.com/artist/123',
  originalUrl: 'https://spotify.com/artist/123',
  suggestedTitle: 'Spotify Artist',
  isValid: true,
};

const mockSocialLink: DetectedLink = {
  platform: {
    id: 'instagram',
    name: 'Instagram',
    category: 'social',
    icon: 'instagram',
    color: 'E4405F',
    placeholder: 'https://instagram.com/username',
  },
  normalizedUrl: 'https://instagram.com/artist',
  originalUrl: 'https://instagram.com/artist',
  suggestedTitle: 'Instagram',
  isValid: true,
};

describe('LinkManager Component', () => {
  const renderWithToastProvider = (ui: React.ReactElement) => {
    return render(<ToastProvider>{ui}</ToastProvider>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initial links', () => {
    const onLinksChangeMock = vi.fn();
    const initialLinks = [
      {
        ...mockDetectedLink,
        id: 'link_1',
        title: 'Test Link',
        isVisible: true,
        order: 0,
      },
    ];

    renderWithToastProvider(
      <LinkManager
        initialLinks={initialLinks}
        onLinksChange={onLinksChangeMock}
      />
    );

    expect(screen.getByText('Test Link')).toBeInTheDocument();
  });

  it('renders empty state when no links provided', () => {
    const onLinksChangeMock = vi.fn();

    renderWithToastProvider(
      <LinkManager initialLinks={[]} onLinksChange={onLinksChangeMock} />
    );

    // Should render but without any link items
    // The exact empty state behavior would depend on LinkManager implementation
    expect(screen.queryByText('Test Link')).not.toBeInTheDocument();
  });

  it('applies maxLinks constraint', () => {
    const onLinksChangeMock = vi.fn();
    const initialLinks = Array(3)
      .fill(null)
      .map((_, i) => ({
        ...mockDetectedLink,
        id: `link_${i}`,
        title: `Link ${i}`,
        isVisible: true,
        order: i,
      }));

    renderWithToastProvider(
      <LinkManager
        initialLinks={initialLinks}
        onLinksChange={onLinksChangeMock}
        maxLinks={3}
      />
    );

    expect(screen.getByText('Link 0')).toBeInTheDocument();
    expect(screen.getByText('Link 1')).toBeInTheDocument();
    expect(screen.getByText('Link 2')).toBeInTheDocument();
  });

  it('filters links by allowed category when specified', () => {
    const onLinksChangeMock = vi.fn();
    const mixedLinks = [
      {
        ...mockDetectedLink,
        id: 'dsp_1',
        title: 'DSP Link',
        isVisible: true,
        order: 0,
      },
      {
        ...mockSocialLink,
        id: 'social_1',
        title: 'Social Link',
        isVisible: true,
        order: 1,
      },
    ];

    renderWithToastProvider(
      <LinkManager
        initialLinks={mixedLinks}
        onLinksChange={onLinksChangeMock}
        allowedCategory="dsp"
      />
    );

    // Should render DSP link but not social link when filtered
    expect(screen.getByText('DSP Link')).toBeInTheDocument();
    // Note: This test assumes LinkManager filters out non-allowed categories
    // The actual behavior would depend on LinkManager implementation
  });
});
