import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { NavLink } from '@/components/atoms/NavLink';

describe('NavLink', () => {
  afterEach(cleanup);

  it('renders with default variant', () => {
    render(<NavLink href='/test'>Test Link</NavLink>);

    const link = screen.getByRole('link', { name: 'Test Link' });
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveClass('text-sm');
  });

  it('renders with primary variant', () => {
    render(
      <NavLink href='/test' variant='primary'>
        Test Link
      </NavLink>
    );

    const link = screen.getByRole('link', { name: 'Test Link' });
    expect(link).toHaveClass('bg-gray-900');
    expect(link).toHaveClass('text-white');
  });

  it('applies custom className', () => {
    render(
      <NavLink href='/test' className='custom-class'>
        Test Link
      </NavLink>
    );

    const link = screen.getByRole('link', { name: 'Test Link' });
    expect(link).toHaveClass('custom-class');
  });

  it('renders children correctly', () => {
    render(<NavLink href='/test'>Custom Content</NavLink>);

    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });
});
