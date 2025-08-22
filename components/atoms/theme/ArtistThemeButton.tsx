'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { ArtistThemeIcon, ArtistThemeType } from './ArtistThemeIcon';

export interface ArtistThemeButtonProps {
  /**
   * The current theme
   */
  theme: ArtistThemeType;

  /**
   * The resolved theme (actual theme being applied)
   */
  resolvedTheme: 'light' | 'dark';

  /**
   * Callback when the button is clicked
   */
  onClick: () => void;

  /**
   * Whether to use solid icons instead of outline
   */
  solid?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Size of the button
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
}

/**
 * ArtistThemeButton component provides a button for toggling between artist themes
 */
export function ArtistThemeButton({
  theme,
  resolvedTheme,
  onClick,
  solid = false,
  className = '',
  size = 'sm',
  disabled = false,
}: ArtistThemeButtonProps) {
  // Map button sizes to icon sizes
  const iconSizes = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
  } as const;

  // Generate accessible label based on current theme
  const getAccessibleLabel = () => {
    return `Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`;
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={onClick}
      className={`h-8 w-8 px-0 rounded-full overflow-hidden transition-colors duration-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 ${className}`}
      title={getAccessibleLabel()}
      disabled={disabled}
      aria-label={getAccessibleLabel()}
    >
      <span className="sr-only">{getAccessibleLabel()}</span>
      <ArtistThemeIcon
        theme={theme}
        resolvedTheme={resolvedTheme}
        solid={solid}
        size={iconSizes[size]}
        className="text-gray-700 dark:text-gray-300"
      />
    </Button>
  );
}
