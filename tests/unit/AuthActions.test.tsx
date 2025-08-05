import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { AuthActions } from '@/components/molecules/AuthActions';

// Mock the feature flags
vi.mock('@/constants/app', () => ({
  FEATURE_FLAGS: {
    waitlistEnabled: false,
  },
}));

describe('AuthActions', () => {
  afterEach(cleanup);

  it('renders sign in and sign up links when waitlist is disabled', () => {
    render(<AuthActions />);
    
    expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute('href', '/sign-in');
    expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute('href', '/sign-up');
  });

  it('applies custom className', () => {
    render(<AuthActions className="custom-class" />);
    
    const container = screen.getByRole('link', { name: 'Sign In' }).parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('renders with correct styling classes', () => {
    render(<AuthActions />);
    
    const container = screen.getByRole('link', { name: 'Sign In' }).parentElement;
    expect(container).toHaveClass('flex', 'items-center', 'space-x-4');
  });
});