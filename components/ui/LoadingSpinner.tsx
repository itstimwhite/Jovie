import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div
      className={`inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <svg
        className="animate-spin"
        viewBox="0 0 32 32"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Jovie Music Note Icon */}
        <circle cx="8" cy="24" r="4" fill="currentColor"/>
        <circle cx="20" cy="20" r="4" fill="currentColor"/>
        <rect x="10" y="12" width="2" height="16" fill="currentColor"/>
        <rect x="22" y="8" width="2" height="16" fill="currentColor"/>
        <path d="M10 12h12v4H10z" fill="currentColor"/>
      </svg>
    </div>
  );
} 