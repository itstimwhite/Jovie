import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { IconBadge } from '@/components/atoms/IconBadge';
import { BoltIcon } from '@heroicons/react/24/outline';

describe('IconBadge', () => {
  afterEach(cleanup);

  it('renders icon with correct styling', () => {
    render(<IconBadge Icon={BoltIcon} colorVar="--accent-speed" />);

    const iconContainer = screen.getByRole('img', {
      hidden: true,
    }).parentElement;
    expect(iconContainer).toHaveClass('h-8', 'w-8', 'rounded-full');
  });

  it('applies custom className', () => {
    render(
      <IconBadge
        Icon={BoltIcon}
        colorVar="--accent-speed"
        className="custom-class"
      />
    );

    const iconContainer = screen.getByRole('img', {
      hidden: true,
    }).parentElement;
    expect(iconContainer).toHaveClass('custom-class');
  });
});
