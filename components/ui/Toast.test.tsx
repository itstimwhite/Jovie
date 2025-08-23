import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import { Toast } from './Toast';

describe('Toast Component', () => {
  it('renders with default props', () => {
    const onCloseMock = vi.fn();
    render(
      <Toast id="test-toast" message="Test message" onClose={onCloseMock} />
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-gray-900');
  });

  it('renders with different types', () => {
    const { rerender } = render(
      <Toast id="test-toast" message="Success message" type="success" />
    );
    expect(screen.getByRole('alert')).toHaveClass('bg-green-600');

    rerender(
      <Toast id="test-toast" message="Warning message" type="warning" />
    );
    expect(screen.getByRole('alert')).toHaveClass('bg-amber-500');

    rerender(<Toast id="test-toast" message="Error message" type="error" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-red-600');
  });

  it('renders with action button', async () => {
    const actionMock = vi.fn();
    const user = userEvent.setup();

    render(
      <Toast
        id="test-toast"
        message="Action message"
        action={{
          label: 'Undo',
          onClick: actionMock,
        }}
      />
    );

    const actionButton = screen.getByText('Undo');
    expect(actionButton).toBeInTheDocument();

    await user.click(actionButton);
    expect(actionMock).toHaveBeenCalledTimes(1);
  });

  it('calls onClose after duration', async () => {
    vi.useFakeTimers();
    const onCloseMock = vi.fn();

    render(
      <Toast
        id="test-toast"
        message="Auto close message"
        duration={1000}
        onClose={onCloseMock}
      />
    );

    expect(onCloseMock).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    await waitFor(() => {
      expect(screen.getByRole('alert')).not.toHaveClass('animate-in');
      expect(screen.getByRole('alert')).toHaveClass('animate-out');
    });

    vi.advanceTimersByTime(300);
    expect(onCloseMock).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('does not auto-close when duration is 0', async () => {
    vi.useFakeTimers();
    const onCloseMock = vi.fn();

    render(
      <Toast
        id="test-toast"
        message="No auto close"
        duration={0}
        onClose={onCloseMock}
      />
    );

    vi.advanceTimersByTime(10000);
    expect(onCloseMock).not.toHaveBeenCalled();

    vi.useRealTimers();
  });
});
