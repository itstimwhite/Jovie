import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { FlyoutItem } from '@/components/molecules/FlyoutItem';
import { BoltIcon } from '@heroicons/react/24/outline';
import type { Feature } from '@/lib/features';

const mockFeature: Feature = {
  slug: 'blazing-fast',
  title: 'Blazing Fast',
  blurb: 'Sub-100ms loads and 99.99% uptime—fans never wait.',
  href: '/features/performance',
  Icon: BoltIcon,
  colorVar: '--accent-speed',
};

describe('FlyoutItem', () => {
  afterEach(cleanup);

  it('renders feature information correctly', () => {
    render(<FlyoutItem feature={mockFeature} />);

    expect(screen.getByText('Blazing Fast')).toBeInTheDocument();
    expect(
      screen.getByText('Sub-100ms loads and 99.99% uptime—fans never wait.')
    ).toBeInTheDocument();
  });

  it('renders as a link with correct href', () => {
    render(<FlyoutItem feature={mockFeature} />);

    const link = screen.getByRole('menuitem');
    expect(link).toHaveAttribute('href', '/features/performance');
  });

  it('has proper accessibility attributes', () => {
    render(<FlyoutItem feature={mockFeature} />);

    const link = screen.getByRole('menuitem');
    expect(link).toHaveAttribute('role', 'menuitem');
  });
});
