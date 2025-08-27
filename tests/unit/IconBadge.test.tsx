import { BoltIcon } from '@heroicons/react/24/outline';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { IconBadge } from '@/components/atoms/IconBadge';

describe('IconBadge', () => {
  afterEach(cleanup);

  it('renders icon with correct styling', () => {
    render(<IconBadge Icon={BoltIcon} colorVar='--accent-speed' />);

    const iconContainer = screen.getByRole('img', {
      hidden: true,
    }).parentElement;
    expect(iconContainer).toHaveClass('h-8', 'w-8', 'rounded-full');
  });

  it('applies custom className', () => {
    render(
      <IconBadge
        Icon={BoltIcon}
        colorVar='--accent-speed'
        className='custom-class'
      />
    );

    const iconContainer = screen.getByRole('img', {
      hidden: true,
    }).parentElement;
    expect(iconContainer).toHaveClass('custom-class');
  });
});
