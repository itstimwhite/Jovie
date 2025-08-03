import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, onError, onLoad, ...props }: any) => (
    <img
      src={src}
      alt={alt}
      onError={onError}
      onLoad={onLoad}
      {...props}
      data-testid="next-image"
    />
  ),
}));

describe('OptimizedImage', () => {
  afterEach(cleanup);

  it('renders correctly with valid src', () => {
    render(
      <OptimizedImage src="https://example.com/image.jpg" alt="Test image" />
    );

    const image = screen.getByTestId('next-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(image).toHaveAttribute('alt', 'Test image');
  });

  it('shows placeholder when src is null', () => {
    render(<OptimizedImage src={null} alt="Test image" />);

    expect(screen.queryByTestId('next-image')).not.toBeInTheDocument();
    // Check for placeholder content (div with SVG)
    const placeholders = screen.getAllByRole('generic');
    expect(placeholders.length).toBeGreaterThan(0);
  });

  it('shows placeholder when src is empty string', () => {
    render(<OptimizedImage src="" alt="Test image" />);

    expect(screen.queryByTestId('next-image')).not.toBeInTheDocument();
    // Check for placeholder content (div with SVG)
    const placeholders = screen.getAllByRole('generic');
    expect(placeholders.length).toBeGreaterThan(0);
  });

  it('shows placeholder on image error', () => {
    render(
      <OptimizedImage src="https://example.com/invalid.jpg" alt="Test image" />
    );

    const image = screen.getByTestId('next-image');
    fireEvent.error(image);

    // Check for placeholder content (div with SVG)
    const placeholders = screen.getAllByRole('generic');
    expect(placeholders.length).toBeGreaterThan(0);
  });

  it('shows loading skeleton initially', () => {
    render(
      <OptimizedImage src="https://example.com/image.jpg" alt="Test image" />
    );

    // Check for loading skeleton
    const skeletons = screen.getAllByRole('generic');
    const skeletonWithPulse = skeletons.find((el) =>
      el.classList.contains('animate-pulse')
    );
    expect(skeletonWithPulse).toBeInTheDocument();
  });

  it('hides loading skeleton when image loads', () => {
    render(
      <OptimizedImage src="https://example.com/image.jpg" alt="Test image" />
    );

    const image = screen.getByTestId('next-image');
    fireEvent.load(image);

    // The skeleton should be hidden after load
    expect(image).toHaveClass('opacity-100');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(
      <OptimizedImage
        src="https://example.com/image.jpg"
        alt="Test"
        size="sm"
      />
    );
    expect(screen.getByTestId('next-image')).toBeInTheDocument();

    rerender(
      <OptimizedImage
        src="https://example.com/image.jpg"
        alt="Test"
        size="md"
      />
    );
    expect(screen.getByTestId('next-image')).toBeInTheDocument();

    rerender(
      <OptimizedImage
        src="https://example.com/image.jpg"
        alt="Test"
        size="lg"
      />
    );
    expect(screen.getByTestId('next-image')).toBeInTheDocument();
  });

  it('renders with different shapes', () => {
    const { rerender } = render(
      <OptimizedImage
        src="https://example.com/image.jpg"
        alt="Test"
        shape="square"
      />
    );
    expect(screen.getByTestId('next-image')).toBeInTheDocument();

    rerender(
      <OptimizedImage
        src="https://example.com/image.jpg"
        alt="Test"
        shape="circle"
      />
    );
    expect(screen.getByTestId('next-image')).toBeInTheDocument();
  });

  it('renders with width and height', () => {
    render(
      <OptimizedImage
        src="https://example.com/image.jpg"
        alt="Test image"
        width={100}
        height={100}
      />
    );

    const image = screen.getByTestId('next-image');
    expect(image).toHaveAttribute('width', '100');
    expect(image).toHaveAttribute('height', '100');
  });
});
