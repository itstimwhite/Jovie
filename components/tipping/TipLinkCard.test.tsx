import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { TipLinkCard } from './TipLinkCard';
import { ToastProvider } from '@/components/providers/ToastProvider';

// Mock the clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

// Mock the window.open function
const mockWindowOpen = vi.fn();
window.open = mockWindowOpen;

// Mock the ToastContainer module
const mockShowToast = vi.fn();
vi.mock('@/components/ui/ToastContainer', () => {
  return {
    useToast: () => ({
      showToast: mockShowToast,
      hideToast: vi.fn(),
      clearToasts: vi.fn(),
    }),
  };
});

// Mock the getBaseUrl function
vi.mock('@/lib/utils/platform-detection', () => {
  return {
    getBaseUrl: () => 'https://jov.ie',
  };
});

describe('TipLinkCard Component', () => {
  const mockArtist = {
    id: '123',
    handle: 'testartist',
    name: 'Test Artist',
  };

  const renderWithToastProvider = (ui: React.ReactElement) => {
    return render(<ToastProvider>{ui}</ToastProvider>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the tip link correctly', () => {
    renderWithToastProvider(<TipLinkCard artist={mockArtist} />);

    // Check if the component renders with the correct URL
    expect(
      screen.getByText('https://jov.ie/testartist/tip')
    ).toBeInTheDocument();
    expect(screen.getByText('Your Tip Link')).toBeInTheDocument();
  });

  it('copies the link to clipboard when Copy Link button is clicked', async () => {
    renderWithToastProvider(<TipLinkCard artist={mockArtist} />);

    const copyButton = screen.getByRole('button', { name: /copy link/i });
    fireEvent.click(copyButton);

    // Verify clipboard API was called with the correct URL
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'https://jov.ie/testartist/tip'
    );

    // Verify toast was shown
    expect(mockShowToast).toHaveBeenCalledWith({
      message: 'Tip link copied to clipboard!',
      type: 'success',
      duration: 3000,
    });
  });

  it('opens the link in a new tab when Open Link button is clicked', () => {
    renderWithToastProvider(<TipLinkCard artist={mockArtist} />);

    const openButton = screen.getByRole('button', { name: /open link/i });
    fireEvent.click(openButton);

    // Verify window.open was called with the correct URL and options
    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://jov.ie/testartist/tip',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('handles artists without a handle gracefully', () => {
    const artistWithoutHandle = {
      id: '123',
      handle: '',
      name: 'Test Artist',
    };

    renderWithToastProvider(<TipLinkCard artist={artistWithoutHandle} />);

    // Should show URL with empty handle
    expect(screen.getByText('https://jov.ie//tip')).toBeInTheDocument();
  });
});
