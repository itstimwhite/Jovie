import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '@/components/ui/Button';

describe('Button Snapshots', () => {
  // Variants
  it('renders primary variant correctly', () => {
    const { container } = render(<Button variant='primary'>Primary</Button>);
    expect(container).toMatchSnapshot();
  });

  it('renders secondary variant correctly', () => {
    const { container } = render(
      <Button variant='secondary'>Secondary</Button>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders ghost variant correctly', () => {
    const { container } = render(<Button variant='ghost'>Ghost</Button>);
    expect(container).toMatchSnapshot();
  });

  it('renders outline variant correctly', () => {
    const { container } = render(<Button variant='outline'>Outline</Button>);
    expect(container).toMatchSnapshot();
  });

  it('renders plain variant correctly', () => {
    const { container } = render(<Button variant='plain'>Plain</Button>);
    expect(container).toMatchSnapshot();
  });

  // Sizes
  it('renders small size correctly', () => {
    const { container } = render(<Button size='sm'>Small</Button>);
    expect(container).toMatchSnapshot();
  });

  it('renders medium size correctly', () => {
    const { container } = render(<Button size='md'>Medium</Button>);
    expect(container).toMatchSnapshot();
  });

  it('renders large size correctly', () => {
    const { container } = render(<Button size='lg'>Large</Button>);
    expect(container).toMatchSnapshot();
  });

  // States
  it('renders disabled state correctly', () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    expect(container).toMatchSnapshot();
  });

  it('renders loading state correctly', () => {
    const { container } = render(<Button loading>Loading</Button>);
    expect(container).toMatchSnapshot();
  });

  // Combinations
  it('renders primary disabled correctly', () => {
    const { container } = render(
      <Button variant='primary' disabled>
        Primary Disabled
      </Button>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders secondary disabled correctly', () => {
    const { container } = render(
      <Button variant='secondary' disabled>
        Secondary Disabled
      </Button>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders outline disabled correctly', () => {
    const { container } = render(
      <Button variant='outline' disabled>
        Outline Disabled
      </Button>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with custom className correctly', () => {
    const { container } = render(
      <Button className='custom-class'>Custom Class</Button>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders as a link correctly', () => {
    const { container } = render(
      <Button as='a' href='#test'>
        Link Button
      </Button>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with icon correctly', () => {
    const { container } = render(
      <Button>
        <svg
          data-testid='test-icon'
          className='h-5 w-5 mr-2'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
        </svg>
        With Icon
      </Button>
    );
    expect(container).toMatchSnapshot();
  });
});
