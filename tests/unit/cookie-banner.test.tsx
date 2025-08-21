import { render, screen } from '@testing-library/react';
import { CookieBannerSection } from '@/components/organisms/CookieBannerSection';
import { vi, describe, it, expect } from 'vitest';

vi.mock('@/lib/cookies/consent', () => ({
  saveConsent: vi.fn(),
}));

describe('CookieBannerSection', () => {
  it('renders banner and buttons', () => {
    render(<CookieBannerSection />);
    expect(screen.getByTestId('cookie-banner')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /accept all/i })
    ).toBeInTheDocument();
  });
});
