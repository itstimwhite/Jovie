'use client';

import React from 'react';

export interface DSPButtonProps {
  /** DSP platform name (e.g., 'Spotify', 'Apple Music') */
  name: string;
  /** Platform key for tracking (e.g., 'spotify', 'apple_music') */
  dspKey: string;
  /** URL to open when clicked */
  url: string;
  /** Background color for the button */
  backgroundColor: string;
  /** Text color for the button */
  textColor: string;
  /** SVG logo as HTML string */
  logoSvg: string;
  /** Click handler function */
  onClick?: (dspKey: string, url: string) => void;
  /** Additional CSS classes */
  className?: string;
  /** Button size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether button is disabled */
  disabled?: boolean;
}

export function DSPButton({
  name,
  dspKey,
  url,
  backgroundColor,
  textColor,
  logoSvg,
  onClick,
  className = '',
  size = 'md',
  disabled = false,
}: DSPButtonProps) {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick(dspKey, url);
    }
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        w-full max-w-md rounded-lg font-semibold transition-all duration-200 ease-out 
        shadow-sm hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:shadow-sm 
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
        focus-visible:ring-white/50 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 
        disabled:hover:shadow-sm
        ${sizeClasses[size]}
        ${className}
      `}
      style={{
        backgroundColor: disabled ? '#9CA3AF' : backgroundColor,
        color: disabled ? '#FFFFFF' : textColor,
      }}
      aria-label={`Open in ${name} app if installed, otherwise opens in web browser`}
    >
      <span className="inline-flex items-center gap-2">
        <span
          dangerouslySetInnerHTML={{ __html: logoSvg }}
          className="flex-shrink-0"
        />
        <span>Open in {name}</span>
      </span>
    </button>
  );
}
