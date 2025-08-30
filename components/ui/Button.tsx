import React, { forwardRef } from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'plain';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  href?: string;
  className?: string;
  as?: React.ElementType;
  outline?: boolean;
  plain?: boolean;
  target?: string;
  rel?: string;
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

    const baseClasses =
      'relative isolate inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900';

    const variantClasses = {
      primary:
        'bg-black text-white hover:bg-gray-800 focus-visible:ring-gray-500 dark:bg-white dark:text-black dark:hover:bg-gray-100',
      secondary:
        'bg-gray-100 text-black hover:bg-gray-200 focus-visible:ring-gray-400 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700',
      ghost:
        'bg-transparent text-black hover:bg-gray-50 focus-visible:ring-gray-400 dark:text-white dark:hover:bg-gray-900',
      outline:
        'border border-subtle bg-transparent text-primary hover:bg-surface-1 focus-visible:ring-gray-400',
      plain:
        'bg-transparent text-black hover:bg-gray-50 focus-visible:ring-gray-400 dark:text-white dark:hover:bg-gray-900',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    // Determine which classes to use based on props
    let variantClass = variantClasses[variant];
    if (outline) variantClass = variantClasses.outline;
    if (plain) variantClass = variantClasses.plain;

    // Apply disabled/loading states
    if (isDisabled) {
      const cursorClass = 'cursor-not-allowed';
      const opacityClass = 'opacity-50';
      const hoverDisabled = 'hover:bg-current hover:text-current';

      variantClass = `${opacityClass} ${hoverDisabled}`;

      if (variant === 'primary') {
        variantClass +=
          ' bg-gray-400 text-white dark:bg-gray-600 dark:text-gray-300';
      } else if (variant === 'secondary') {
        variantClass +=
          ' bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500';
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
