import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { AuthActions } from '@/components/molecules/AuthActions';

// Mock the feature flags provider
vi.mock('@/components/providers/FeatureFlagsProvider', () => ({
  useFeatureFlags: () => ({
    flags: {
      waitlistEnabled: false,
      artistSearchEnabled: true,
      debugBannerEnabled: false,
      tipPromoEnabled: true,
    },
    isLoading: false,
    error: null,
  }),
}));

// Mock Clerk
vi.mock('@clerk/nextjs', () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SignUpButton: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useUser: () => ({
    isSignedIn: false,
  }),
}));

describe('AuthActions', () => {
  afterEach(cleanup);

  it('renders sign in and sign up buttons when user is not signed in', () => {
    render(<AuthActions />);

    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('renders with correct styling classes', () => {
    render(<AuthActions />);

    const container = screen.getByText('Sign in').closest('div')?.parentElement;
    expect(container).toHaveClass('flex', 'items-center', 'space-x-4');
  });
});
