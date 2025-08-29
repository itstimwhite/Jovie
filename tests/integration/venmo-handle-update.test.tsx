import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VenmoHandleCard } from '@/components/tipping/VenmoHandleCard';
import { updateVenmoHandle } from '@/lib/actions/update-venmo-handle';

// Mock the server action
vi.mock('@/lib/actions/update-venmo-handle', () => ({
  updateVenmoHandle: vi.fn(),
}));

describe('Venmo Handle Update Integration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (updateVenmoHandle as any).mockResolvedValue({ venmoHandle: 'newuser' } as any);
  });

  it('updates Venmo handle and shows success message', async () => {
    render(
      <VenmoHandleCard 
        initialValue="testuser" 
        onSave={updateVenmoHandle}
      />
    );
    
    // Enter edit mode
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    // Change the value
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'newuser' } });
    
    // Save the changes
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    // Verify the server action was called
    await waitFor(() => {
      expect(updateVenmoHandle).toHaveBeenCalledWith('newuser');
    });
    
    // Verify success message is shown
    await waitFor(() => {
      expect(screen.getByText('Saved')).toBeInTheDocument();
    });
    
    // Verify we're back in view mode with the new value
    expect(screen.getByText('@newuser')).toBeInTheDocument();
  });

  it('shows error message when server action fails', async () => {
    (updateVenmoHandle as any).mockRejectedValue(new Error('Server error'));
    
    render(
      <VenmoHandleCard 
        initialValue="testuser" 
        onSave={updateVenmoHandle}
      />
    );
    
    // Enter edit mode
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    // Change the value
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'newuser' } });
    
    // Save the changes
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    // Verify error message is shown
    await waitFor(() => {
      expect(screen.getByText(/failed to save/i)).toBeInTheDocument();
    });
    
    // Verify we're still in edit mode
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('validates input before calling server action', async () => {
    render(
      <VenmoHandleCard 
        initialValue="testuser" 
        onSave={updateVenmoHandle}
      />
    );
    
    // Enter edit mode
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    // Enter invalid value
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'invalid@user' } });
    
    // Try to save
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    // Verify validation error is shown
    await waitFor(() => {
      expect(screen.getByText(/can only contain/i)).toBeInTheDocument();
    });
    
    // Verify server action was not called
    expect(updateVenmoHandle).not.toHaveBeenCalled();
  });
});
