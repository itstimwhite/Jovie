import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { EmptyError } from './EmptyError';

describe('EmptyError', () => {
  it('renders with default props', () => {
    render(<EmptyError />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText('We encountered an error while loading this content')
    ).toBeInTheDocument();
    // No retry button should be present when onRetry is not provided
    expect(screen.queryByText('Try again')).not.toBeInTheDocument();
  });

  it('renders with custom props', () => {
    render(
      <EmptyError
        title='Custom Error Title'
        description='Custom error description'
        retryLabel='Custom Retry'
        onRetry={() => {}}
      />
    );

    expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
    expect(screen.getByText('Custom error description')).toBeInTheDocument();
    expect(screen.getByText('Custom Retry')).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const handleRetry = vi.fn();
    render(<EmptyError onRetry={handleRetry} />);

    const retryButton = screen.getByText('Try again');
    fireEvent.click(retryButton);

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when isRetrying is true', () => {
    render(<EmptyError onRetry={() => {}} isRetrying={true} />);

    expect(screen.getByText('Retrying...')).toBeInTheDocument();
    // The button should be disabled during retry
    const retryButton = screen.getByRole('button');
    expect(retryButton).toBeDisabled();
  });

  it('applies custom className', () => {
    const { container } = render(<EmptyError className='custom-class' />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders custom icon when provided', () => {
    const customIcon = <div data-testid='custom-icon'>Custom Icon</div>;
    render(<EmptyError icon={customIcon} />);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});
