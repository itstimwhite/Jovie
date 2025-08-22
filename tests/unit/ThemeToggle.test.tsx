import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeProvider } from 'next-themes';
import { ThemeToggle } from '@/components/molecules/ThemeToggle';

// Mock PostHog
vi.mock('posthog-js', () => ({
  default: {
    capture: vi.fn(),
  },
}));

// Mock next-themes
const mockSetTheme = vi.fn();
vi.mock('next-themes', async () => {
  const actual = await vi.importActual('next-themes');
  return {
    ...actual,
    useTheme: () => ({
      theme: 'light',
      setTheme: mockSetTheme,
      resolvedTheme: 'light',
    }),
  };
});

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    {children}
  </ThemeProvider>
);

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders theme toggle button', () => {
    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label');
  });

  it('cycles through themes when clicked', () => {
    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('renders with different variants', () => {
    const { rerender } = render(
      <TestWrapper>
        <ThemeToggle variant="default" />
      </TestWrapper>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <ThemeToggle variant="subtle" />
      </TestWrapper>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <ThemeToggle variant="bold" />
      </TestWrapper>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(
      <TestWrapper>
        <ThemeToggle size="sm" />
      </TestWrapper>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <ThemeToggle size="md" />
      </TestWrapper>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <ThemeToggle size="lg" />
      </TestWrapper>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows labels when enabled', () => {
    render(
      <TestWrapper>
        <ThemeToggle showLabels />
      </TestWrapper>
    );

    // Labels should be visible
    expect(screen.getByText('Light')).toBeInTheDocument();
  });

  it('renders as dropdown when enabled', () => {
    render(
      <TestWrapper>
        <ThemeToggle dropdown />
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('handles keyboard navigation', () => {
    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('supports reduced motion', () => {
    render(
      <TestWrapper>
        <ThemeToggle reducedMotion />
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('calls onThemeChange callback', () => {
    const handleThemeChange = vi.fn();
    
    render(
      <TestWrapper>
        <ThemeToggle onThemeChange={handleThemeChange} />
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleThemeChange).toHaveBeenCalledWith('dark');
  });
});