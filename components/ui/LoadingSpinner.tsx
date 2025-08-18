import React from 'react';
import Image from 'next/image';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({
  size = 'md',
  className = '',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
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

  return (
    <div
      className={`inline-flex items-center justify-center animate-spin ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      {/* Use app icon / favicon from public/ */}
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
