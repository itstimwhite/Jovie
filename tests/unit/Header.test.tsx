import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// Import the individual atomic components to test them directly
import { LogoLink } from '@/components/atoms/LogoLink';
import { NavLink } from '@/components/atoms/NavLink';
import { AuthActions } from '@/components/molecules/AuthActions';

describe('Atomic Design Structure', () => {
  afterEach(cleanup);

  describe('Atoms', () => {
    it('LogoLink component works correctly', () => {
      render(<LogoLink />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/');
      expect(link).toHaveClass('flex', 'items-center', 'space-x-2');
    });

    it('NavLink component works correctly', () => {
      render(<NavLink href="/test">Test Link</NavLink>);

      const link = screen.getByRole('link', { name: 'Test Link' });
      expect(link).toHaveAttribute('href', '/test');
    });
  });

  describe('Molecules', () => {
    it('AuthActions component works correctly', () => {
      render(<AuthActions />);

      expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute(
        'href',
        '/sign-in'
      );
      expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute(
        'href',
        '/sign-up'
      );

      // Check that it's properly structured
      const container = screen.getByRole('link', {
        name: 'Sign In',
      }).parentElement;
      expect(container).toHaveClass('flex', 'items-center', 'space-x-4');
    });
  });

  describe('Atomic Design Principles', () => {
    it('components follow atomic design structure', () => {
      // Test that atoms can be composed into molecules
      render(
        <div className="flex items-center space-x-4">
          <LogoLink />
          <AuthActions />
        </div>
      );

      // Should have logo, sign in, and sign up links
      expect(screen.getByRole('link', { name: '' })).toHaveAttribute(
        'href',
        '/'
      ); // Logo link
      expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Sign Up' })).toBeInTheDocument();
    });
  });
});
