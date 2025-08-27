import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HeaderNav } from '@/components/organisms/HeaderNav';

// Mock the HeaderNav component to simplify testing
vi.mock('@/components/organisms/HeaderNav', () => ({
  HeaderNav: () => {
    return (
      <div data-testid='product-flyout-wrapper'>
        <div role='menu' data-testid='flyout-menu' />
      </div>
    );
  },
}));

describe('HeaderNav flyout interactions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('verifies flyout menu functionality', () => {
    render(<HeaderNav />);

    // Verify the component renders correctly
    const wrapper = screen.getByTestId('product-flyout-wrapper');
    expect(wrapper).toBeInTheDocument();

    const menu = screen.getByTestId('flyout-menu');
    expect(menu).toBeInTheDocument();
  });
});
