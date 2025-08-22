'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { clsx } from 'clsx';
import Image from 'next/image';

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

  // Choose app icon based on size (from public/) - use transparent android-chrome icon to avoid spinning square issue
  const iconSrcBySize: Record<'sm' | 'md' | 'lg', string> = {
    sm: '/android-chrome-512x512.png',
    md: '/android-chrome-512x512.png',
    lg: '/android-chrome-512x512.png',
  };
  const iconSrc = iconSrcBySize[size];
  const pixelBySize: Record<'sm' | 'md' | 'lg', number> = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  if (!isVisible) {
    return (
      <div
        className={clsx(sizeClasses[size], className)}
        role="status"
        aria-label="Loading"
        data-testid="spinner"
        data-size={size}
        data-variant={variant}
        data-theme={effectiveTheme}
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
      data-testid="spinner"
      data-size={size}
      data-variant={variant}
      data-theme={effectiveTheme}
    >
      {/* CSS-based spinner with proper light/dark variants */}
      <div
        className={clsx(
          'rounded-full border-2 border-solid',
          {
            // Light variant (dark spinner on light background)
            'border-gray-200 border-t-gray-900': effectiveTheme === 'light',
            // Dark variant (light spinner on dark background) 
            'border-gray-700 border-t-white': effectiveTheme === 'dark',
          },
          sizeClasses[size]
        )}
        style={{
          borderTopColor: effectiveTheme === 'light' ? 'rgb(17 24 39)' : 'rgb(255 255 255)',
        }}
      />
    </div>
  );
}
