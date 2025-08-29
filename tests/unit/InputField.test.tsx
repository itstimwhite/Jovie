import { render, screen } from '@testing-library/react';
import { InputField } from '@/components/ui/InputField';

describe('InputField', () => {
  it('renders correctly with default props', () => {
    render(<InputField placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with a label', () => {
    render(<InputField label="Username" placeholder="Enter username" />);
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
  });

  it('renders with helper text before input by default', () => {
    render(
      <InputField 
        label="Username" 
        helpText="Must be at least 3 characters" 
        placeholder="Enter username" 
      />
    );
    
    const helpText = screen.getByText('Must be at least 3 characters');
    const input = screen.getByPlaceholderText('Enter username');
    
    expect(helpText).toBeInTheDocument();
    
    // Check that help text comes before input in the DOM
    const container = helpText.parentElement;
    const helpTextIndex = Array.from(container?.children || []).indexOf(helpText);
    const inputContainer = input.closest('[data-slot="control"]');
    const inputContainerParent = inputContainer?.parentElement;
    const inputIndex = Array.from(container?.children || []).indexOf(inputContainerParent!);
    
    expect(helpTextIndex).toBeLessThan(inputIndex);
  });

  it('renders with helper text after input when specified', () => {
    render(
      <InputField 
        label="Username" 
        helpText="Must be at least 3 characters" 
        helpTextPosition="after"
        placeholder="Enter username" 
      />
    );
    
    const helpText = screen.getByText('Must be at least 3 characters');
    const input = screen.getByPlaceholderText('Enter username');
    
    // Check that help text comes after input in the DOM
    const container = helpText.parentElement;
    const helpTextIndex = Array.from(container?.children || []).indexOf(helpText);
    const inputContainer = input.closest('[data-slot="control"]');
    const inputContainerParent = inputContainer?.parentElement;
    const inputIndex = Array.from(container?.children || []).indexOf(inputContainerParent!);
    
    expect(helpTextIndex).toBeGreaterThan(inputIndex);
  });

  it('renders with an error message', () => {
    render(
      <InputField 
        label="Username" 
        error="Username is required" 
        placeholder="Enter username" 
      />
    );
    
    expect(screen.getByText('Username is required')).toBeInTheDocument();
    
    // Check that the input has aria-invalid="true"
    const input = screen.getByPlaceholderText('Enter username');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders with required indicator', () => {
    render(
      <InputField 
        label="Username" 
        required 
        placeholder="Enter username" 
      />
    );
    
    // Check for the visible required indicator (*)
    const label = screen.getByText('Username');
    expect(label.textContent).toContain('*');
    
    // Check for the screen reader text
    expect(screen.getByText('(required)', { selector: '.sr-only' })).toBeInTheDocument();
    
    // Check that the input has aria-required="true"
    const input = screen.getByPlaceholderText('Enter username');
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  it('connects label, helper text, and error message with input via aria attributes', () => {
    render(
      <InputField 
        label="Username" 
        helpText="Must be at least 3 characters" 
        error="Username is required" 
        placeholder="Enter username" 
      />
    );
    
    const input = screen.getByPlaceholderText('Enter username');
    const describedBy = input.getAttribute('aria-describedby');
    
    // Check that aria-describedby contains IDs for both helper text and error message
    expect(describedBy).toBeTruthy();
    if (describedBy) {
      const ids = describedBy.split(' ');
      expect(ids.length).toBe(2); // One for helper text, one for error
      
      // Check that the IDs exist in the DOM
      ids.forEach(id => {
        expect(document.getElementById(id)).toBeInTheDocument();
      });
    }
  });
});

