import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'auto';
  className?: string;
  showDebounce?: boolean;
}

export function LoadingSpinner({
  size = 'md',
  variant = 'auto',
  className,
  showDebounce = false,
}: LoadingSpinnerProps) {
  const [isVisible, setIsVisible] = useState(!showDebounce);

  // Debounce visibility to avoid flicker (only if showDebounce is true)
  useEffect(() => {
    if (!showDebounce) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200); // 200ms debounce

    return () => clearTimeout(timer);
  }, [showDebounce]);

  // Size classes for the spinner container
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  // Stroke width based on size
  const strokeWidth = {
    xs: 2,
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

  if (!isVisible) {
    return (
      <div
        className={clsx(sizeClasses[size], className)}
        role="status"
        aria-label="Loading"
      >
        {/* Invisible placeholder to prevent layout shift */}
      </div>
    );
  }

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
