import * as Headless from '@headlessui/react';
import clsx from 'clsx';
import React, { forwardRef } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export function InputGroup({
  children,
}: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      data-slot="control"
      className={clsx(
        'relative isolate block',
        '[&_input]:has-[[data-slot=icon]:first-child]:pl-10 [&_input]:has-[[data-slot=icon]:last-child]:pr-10 sm:[&_input]:has-[[data-slot=icon]:first-child]:pl-8 sm:[&_input]:has-[[data-slot=icon]:last-child]:pr-8',
        'data-[slot=icon]:*:pointer-events-none data-[slot=icon]:*:absolute data-[slot=icon]:*:top-3 data-[slot=icon]:*:z-10 data-[slot=icon]:*:size-5 sm:data-[slot=icon]:*:top-2.5 sm:data-[slot=icon]:*:size-4',
        '[&>[data-slot=icon]:first-child]:left-3 sm:[&>[data-slot=icon]:first-child]:left-2.5 [&>[data-slot=icon]:last-child]:right-3 sm:[&>[data-slot=icon]:last-child]:right-2.5',
        'data-[slot=icon]:*:text-zinc-500 dark:data-[slot=icon]:*:text-zinc-400'
      )}
    >
      {children}
    </span>
  );
}

const dateTypes = ['date', 'datetime-local', 'month', 'time', 'week'];
type DateType = (typeof dateTypes)[number];

// Legacy interface for backward compatibility
interface LegacyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  loading?: boolean;
}

// New interface for Catalyst UI Kit
type InputProps = {
  className?: string;
  type?:
    | 'email'
    | 'number'
    | 'password'
    | 'search'
    | 'tel'
    | 'text'
    | 'url'
    | DateType;
  loading?: boolean;
} & Omit<Headless.InputProps, 'as' | 'className'>;

export const Input = forwardRef(function Input(
  {
    className,
    label,
    error,
    loading,
    ...props
  }: InputProps & Partial<LegacyInputProps>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const inputElement = (
    <span
      data-slot="control"
      className={clsx([
        className,
        // Basic layout
        'relative block w-full',
        // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
        'before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-white before:shadow-xs',
        // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
        'dark:before:hidden',
        // Focus ring
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset sm:focus-within:after:ring-2 sm:focus-within:after:ring-blue-500',
        // Disabled state
        'has-data-disabled:opacity-50 has-data-disabled:before:bg-zinc-950/5 has-data-disabled:before:shadow-none',
        // Invalid state
        'has-data-invalid:before:shadow-red-500/10',
        // Error state for legacy support
        error && 'has-data-invalid:before:shadow-red-500/10',
      ])}
    >
      <Headless.Input
        ref={ref}
        {...props}
        className={clsx([
          // Date classes
          props.type &&
            dateTypes.includes(props.type) && [
              '[&::-webkit-datetime-edit-fields-wrapper]:p-0',
              '[&::-webkit-date-and-time-value]:min-h-[1.5em]',
              '[&::-webkit-datetime-edit]:inline-flex',
              '[&::-webkit-datetime-edit]:p-0',
              '[&::-webkit-datetime-edit-year-field]:p-0',
              '[&::-webkit-datetime-edit-month-field]:p-0',
              '[&::-webkit-datetime-edit-day-field]:p-0',
              '[&::-webkit-datetime-edit-hour-field]:p-0',
              '[&::-webkit-datetime-edit-minute-field]:p-0',
              '[&::-webkit-datetime-edit-second-field]:p-0',
              '[&::-webkit-datetime-edit-millisecond-field]:p-0',
              '[&::-webkit-datetime-edit-meridiem-field]:p-0',
            ],
          // Basic layout
          'relative block w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]',
          // Typography
          'text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white',
          // Border
          'border border-zinc-950/10 data-hover:border-zinc-950/20 dark:border-white/10 dark:data-hover:border-white/20',
          // Background color
          'bg-transparent dark:bg-white/5',
          // Hide default focus styles
          'focus:outline-hidden',
          // Invalid state
          'data-invalid:border-red-500 data-invalid:data-hover:border-red-500 dark:data-invalid:border-red-500 dark:data-invalid:data-hover:border-red-500',
          // Disabled state
          'data-disabled:border-zinc-950/20 dark:data-disabled:border-white/15 dark:data-disabled:bg-white/2.5 dark:data-hover:data-disabled:border-white/15',
          // System icons
          'dark:scheme-dark',
          // Error state for legacy support
          error &&
            'border-red-500 data-hover:border-red-500 dark:border-red-500 dark:data-hover:border-red-500',
          // Loading state - add right padding for spinner
          loading && 'pr-10 sm:pr-8',
        ])}
      />

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 sm:right-2.5">
          <LoadingSpinner
            size="sm"
            className="text-zinc-500 dark:text-zinc-400"
          />
        </div>
      )}
    </span>
  );

  // If we have label or error, wrap in a container
  if (label || error) {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        {inputElement}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }

  return inputElement;
});
