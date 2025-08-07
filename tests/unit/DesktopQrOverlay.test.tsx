import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from '@testing-library/react';
import DesktopQrOverlay from '@/components/organisms/DesktopQrOverlay';
import { track } from '@/lib/analytics';

vi.mock('@/constants/app', () => ({ FEATURE_FLAGS: { desktopQr: true } }));
vi.mock('@/lib/analytics', () => ({ track: vi.fn() }));
vi.mock('qrcode.react', () => ({
  default: ({ value }: { value: string }) => (
    <div data-testid="qr" data-value={value} />
  ),
}));

describe('DesktopQrOverlay', () => {
  const originalMatchMedia = window.matchMedia;
  const originalRequestIdle = window.requestIdleCallback;
  const originalCancelIdle = window.cancelIdleCallback;

  const setDesktop = () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches:
        query.includes('min-width: 768px') ||
        query.includes('min-width:1024px'),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as any;
  };

  beforeEach(() => {
    localStorage.clear();
    (track as any).mockClear();
    setDesktop();
    window.requestIdleCallback = ((cb: IdleRequestCallback) => {
      cb({} as IdleDeadline);
      return 1;
    }) as any;
    window.cancelIdleCallback = (() => {}) as any;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    window.requestIdleCallback = originalRequestIdle;
    window.cancelIdleCallback = originalCancelIdle;
    cleanup();
  });

  it('renders QR after delay on desktop and tracks event', async () => {
    render(<DesktopQrOverlay handle="test" />);
    await waitFor(() => screen.getByText('View on mobile'));
    expect(screen.getByText('View on mobile')).toBeInTheDocument();
    expect(screen.getByTestId('qr').getAttribute('data-value')).toContain(
      'src=qr_desktop'
    );
    expect(track).toHaveBeenCalledWith('desktop_qr_shown', { profile: 'test' });
  });

  it('persists dismissal using localStorage', async () => {
    render(<DesktopQrOverlay handle="test" />);
    const dismissButton = await screen.findByLabelText('Dismiss');
    fireEvent.click(dismissButton);
    expect(localStorage.getItem('jovie_hide_qr')).toBeTruthy();
    cleanup();
    render(<DesktopQrOverlay handle="test" />);
    expect(screen.queryByText('View on mobile')).toBeNull();
  });
});
