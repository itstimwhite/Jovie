import React, { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'plain';
  size?: 'sm' | 'md' | 'lg';
  color?: 'indigo' | 'red' | 'green';
  children: React.ReactNode;
  href?: string;
  className?: string;
  as?: React.ElementType;
  outline?: boolean;
  plain?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      color = 'indigo',
      className = '',
      children,
      as: Component = 'button',
      outline = false,
      plain = false,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'relative isolate inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-2';

    const variantClasses = {
      primary:
        'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
      secondary:
        'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      ghost:
        'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      outline:
        'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
      plain:
        'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const colorClasses = {
      indigo:
        'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
      red: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      green: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    };

    // Determine which classes to use based on props
    let variantClass = variantClasses[variant];
    if (outline) variantClass = variantClasses.outline;
    if (plain) variantClass = variantClasses.plain;
    if (color && variant === 'primary') variantClass = colorClasses[color];

    const classes =
      `${baseClasses} ${variantClass} ${sizeClasses[size]} ${className}`.trim();

    return (
      <Component ref={ref} className={classes} {...props}>
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';
