import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FeaturedArtists from '@/components/FeaturedArtists';

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
}));

vi.mock('framer-motion', () => ({
  motion: {
    ul: ({ children, ...props }: any) => <ul {...props}>{children}</ul>,
  },
  useScroll: () => ({ scrollYProgress: 0 }),
  useTransform: () => 0,
}));

describe('FeaturedArtists', () => {
  const artists = [
    { id: '1', name: 'Artist 1', src: 'https://i.scdn.co/image/a1' },
    { id: '2', name: 'Artist 2', src: 'https://i.scdn.co/image/a2' },
  ];

  it('renders artist avatars with alt text', () => {
    render(<FeaturedArtists artists={artists} />);
    artists.forEach((a) => {
      expect(screen.getAllByAltText(a.name).length).toBeGreaterThan(0);
    });
  });
});
