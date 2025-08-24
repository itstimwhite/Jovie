import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Toast } from './Toast';
import { ToastProvider, useToast } from './ToastContainer';
import { act } from 'react-dom/test-utils';

// Mock the useReducedMotion and useAudioContext hooks
vi.mock('@/lib/hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

vi.mock('@/lib/hooks/useAudioContext', () => ({
  useAudioContext: () => ({
    isMuted: false,
    isSupported: true,
    playSound: vi.fn(),
  }),
}));

describe('Toast Component', () => {
  it('renders with the correct message and type', () => {
    const onClose = vi.fn();
    
    render(
      <Toast
        id="test-toast"
        message="Test message"
        type="success"
        onClose={onClose}
      />
    );
    
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-green-50');
  });
  
  it('renders with an action button', () => {
    const onClose = vi.fn();
    const onClick = vi.fn();
    
    render(
      <Toast
        id="test-toast"
        message="Test message"
        type="info"
        onClose={onClose}
        action={{ label: 'Action', onClick }}
      />
    );
    
    const actionButton = screen.getByText('Action');
    expect(actionButton).toBeInTheDocument();
    
    fireEvent.click(actionButton);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  
  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    
    render(
      <Toast
        id="test-toast"
        message="Test message"
        type="warning"
        onClose={onClose}
      />
    );
    
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    
    // Wait for animation to complete
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    }, { timeout: 500 });
  });
});

// Test component to test the useToast hook
const TestComponent = () => {
  const { showToast, clearToasts } = useToast();
  
  return (
    <div>
      <button 
        onClick={() => showToast({ message: 'Info toast', type: 'info' })}
        data-testid="show-info"
      >
        Show Info
      </button>
      <button 
        onClick={() => showToast({ message: 'Success toast', type: 'success' })}
        data-testid="show-success"
      >
        Show Success
      </button>
      <button 
        onClick={() => clearToasts()}
        data-testid="clear-toasts"
      >
        Clear Toasts
      </button>
    </div>
  );
};

describe('ToastProvider and useToast', () => {
  beforeEach(() => {
    // Clear any previous toasts
    document.body.innerHTML = '';
  });
  
  it('shows a toast when showToast is called', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const showInfoButton = screen.getByTestId('show-info');
    fireEvent.click(showInfoButton);
    
    await waitFor(() => {
      expect(screen.getByText('Info toast')).toBeInTheDocument();
    });
  });
  
  it('clears all toasts when clearToasts is called', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    // Show multiple toasts
    const showInfoButton = screen.getByTestId('show-info');
    const showSuccessButton = screen.getByTestId('show-success');
    
    fireEvent.click(showInfoButton);
    fireEvent.click(showSuccessButton);
    
    await waitFor(() => {
      expect(screen.getByText('Info toast')).toBeInTheDocument();
      expect(screen.getByText('Success toast')).toBeInTheDocument();
    });
    
    // Clear all toasts
    const clearToastsButton = screen.getByTestId('clear-toasts');
    fireEvent.click(clearToastsButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Info toast')).not.toBeInTheDocument();
      expect(screen.queryByText('Success toast')).not.toBeInTheDocument();
    });
  });
  
  it('respects the maxToasts prop', async () => {
    render(
      <ToastProvider maxToasts={2}>
        <TestComponent />
      </ToastProvider>
    );
    
    const showInfoButton = screen.getByTestId('show-info');
    
    // Show 3 toasts (should only display the last 2)
    act(() => {
      fireEvent.click(showInfoButton); // Toast 1
      fireEvent.click(showInfoButton); // Toast 2
      fireEvent.click(showInfoButton); // Toast 3
    });
    
    // Wait for toasts to render
    await waitFor(() => {
      const toasts = screen.getAllByText('Info toast');
      expect(toasts.length).toBe(2); // Only 2 toasts should be visible
    });
  });
});
