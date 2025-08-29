import React, { forwardRef } from 'react';

/**
 * Button Component
 *
 * A versatile button component that supports multiple variants, sizes, and states.
 *
 * @component
 *
 * Variants:
 * - primary: High emphasis, used for main actions
 * - secondary: Medium emphasis, used for secondary actions
 * - ghost: Low emphasis, used for tertiary actions with minimal visual presence
 * - outline: Medium emphasis with a border and transparent background
 * - plain: Minimal styling, typically used for text-only actions
 *
 * States:
 * - Default: Normal interactive state
 * - Hover: Visual feedback when user hovers
 * - Active: Visual feedback when pressed/clicked
 * - Focus: Visual feedback when focused (e.g., via keyboard)
 * - Disabled: Non-interactive state
 * - Loading: Indicates an action in progress
 *
 * Sizes:
 * - sm: Small size for compact UIs
 * - md: Medium size (default)
 * - lg: Large size for prominent actions
 *
 * Accessibility:
 * - Includes focus-visible styling for keyboard navigation
 * - Proper cursor styling based on interactive state
 * - Loading state maintains button dimensions to prevent layout shifts
 * - Supports custom element types via the 'as' prop
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'plain';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Button content */
  children: React.ReactNode;
  /** Optional href for when button renders as a link */
  href?: string;
  /** Additional CSS classes */
  className?: string;
  /** Render as a different element (e.g., 'a', 'div') */
  as?: React.ElementType;
  /** Use outline style (border with transparent background) */
  outline?: boolean;
  /** Use plain style (minimal styling) */
  plain?: boolean;
  /** Target attribute for links */
  target?: string;
  /** Rel attribute for links */
  rel?: string;
  /** Show loading spinner */
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      className = '',
      children,
      as: Component = 'button',
      outline = false,
      plain = false,
      loading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    // Base styling applied to all buttons
    const baseClasses =
      'relative isolate inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900';

    // Variant-specific styling
    const variantClasses = {
      // Primary: High emphasis, filled background
      primary:
        'bg-black text-white hover:bg-gray-800 active:bg-gray-900 focus-visible:ring-gray-500 dark:bg-white dark:text-black dark:hover:bg-gray-100 dark:active:bg-gray-200',

      // Secondary: Medium emphasis, light background
      secondary:
        'bg-gray-100 text-black hover:bg-gray-200 active:bg-gray-300 focus-visible:ring-gray-400 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:active:bg-gray-600',

      // Ghost: Low emphasis, transparent background
      ghost:
        'bg-transparent text-black hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-gray-400 dark:text-white dark:hover:bg-gray-900 dark:active:bg-gray-800',

      // Outline: Medium emphasis with border
      outline:
        'border border-gray-300 bg-transparent text-black hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-gray-400 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900 dark:active:bg-gray-800',

      // Plain: Minimal styling
      plain:
        'bg-transparent text-black hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-gray-400 dark:text-white dark:hover:bg-gray-900 dark:active:bg-gray-800',
    };

    // Size variants
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    // Determine which variant classes to use based on props
    let variantClass = variantClasses[variant];
    if (outline) variantClass = variantClasses.outline;
    if (plain) variantClass = variantClasses.plain;

    // Apply disabled/loading states
    if (isDisabled) {
      const cursorClass = 'cursor-not-allowed';
      const opacityClass = 'opacity-50';
      const hoverDisabled =
        'hover:bg-current hover:text-current active:bg-current';

      variantClass = `${opacityClass} ${hoverDisabled}`;

      if (variant === 'primary') {
        variantClass +=
          ' bg-gray-400 text-white dark:bg-gray-600 dark:text-gray-300';
      } else if (variant === 'secondary') {
        variantClass +=
          ' bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500';
      } else if (variant === 'outline') {
        variantClass +=
          ' border border-gray-200 text-gray-400 dark:border-gray-700 dark:text-gray-500';
      } else {
        variantClass += ' text-gray-400 dark:text-gray-500';
      }

      variantClass = `${cursorClass} ${variantClass}`;
    } else {
      variantClass = `cursor-pointer ${variantClass}`;
    }

    const classes =
      `${baseClasses} ${variantClass} ${sizeClasses[size]} ${className}`.trim();

    return (
      <Component ref={ref} className={classes} disabled={isDisabled} {...props}>
        {loading && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
          </div>
        )}
        <span className={loading ? 'opacity-0' : 'opacity-100'}>
          {children}
        </span>
      </Component>
    );
  }
);

Button.displayName = 'Button';
