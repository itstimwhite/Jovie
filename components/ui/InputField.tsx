import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { FormField } from './FormField';
import { Input } from './Input';

// Define our own InputProps to avoid dependency on the internal InputProps type
type InputFieldBaseProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  loading?: boolean;
  inputClassName?: string;
};

export interface InputFieldProps extends InputFieldBaseProps {
  /**
   * Label text for the input field
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
   * Helper text to display
   */
  helpText?: string;
  
  /**
   * Whether to display the helper text before or after the input
   */
  helpTextPosition?: 'before' | 'after';
  
  /**
   * Additional CSS classes for the form field container
   */
  containerClassName?: string;
  
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

/**
 * InputField component that combines FormField and Input
 * 
 * This component provides a standardized way to render input fields with labels,
 * helper text, and error messages.
 */
export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField(
    {
      label,
      error,
      required,
      helpText,
      helpTextPosition,
      containerClassName,
      labelClassName,
      helpTextClassName,
      errorClassName,
      className,
      ...props
    },
    ref
  ) {
    return (
      <FormField
        label={label}
        error={error}
        required={required}
        helpText={helpText}
        helpTextPosition={helpTextPosition}
        className={containerClassName}
        labelClassName={labelClassName}
        helpTextClassName={helpTextClassName}
        errorClassName={errorClassName}
      >
        <Input
          ref={ref}
          className={cn(className)}
          {...props}
        />
      </FormField>
    );
  }
);
