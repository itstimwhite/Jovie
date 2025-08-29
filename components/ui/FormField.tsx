import React, { cloneElement, isValidElement, useId } from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  /**
   * Label text for the form field
   */
  label?: string;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Whether the field is required
   */
  required?: boolean;
  
  /**
   * Additional CSS classes for the form field container
   */
  className?: string;
  
  /**
   * The input element to render inside the form field
   */
  children: React.ReactNode;
  
  /**
   * Optional ID for the input element (will be generated if not provided)
   */
  id?: string;
  
  /**
   * Helper text to display below the label
   */
  helpText?: string;
  
  /**
   * Whether to display the helper text before the input element
   */
  helpTextPosition?: 'before' | 'after';
  
  /**
   * Additional CSS classes for the label
   */
  labelClassName?: string;
  
  /**
   * Additional CSS classes for the helper text
   */
  helpTextClassName?: string;
  
  /**
   * Additional CSS classes for the error message
   */
  errorClassName?: string;
}

export function FormField({
  label,
  error,
  required = false,
  className,
  children,
  id: providedId,
  helpText,
  helpTextPosition = 'before',
  labelClassName,
  helpTextClassName,
  errorClassName,
}: FormFieldProps) {
  // Generate unique IDs for accessibility connections
  const uniqueId = useId();
  const id = providedId || `field-${uniqueId}`;
  const errorId = `${id}-error`;
  const helpTextId = `${id}-help`;

  // Determine which description elements to connect via aria-describedby
  const getDescribedByIds = () => {
    const ids = [];
    if (helpText) ids.push(helpTextId);
    if (error) ids.push(errorId);
    return ids.length > 0 ? ids.join(' ') : undefined;
  };

  // Clone the child element to add accessibility attributes
  const childrenWithProps = React.Children.map(children, child => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        id,
        'aria-invalid': error ? 'true' : undefined,
        'aria-describedby': getDescribedByIds(),
        'aria-required': required ? 'true' : undefined,
      } as React.HTMLAttributes<HTMLElement>);
    }
    return child;
  });

  // Helper text component
  const HelperText = helpText ? (
    <p 
      id={helpTextId} 
      className={cn(
        'text-xs text-secondary',
        helpTextClassName
      )}
    >
      {helpText}
    </p>
  ) : null;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            'block text-sm font-medium text-primary',
            labelClassName
          )}
        >
          {label}
          {required && (
            <span className='text-red-500 ml-1' aria-hidden='true'>
              *
            </span>
          )}
          {required && <span className='sr-only'>(required)</span>}
        </label>
      )}

      {/* Helper text can be positioned before or after the input */}
      {helpText && helpTextPosition === 'before' && HelperText}

      {childrenWithProps}

      {/* Helper text can be positioned before or after the input */}
      {helpText && helpTextPosition === 'after' && HelperText}

      {error && (
        <p
          id={errorId}
          className={cn(
            'text-sm text-red-600 dark:text-red-400',
            errorClassName
          )}
          role='alert'
          aria-live='polite'
        >
          {error}
        </p>
      )}
    </div>
  );
}
