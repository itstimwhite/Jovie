import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { OptimizedAvatar, ResponsiveAvatar } from '@/components/ui/OptimizedAvatar';

// Mock next/image with proper component that doesn't require ESLint disable
vi.mock('next/image', () => ({
  default: function MockNextImage(props: React.ComponentProps<'img'>) {
    // This mock simply renders an <img> with all props passed through
    const { width, height, priority, quality, placeholder, blurDataURL, sizes, fill, ...restProps } = props;
    return (
      <img
        {...restProps}
        data-testid="optimized-avatar"
        // Convert Next.js specific props to standard img attributes
        width={width ? String(width) : undefined}
        height={height ? String(height) : undefined}
        fetchPriority={priority ? 'high' : undefined}
      />
    );
  },
}));

describe('OptimizedAvatar', () => {
  afterEach(cleanup);

  it('renders correctly with valid src', () => {
    render(
      <OptimizedAvatar src="https://example.com/avatar.jpg" alt="Test avatar" />
    );

    const avatar = screen.getByTestId('optimized-avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    expect(avatar).toHaveAttribute('alt', 'Test avatar');
  });

  it('shows fallback when src is null', () => {
    render(<OptimizedAvatar src={null} alt="Test avatar" />);

    const avatar = screen.getByTestId('optimized-avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', '/android-chrome-192x192.png');
  });

  it('shows fallback when src is undefined', () => {
    render(<OptimizedAvatar src={undefined} alt="Test avatar" />);

    const avatar = screen.getByTestId('optimized-avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', '/android-chrome-192x192.png');
  });

  it('shows fallback on image error', () => {
    render(
      <OptimizedAvatar src="https://example.com/invalid.jpg" alt="Test avatar" />
    );

    const avatar = screen.getByTestId('optimized-avatar');
    fireEvent.error(avatar);

    expect(avatar).toHaveAttribute('src', '/android-chrome-192x192.png');
  });

  it('applies correct size', () => {
    const { rerender } = render(
      <OptimizedAvatar src="https://example.com/avatar.jpg" alt="Test" size={64} />
    );

    let avatar = screen.getByTestId('optimized-avatar');
    expect(avatar).toHaveAttribute('width', '64');
    expect(avatar).toHaveAttribute('height', '64');

    rerender(
      <OptimizedAvatar src="https://example.com/avatar.jpg" alt="Test" size={128} />
    );

    avatar = screen.getByTestId('optimized-avatar');
    expect(avatar).toHaveAttribute('width', '128');
    expect(avatar).toHaveAttribute('height', '128');
  });

  it('applies custom className', () => {
    render(
      <OptimizedAvatar
        src="https://example.com/avatar.jpg"
        alt="Test"
        className="custom-class"
      />
    );

    const container = screen.getByTestId('optimized-avatar').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('sets priority attribute when priority is true', () => {
    render(
      <OptimizedAvatar
        src="https://example.com/avatar.jpg"
        alt="Test"
        priority={true}
      />
    );

    const avatar = screen.getByTestId('optimized-avatar');
    expect(avatar).toHaveAttribute('fetchpriority', 'high');
  });

  it('shows loading state initially and hides after load', () => {
    render(
      <OptimizedAvatar src="https://example.com/avatar.jpg" alt="Test avatar" />
    );

    const avatar = screen.getByTestId('optimized-avatar');
    expect(avatar).toHaveClass('opacity-0');

    fireEvent.load(avatar);
    expect(avatar).toHaveClass('opacity-100');
  });
});

describe('ResponsiveAvatar', () => {
  afterEach(cleanup);

  it('renders correctly with valid src', () => {
    render(
      <ResponsiveAvatar src="https://example.com/avatar.jpg" alt="Test avatar" />
    );

    const avatar = screen.getByTestId('optimized-avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    expect(avatar).toHaveAttribute('alt', 'Test avatar');
  });

  it('applies responsive classes', () => {
    render(
      <ResponsiveAvatar src="https://example.com/avatar.jpg" alt="Test avatar" />
    );

    const container = screen.getByTestId('optimized-avatar').parentElement;
    expect(container).toHaveClass('w-16');
    expect(container).toHaveClass('h-16');
    expect(container).toHaveClass('md:w-32');
    expect(container).toHaveClass('md:h-32');
  });

  it('applies custom className', () => {
    render(
      <ResponsiveAvatar
        src="https://example.com/avatar.jpg"
        alt="Test"
        className="custom-class"
      />
    );

    const container = screen.getByTestId('optimized-avatar').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('shows fallback on image error', () => {
    render(
      <ResponsiveAvatar src="https://example.com/invalid.jpg" alt="Test avatar" />
    );

    const avatar = screen.getByTestId('optimized-avatar');
    fireEvent.error(avatar);

    expect(avatar).toHaveAttribute('src', '/android-chrome-192x192.png');
  });

  it('uses custom sizes attribute', () => {
    render(
      <ResponsiveAvatar
        src="https://example.com/avatar.jpg"
        alt="Test"
        sizes="(max-width: 500px) 32px, 64px"
      />
    );

    const avatar = screen.getByTestId('optimized-avatar');
    expect(avatar).toHaveAttribute('sizes', '(max-width: 500px) 32px, 64px');
  });
});

