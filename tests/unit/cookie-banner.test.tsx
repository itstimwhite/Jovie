import { render, screen } from '@testing-library/react';
import CookieBanner from '@/components/CookieBanner';
import { vi, describe, it, expect } from 'vitest';

vi.mock('@/lib/cookies/consent', () => ({
  saveConsent: vi.fn(),
}));

describe('CookieBanner', () => {
  it('renders banner and buttons', () => {
    render(<CookieBanner />);
    expect(screen.getByTestId('cookie-banner')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /accept all/i })
    ).toBeInTheDocument();
  });
});
