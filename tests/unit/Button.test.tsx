import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  afterEach(cleanup);

  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('relative', 'isolate', 'inline-flex');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant='primary'>Primary</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button variant='secondary'>Secondary</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button variant='ghost'>Ghost</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size='sm'>Small</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button size='md'>Medium</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button size='lg'>Large</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger click when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders with icons', () => {
    render(
      <Button>
        <svg data-testid='icon' />
        Button with icon
      </Button>
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Button with icon')).toBeInTheDocument();
  });

  it('renders as different elements', () => {
    const { rerender } = render(
      <Button as='a' href='/test'>
        Link Button
      </Button>
    );
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/test');

    rerender(<Button as='span'>Span Button</Button>);
    expect(screen.getByText('Span Button')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button className='custom-class'>Custom</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref Button</Button>);
    expect(ref).toHaveBeenCalled();
  });

  it('renders with outline-solid variant', () => {
    render(<Button outline>Outline</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('renders with plain variant', () => {
    render(<Button plain>Plain</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('renders with different colors', () => {
    const { rerender } = render(<Button color='indigo'>Indigo</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button color='red'>Red</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button color='green'>Green</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has cursor pointer styling for accessibility', () => {
    render(<Button>Clickable Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('cursor-pointer');
  });
});
