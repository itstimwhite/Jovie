'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Spinner } from './Spinner';

type PrimaryCTAProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  ariaLabel: string;
  loadingLabel?: string;
  type?: 'button' | 'submit' | 'reset';
  autoFocus?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  size?: 'md' | 'lg';
  fullWidth?: boolean;
  id?: string;
  dataTestId?: string;
};

export default function PrimaryCTA({
  children,
  onClick,
  ariaLabel,
  loadingLabel,
  type = 'button',
  autoFocus = false,
  disabled,
  loading = false,
  className,
  size = 'lg',
  fullWidth = true,
  id,
  dataTestId,
}: PrimaryCTAProps) {
  // Base styles for Apple-level premium feel
  const base = clsx(
    // Layout and typography
    'relative inline-flex items-center justify-center font-semibold tracking-tight',
    // Fixed dimensions to prevent layout shift
    'min-h-[52px] px-6', // Base minimum height for both sizes
    // Premium rounded corners and shadows
    'rounded-xl shadow-lg shadow-black/20',
    // Smooth transitions for all interactions
    'transition-all duration-200 ease-out',
    // Focus styling with focus-visible for accessibility
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    // Disabled state
    'disabled:cursor-not-allowed',
    // Prevent text selection for better UX
    'select-none'
  );

  // Premium color scheme with perfect dark mode support
  const colors = clsx(
    // Light mode: deep black with subtle hover effects
    'bg-gray-900 text-white shadow-gray-900/20',
    'hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-900/30',
    'active:bg-gray-700 active:scale-[0.98]',
    'focus-visible:ring-gray-900/50',
    // Dark mode: clean white with sophisticated hover
    'dark:bg-white dark:text-gray-900 dark:shadow-white/20',
    'dark:hover:bg-gray-50 dark:hover:shadow-white/30',
    'dark:active:bg-gray-100 dark:active:scale-[0.98]',
    'dark:focus-visible:ring-white/50',
    // Disabled states
    'disabled:opacity-60 disabled:hover:bg-gray-900 disabled:hover:shadow-lg',
    'dark:disabled:hover:bg-white dark:disabled:hover:shadow-lg',
    'disabled:active:scale-100'
  );

  // Size-specific styling with fixed dimensions
  const sizing =
    size === 'lg'
      ? clsx(
          'min-h-[56px] px-8 text-base font-semibold',
          'sm:min-h-[60px] sm:px-10 sm:text-lg'
        )
      : clsx('min-h-[48px] px-6 text-sm font-semibold');

  // Width handling
  const width = fullWidth ? 'w-full' : '';

  // Loading state opacity for smooth transitions
  const loadingOpacity = loading ? 'opacity-80' : '';

  // Current effective aria-label
  const effectiveAriaLabel = loading && loadingLabel ? loadingLabel : ariaLabel;

  return (
    <button
      id={id}
      data-testid={dataTestId}
      type={type}
      onClick={onClick}
      aria-label={effectiveAriaLabel}
      aria-disabled={disabled || loading}
      autoFocus={autoFocus}
      disabled={disabled || loading}
      className={clsx(base, colors, sizing, width, loadingOpacity, className)}
    >
      {/* Content container with smooth fade transitions */}
      <span
        className={clsx(
          'relative flex items-center justify-center gap-2 transition-opacity duration-200',
          loading ? 'opacity-0' : 'opacity-100'
        )}
      >
        {children}
      </span>

      {/* Loading indicator with fade-in effect */}
      {loading && (
        <span
          className={clsx(
            'absolute inset-0 flex items-center justify-center',
            'transition-opacity duration-200 opacity-100'
          )}
          aria-hidden="true"
        >
          <Spinner size="sm" variant="dark" className="text-current" />
        </span>
      )}
    </button>
  );
}
