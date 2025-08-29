import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VenmoHandleCard } from './VenmoHandleCard';

describe('VenmoHandleCard', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders with initial value', () => {
    render(<VenmoHandleCard initialValue="testuser" />);
    
    expect(screen.getByText('@testuser')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('renders "Not set" when no initial value is provided', () => {
    render(<VenmoHandleCard />);
    
    expect(screen.getByText('Not set')).toBeInTheDocument();
  });

  it('enters edit mode when Edit button is clicked', () => {
    render(<VenmoHandleCard initialValue="testuser" />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('updates input value when typing', () => {
    render(<VenmoHandleCard initialValue="testuser" />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'newuser' } });
    
    expect(input).toHaveValue('newuser');
  });

  it('calls onSave when Save button is clicked with valid input', async () => {
    const mockSave = vi.fn().mockResolvedValue(undefined);
    render(<VenmoHandleCard initialValue="testuser" onSave={mockSave} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'newuser' } });
    
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(mockSave).toHaveBeenCalledWith('newuser');
    });
  });

  it('shows error message for invalid input', async () => {
    render(<VenmoHandleCard initialValue="testuser" />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'invalid user name' } }); // Contains spaces
    
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/can only contain/i)).toBeInTheDocument();
    });
  });

  it('reverts to original value when Cancel is clicked', () => {
    render(<VenmoHandleCard initialValue="testuser" />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'newuser' } });
    
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    
    expect(screen.getByText('@testuser')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('shows success message after saving', async () => {
    const mockSave = vi.fn().mockResolvedValue(undefined);
    render(<VenmoHandleCard initialValue="testuser" onSave={mockSave} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'newuser' } });
    
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Saved')).toBeInTheDocument();
    });
  });

  it('handles error during save', async () => {
    const mockSave = vi.fn().mockRejectedValue(new Error('Save failed'));
    render(<VenmoHandleCard initialValue="testuser" onSave={mockSave} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'newuser' } });
    
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/failed to save/i)).toBeInTheDocument();
    });
  });
});

