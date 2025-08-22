'use client';

import React from 'react';
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import {
  SunIcon as SunIconSolid,
  MoonIcon as MoonIconSolid,
  ComputerDesktopIcon as ComputerDesktopIconSolid,
} from '@heroicons/react/24/solid';

export type ThemeType = 'light' | 'dark' | 'system';

export interface ThemeIconProps {
  /**
   * The current theme
   */
  theme: ThemeType;

  /**
   * The resolved theme (actual theme being applied)
   */
  resolvedTheme?: 'light' | 'dark';

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
 * ThemeIcon component displays the appropriate icon based on the current theme
 */
export function ThemeIcon({
  theme,
  resolvedTheme,
  solid = false,
  className = '',
  size = 'md',
}: ThemeIconProps) {
  // Determine icon size based on the size prop
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const iconClass = `${sizeClasses[size]} transition-transform duration-300 ${className}`;

  // Choose between solid and outline icons
  const icons = solid
    ? {
        light: SunIconSolid,
        dark: MoonIconSolid,
        system: ComputerDesktopIconSolid,
      }
    : { light: SunIcon, dark: MoonIcon, system: ComputerDesktopIcon };

  // For system theme, show the icon based on the resolved theme
  if (theme === 'system' && resolvedTheme) {
    const SystemIcon = icons.system;
    return <SystemIcon className={iconClass} aria-hidden="true" />;
  }

  const Icon = icons[theme];
  return <Icon className={iconClass} aria-hidden="true" />;
}
