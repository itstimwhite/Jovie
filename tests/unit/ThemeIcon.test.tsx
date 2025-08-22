import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeIcon } from '@/components/atoms/ThemeIcon';

describe('ThemeIcon', () => {
  it('renders light theme icon', () => {
    render(<ThemeIcon theme="light" isActive />);
    
    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
  });

  it('renders dark theme icon', () => {
    render(<ThemeIcon theme="dark" isActive />);
    
    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
  });

  it('renders system theme icon', () => {
    render(<ThemeIcon theme="system" isActive />);
    
    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
  });

  it('applies different sizes', () => {
    const { rerender } = render(<ThemeIcon theme="light" size="sm" />);
    expect(screen.getByRole('img', { hidden: true })).toHaveClass('h-4', 'w-4');

    rerender(<ThemeIcon theme="light" size="md" />);
    expect(screen.getByRole('img', { hidden: true })).toHaveClass('h-5', 'w-5');

    rerender(<ThemeIcon theme="light" size="lg" />);
    expect(screen.getByRole('img', { hidden: true })).toHaveClass('h-6', 'w-6');
  });

  it('applies active and inactive states', () => {
    const { rerender } = render(<ThemeIcon theme="light" isActive={true} />);
    expect(screen.getByRole('img', { hidden: true })).toHaveClass('text-current');

    rerender(<ThemeIcon theme="light" isActive={false} />);
    expect(screen.getByRole('img', { hidden: true })).toHaveClass('text-gray-500');
  });

  it('supports reduced motion', () => {
    render(<ThemeIcon theme="light" reducedMotion />);
    
    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ThemeIcon theme="light" className="custom-class" />);
    
    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toHaveClass('custom-class');
  });
});