'use client';

import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import {
  SunIcon as SunIconSolid,
  MoonIcon as MoonIconSolid,
} from '@heroicons/react/24/solid';

export type ArtistThemeType = 'light' | 'dark' | 'auto';

export interface ArtistThemeIconProps {
  /**
   * The current theme
   */
  theme: ArtistThemeType;

  /**
   * The resolved theme (actual theme being applied)
   */
  resolvedTheme: 'light' | 'dark';

  /**
   * Whether to use solid icons instead of outline
   */
  solid?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Size of the icon
   */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * ArtistThemeIcon component displays the appropriate icon based on the current artist theme
 */
export function ArtistThemeIcon({
  resolvedTheme,
  solid = false,
  className = '',
  size = 'md',
}: ArtistThemeIconProps) {
  // Determine icon size based on the size prop
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 w-5',
    lg: 'w-6 h-6',
  };

  const iconClass = `${sizeClasses[size]} transition-transform duration-300 ${className}`;

  // For artist themes, we show the icon based on the resolved theme
  // This is different from the regular ThemeIcon which shows the icon based on the theme
  const isLight = resolvedTheme === 'light';

  if (solid) {
    return isLight ? (
      <MoonIconSolid className={iconClass} aria-hidden="true" />
    ) : (
      <SunIconSolid className={iconClass} aria-hidden="true" />
    );
  }

  return isLight ? (
    <MoonIcon className={iconClass} aria-hidden="true" />
  ) : (
    <SunIcon className={iconClass} aria-hidden="true" />
  );
}
