'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { clsx } from 'clsx';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'auto' | 'light' | 'dark';
}

export function Spinner({
  size = 'md',
  className,
  variant = 'auto',
}: SpinnerProps) {
  const { theme, systemTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  // Debounce visibility to avoid flicker
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200); // 200ms debounce as specified (150-250ms range)

    return () => clearTimeout(timer);
  }, []);

  // Determine the effective theme for coloring
  const getEffectiveTheme = () => {
    if (variant === 'light') return 'light';
    if (variant === 'dark') return 'dark';

    // For 'auto', use the current theme
    const currentTheme = theme === 'system' ? systemTheme : theme;
    return currentTheme === 'dark' ? 'dark' : 'light';
  };

  const effectiveTheme = getEffectiveTheme();

  // Size classes for the spinner container
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  // Color based on theme variant
  const iconColor = effectiveTheme === 'dark' ? '#ffffff' : '#6366f1';

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
        'inline-flex items-center justify-center animate-spin',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Favicon music note icon - theme aware */}
        <circle cx="8" cy="24" r="4" fill={iconColor} />
        <circle cx="20" cy="20" r="4" fill={iconColor} />
        <rect x="10" y="12" width="2" height="16" fill={iconColor} />
        <rect x="22" y="8" width="2" height="16" fill={iconColor} />
        <path d="M10 12h12v4H10z" fill={iconColor} />
      </svg>
    </div>
  );
}
