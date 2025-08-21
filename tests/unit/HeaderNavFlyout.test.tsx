import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { HeaderNav } from '@/components/organisms/HeaderNav';

let matchMediaMock: any;

describe('HeaderNav flyout interactions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    matchMediaMock = vi
      .spyOn(window, 'matchMedia')
      .mockImplementation((query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
  });

  afterEach(() => {
    vi.useRealTimers();
    matchMediaMock.mockRestore();
  });

  it('keeps flyout open when re-entering before delay and closes after', () => {
    render(<HeaderNav />);
    const wrapper = screen.getByTestId('product-flyout-wrapper');

    fireEvent.pointerEnter(wrapper);
    expect(screen.getAllByRole('menu').length).toBeGreaterThan(0);

    fireEvent.pointerLeave(wrapper);
    act(() => {
      vi.advanceTimersByTime(50);
    });
    fireEvent.pointerEnter(wrapper);
    expect(screen.getAllByRole('menu').length).toBeGreaterThan(0);

    fireEvent.pointerLeave(wrapper);
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(screen.queryAllByRole('menu')).toHaveLength(0);
  });
});
