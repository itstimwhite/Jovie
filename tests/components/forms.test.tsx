import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ClaimHandleForm } from '@/components/home/ClaimHandleForm';
import { ProfileForm } from '@/components/dashboard/organisms/ProfileForm';
import { ErrorSummary } from '@/components/ui/ErrorSummary';

// Mock the router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock Clerk
vi.mock('@clerk/nextjs', () => ({
  useAuth: () => ({
    isSignedIn: true,
    has: () => false,
  }),
  useUser: () => ({
    user: { id: 'test-user-id' },
  }),
}));

// Mock fetch for handle validation
global.fetch = vi.fn() as unknown as typeof fetch;

describe('Form Accessibility and Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock fetch to return handle is available
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ available: true }),
    });
  });

  describe('ErrorSummary Component', () => {
    it('renders error messages and provides focus functionality', async () => {
      const onFocusField = vi.fn();
      const errors = {
        name: 'Name is required',
        email: 'Email is invalid',
      };

      render(
        <ErrorSummary
          errors={errors}
          title="Please fix the errors"
          onFocusField={onFocusField}
        />
      );

      // Check title is rendered
      expect(screen.getByText('Please fix the errors')).toBeInTheDocument();

      // Check error messages are rendered
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is invalid')).toBeInTheDocument();

      // Check focus functionality
      fireEvent.click(screen.getByText('Name is required'));
      expect(onFocusField).toHaveBeenCalledWith('name');
    });

    it('does not render when there are no errors', () => {
      render(<ErrorSummary errors={{}} />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('ClaimHandleForm', () => {
    it('validates handle format and shows appropriate error messages', async () => {
      render(<ClaimHandleForm />);

      const input = screen.getByLabelText('Choose your handle');

      // Test invalid handle (too short)
      fireEvent.change(input, { target: { value: 'ab' } });
      fireEvent.blur(input);

      // Submit the form to trigger validation
      const submitButton = screen.getByText('Create Profile');
      fireEvent.click(submitButton);

      // Check error message is displayed
      await waitFor(() => {
        expect(
          screen.getByText('Handle must be at least 3 characters')
        ).toBeInTheDocument();
      });

      // Test valid handle
      fireEvent.change(input, { target: { value: 'valid-handle' } });

      // Wait for validation to complete
      await waitFor(() => {
        expect(
          screen.queryByText('Handle must be at least 3 characters')
        ).not.toBeInTheDocument();
      });
    });

    it('disables submit button when handle is invalid', async () => {
      render(<ClaimHandleForm />);

      const input = screen.getByLabelText('Choose your handle');
      const submitButton = screen.getByText('Create Profile');

      // Initially button should be disabled (no handle)
      expect(submitButton).toBeDisabled();

      // Enter invalid handle
      fireEvent.change(input, { target: { value: 'a' } });

      // Button should still be disabled
      expect(submitButton).toBeDisabled();

      // Enter valid handle
      fireEvent.change(input, { target: { value: 'valid-handle' } });

      // Wait for validation to complete
      await waitFor(() => {
        // Button should be enabled
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('ProfileForm', () => {
    const mockArtist = {
      id: 'test-id',
      name: 'Test Artist',
      tagline: 'Test tagline',
      image_url: '',
      settings: {},
      owner_user_id: 'test-user-id',
      handle: 'test-artist',
      spotify_id: 'test-spotify-id',
      published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
      links: [],
      is_verified: false,
      is_featured: false,
      marketing_opt_out: false,
    };

    const mockOnUpdate = vi.fn();

    it('validates required fields and shows error messages', async () => {
      render(<ProfileForm artist={mockArtist} onUpdate={mockOnUpdate} />);

      const nameInput = screen.getByLabelText(/Artist Name/i);

      // Clear the name field
      fireEvent.change(nameInput, { target: { value: '' } });

      // Submit the form
      const submitButton = screen.getByText('Update Profile');
      fireEvent.click(submitButton);

      // Check error message is displayed
      await waitFor(() => {
        expect(screen.getByText('Artist name is required')).toBeInTheDocument();
      });

      // Enter valid name
      fireEvent.change(nameInput, { target: { value: 'New Artist Name' } });

      // Submit again
      fireEvent.click(submitButton);

      // Check onUpdate was called
      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalled();
      });
    });

    it('shows loading state during submission', async () => {
      // Mock the Supabase client
      vi.mock('@/lib/supabase', () => ({
        useAuthenticatedSupabase: () => ({
          getAuthenticatedClient: () => ({
            from: () => ({
              update: () => ({
                eq: () => ({
                  select: () => ({
                    single: () =>
                      new Promise((resolve) =>
                        setTimeout(() => resolve({ data: mockArtist }), 100)
                      ),
                  }),
                }),
              }),
            }),
          }),
        }),
      }));

      render(<ProfileForm artist={mockArtist} onUpdate={mockOnUpdate} />);

      // Submit the form
      const submitButton = screen.getByText('Update Profile');
      fireEvent.click(submitButton);

      // Check loading state is shown
      expect(screen.getByText('Updating...')).toBeInTheDocument();

      // Wait for submission to complete
      await waitFor(() => {
        expect(screen.queryByText('Updating...')).not.toBeInTheDocument();
      });
    });
  });
});
