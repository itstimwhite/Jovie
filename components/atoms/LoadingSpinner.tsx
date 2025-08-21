import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import Image from 'next/image';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'auto';
  className?: string;
  showDebounce?: boolean;
}

export function LoadingSpinner({
  size = 'md',
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

  // Use Jovie logo for all spinners site-wide
  const iconSrc = '/android-chrome-512x512.png';
  const pixelBySize: Record<'xs' | 'sm' | 'md' | 'lg', number> = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
  };

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
      {/* Use Jovie app icon / favicon from public/ */}
      <Image
        src={iconSrc}
        alt=""
        aria-hidden="true"
        width={pixelBySize[size]}
        height={pixelBySize[size]}
        className="object-contain"
        priority
      />
    </div>
  );
}
