import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import React from 'react';
import { Button } from './Button';

export interface EmptyErrorProps {
  /**
   * Title to display in the error state
   */
  title?: string;

  /**
   * Description text explaining the error
   */
  description?: string;

  /**
   * Label for the retry button
   */
  retryLabel?: string;

  /**
   * Function to call when retry button is clicked
   */
  onRetry?: () => void;

  /**
   * Whether the retry action is currently in progress
   */
  isRetrying?: boolean;

  /**
   * Additional CSS classes to apply to the component
   */
  className?: string;

  /**
   * Icon to display instead of the default error icon
   */
  icon?: React.ReactNode;
}

/**
 * EmptyError component for displaying error states with a retry option
 *
 * This component provides a standardized way to show error states across the application
 * with consistent styling and a retry mechanism.
 */
export function EmptyError({
  title = 'Something went wrong',
  description = 'We encountered an error while loading this content',
  retryLabel = 'Try again',
  onRetry,
  isRetrying = false,
  className = '',
  icon,
}: EmptyErrorProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center space-y-4 bg-surface-1 border border-subtle rounded-xl relative overflow-hidden ${className}`}
      role='alert'
      aria-live='polite'
    >
      {/* Error icon */}
      <div className='w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center'>
        {icon || (
          <ExclamationTriangleIcon className='w-6 h-6 text-orange-600 dark:text-orange-400' />
        )}
      </div>

      {/* Error message */}
      <div>
        <h3 className='text-sm font-medium text-primary mb-1'>{title}</h3>
        <p className='text-xs text-secondary'>{description}</p>
      </div>

      {/* Retry button */}
      {onRetry && (
        <Button
          onClick={onRetry}
          disabled={isRetrying}
          variant='secondary'
          size='sm'
          className='inline-flex items-center gap-2'
        >
          {isRetrying ? (
            <>
              <div className='w-3 h-3 border border-current border-t-transparent rounded-full animate-spin'></div>
              Retrying...
            </>
          ) : (
            <>
              <ArrowPathIcon className='w-3 h-3' />
              {retryLabel}
            </>
          )}
        </Button>
      )}
    </div>
  );
}
