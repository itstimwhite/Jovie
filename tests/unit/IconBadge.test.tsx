import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { IconBadge } from '@/components/atoms/IconBadge';
import { BoltIcon } from '@heroicons/react/24/outline';

describe('IconBadge', () => {
  afterEach(cleanup);

  it('renders icon with correct styling', () => {
    render(<IconBadge Icon={BoltIcon} colorVar="--accent-speed" />);

    const iconContainer = document.querySelector('div[class*="rounded-full"]');
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

    const iconContainer = document.querySelector('div[class*="custom-class"]');
    expect(iconContainer).toHaveClass('custom-class');
  });
});
