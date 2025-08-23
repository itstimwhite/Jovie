import React from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { LinkManager } from './LinkManager';
import { ToastProvider } from '@/components/providers/ToastProvider';
import type { DetectedLink } from '@/lib/utils/platform-detection';

// Mock the useToast hook
vi.mock('@/components/ui/ToastContainer', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    useToast: vi.fn(() => ({
      showToast: vi.fn(),
      hideToast: vi.fn(),
      clearToasts: vi.fn(),
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

  it('shows max links toast when trying to add more than maxLinks', async () => {
    const onLinksChangeMock = vi.fn();
    const showToastMock = vi.fn();
    const { useToast } = await import('@/components/ui/ToastContainer');

    // Set up mock implementation for this test
    (useToast as ReturnType<typeof vi.fn>).mockReturnValue({
      showToast: showToastMock,
      hideToast: vi.fn(),
      clearToasts: vi.fn(),
    });

    const initialLinks = Array(5)
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
        maxLinks={5}
      />
    );

    // Simulate adding a new link when already at max
    const addLinkFn = vi.spyOn(React, 'useCallback').mock.results[1].value;
    addLinkFn(mockDetectedLink);

    expect(showToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Maximum of 5 links allowed',
        type: 'warning',
      })
    );
    expect(onLinksChangeMock).not.toHaveBeenCalled();
  });

  it('shows invalid platform toast when platform category is not allowed', async () => {
    const onLinksChangeMock = vi.fn();
    const showToastMock = vi.fn();
    const { useToast } = await import('@/components/ui/ToastContainer');

    // Set up mock implementation for this test
    (useToast as ReturnType<typeof vi.fn>).mockReturnValue({
      showToast: showToastMock,
      hideToast: vi.fn(),
      clearToasts: vi.fn(),
    });

    renderWithToastProvider(
      <LinkManager
        initialLinks={[]}
        onLinksChange={onLinksChangeMock}
        allowedCategory="dsp"
      />
    );

    // Simulate adding a social link when only DSP is allowed
    const addLinkFn = vi.spyOn(React, 'useCallback').mock.results[1].value;
    addLinkFn(mockSocialLink);

    expect(showToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Instagram links are not allowed in this section',
        type: 'error',
      })
    );
    expect(onLinksChangeMock).not.toHaveBeenCalled();
  });

  it('shows undo toast when deleting a link', async () => {
    const onLinksChangeMock = vi.fn();
    const showToastMock = vi.fn();
    const { useToast } = await import('@/components/ui/ToastContainer');

    // Set up mock implementation for this test
    (useToast as ReturnType<typeof vi.fn>).mockReturnValue({
      showToast: showToastMock,
      hideToast: vi.fn(),
      clearToasts: vi.fn(),
    });

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

    // Simulate deleting a link
    const deleteLinkFn = vi.spyOn(React, 'useCallback').mock.results[2].value;
    deleteLinkFn('link_1');

    expect(showToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Deleted "Test Link"',
        type: 'info',
        action: expect.objectContaining({
          label: 'Undo',
        }),
      })
    );
    expect(onLinksChangeMock).toHaveBeenCalledWith([]);
  });

  it('restores deleted link when undo is clicked', async () => {
    const onLinksChangeMock = vi.fn();
    const showToastMock = vi.fn();
    const { useToast } = await import('@/components/ui/ToastContainer');

    // Set up mock implementation for this test
    (useToast as ReturnType<typeof vi.fn>).mockReturnValue({
      showToast: showToastMock,
      hideToast: vi.fn(),
      clearToasts: vi.fn(),
    });

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

    // Simulate deleting a link
    const deleteLinkFn = vi.spyOn(React, 'useCallback').mock.results[2].value;
    deleteLinkFn('link_1');

    // Reset the mock to check for the next call
    onLinksChangeMock.mockClear();

    // Simulate clicking undo
    const undoDeleteFn = vi.spyOn(React, 'useCallback').mock.results[3].value;
    undoDeleteFn('link_1');

    expect(showToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Restored "Test Link"',
        type: 'success',
      })
    );
    expect(onLinksChangeMock).toHaveBeenCalledWith(initialLinks);
  });
});
