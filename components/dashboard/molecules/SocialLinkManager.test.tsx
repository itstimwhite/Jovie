import React from 'react';
import { render, screen } from '@testing-library/react';
import { SocialLinkManager } from './SocialLinkManager';
import { vi } from 'vitest';
import { detectPlatform } from '@/lib/utils/platform-detection';

// Mock the LinkManager component
vi.mock('./LinkManager', () => ({
  LinkManager: vi.fn(
    ({
      initialLinks,
      onLinksChange,
      disabled,
      maxLinks,
      allowedCategory,
      title,
      description,
    }) => (
      <div data-testid="mock-link-manager">
        <div>initialLinks: {JSON.stringify(initialLinks)}</div>
        <div>disabled: {String(disabled)}</div>
        <div>maxLinks: {maxLinks}</div>
        <div>allowedCategory: {allowedCategory}</div>
        <div>title: {title}</div>
        <div>description: {description}</div>
        <button onClick={() => onLinksChange([])}>Clear Links</button>
      </div>
    )
  ),
}));

describe('SocialLinkManager Component', () => {
  const mockLinks = [
    {
      ...detectPlatform('https://instagram.com/test'),
      id: 'link_1',
      title: 'Instagram',
      isVisible: true,
      order: 0,
    },
    {
      ...detectPlatform('https://twitter.com/test'),
      id: 'link_2',
      title: 'Twitter',
      isVisible: true,
      order: 1,
    },
  ];

  const mockOnLinksChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders correctly with default props', () => {
    render(<SocialLinkManager onLinksChange={mockOnLinksChange} />);

    expect(screen.getByText('Social Links')).toBeInTheDocument();
    expect(
      screen.getByText(/Add your social media profiles/)
    ).toBeInTheDocument();
    expect(screen.getByTestId('mock-link-manager')).toBeInTheDocument();
    expect(screen.getByText('initialLinks: []')).toBeInTheDocument();
    expect(screen.getByText('disabled: false')).toBeInTheDocument();
    expect(screen.getByText('maxLinks: 10')).toBeInTheDocument();
    expect(screen.getByText('allowedCategory: social')).toBeInTheDocument();
  });

  test('passes initialLinks to LinkManager', () => {
    render(
      <SocialLinkManager
        initialLinks={mockLinks}
        onLinksChange={mockOnLinksChange}
      />
    );

    // Only social links should be passed to LinkManager
    const socialLinksJson = JSON.stringify(mockLinks);
    expect(
      screen.getByText(`initialLinks: ${socialLinksJson}`)
    ).toBeInTheDocument();
  });

  test('filters non-social links', () => {
    const mixedLinks = [
      ...mockLinks,
      {
        ...detectPlatform('https://spotify.com/artist/test'),
        id: 'link_3',
        title: 'Spotify',
        isVisible: true,
        order: 2,
      },
    ];

    render(
      <SocialLinkManager
        initialLinks={mixedLinks}
        onLinksChange={mockOnLinksChange}
      />
    );

    // Only social links should be passed to LinkManager
    const socialLinksJson = JSON.stringify(mockLinks);
    expect(
      screen.getByText(`initialLinks: ${socialLinksJson}`)
    ).toBeInTheDocument();
  });

  test('calls onLinksChange with filtered social links', () => {
    render(
      <SocialLinkManager
        initialLinks={mockLinks}
        onLinksChange={mockOnLinksChange}
      />
    );

    // Simulate LinkManager calling onLinksChange
    screen.getByText('Clear Links').click();

    // Should call parent onLinksChange with empty array
    expect(mockOnLinksChange).toHaveBeenCalledWith([]);
  });

  test('respects disabled and maxLinks props', () => {
    render(
      <SocialLinkManager
        initialLinks={mockLinks}
        onLinksChange={mockOnLinksChange}
        disabled={true}
        maxLinks={5}
      />
    );

    expect(screen.getByText('disabled: true')).toBeInTheDocument();
    expect(screen.getByText('maxLinks: 5')).toBeInTheDocument();
  });
});
