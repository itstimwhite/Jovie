import React from 'react';
import { clsx } from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
}

export function LoadingSpinner({
  size = 'md',
  className = '',
  variant = 'auto',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  // Stroke width based on size
  const strokeWidth = {
    sm: 2,
    md: 2.5,
    lg: 3,
  };

  // Colors based on variant
  const getColors = () => {
    if (variant === 'light') {
      return {
        primary: 'text-white',
        secondary: 'text-white/30',
      };
    } else if (variant === 'dark') {
      return {
        primary: 'text-indigo-600',
        secondary: 'text-indigo-200',
      };
    } else {
      // 'auto' defaults to dark for backward compatibility
      return {
        primary: 'text-indigo-600',
        secondary: 'text-indigo-200',
      };
    }
  };

  const colors = getColors();

  return (
    <div
      className={clsx(
        'inline-flex items-center justify-center',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <svg
        className={clsx(
          'animate-spin motion-reduce:animate-[spin_1.5s_linear_infinite]',
          'h-full w-full'
        )}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        {/* Background circle (lighter color) */}
        <circle
          className={colors.secondary}
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth={strokeWidth[size]}
          strokeLinecap="round"
          strokeDasharray="1, 1"
        />
        {/* Foreground arc (primary color) */}
        <path
          className={colors.primary}
          stroke="currentColor"
          strokeWidth={strokeWidth[size]}
          strokeLinecap="round"
          d="M12 2a10 10 0 0 1 10 10"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 12 12"
            to="360 12 12"
            dur="1s"
            repeatCount="indefinite"
            className="motion-reduce:duration-[1.5s]"
          />
        </path>
      </svg>
    </div>
  );
}
