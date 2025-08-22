'use client';

import React from 'react';
import { ThemeToggle as BaseThemeToggle } from '@/components/molecules/theme/ThemeToggle';

/**
 * ThemeToggle component for the site
 * Uses the base ThemeToggle component with site-specific configuration
 */
export function ThemeToggle() {
  return (
    <BaseThemeToggle
      variant="button"
      themeOrder={['light', 'dark', 'system']}
      size="sm"
      className="hover:bg-gray-100 dark:hover:bg-gray-800"
    />
  );
}
