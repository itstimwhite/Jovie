'use client';

import React from 'react';
import { useArtistTheme } from './ArtistThemeProvider';
import { ArtistThemeButton } from '@/components/atoms/theme/ArtistThemeButton';

/**
 * ArtistThemeToggle component for toggling between light and dark themes on artist profiles
 */
export function ArtistThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useArtistTheme();

  const handleToggle = () => {
    if (theme === 'auto') {
      // If currently auto, switch to the opposite of current resolved theme
      setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
    } else {
      // If currently set to a specific theme, switch to the opposite
      setTheme(theme === 'light' ? 'dark' : 'light');
    }
  };

  return (
    <ArtistThemeButton
      theme={theme}
      resolvedTheme={resolvedTheme}
      onClick={handleToggle}
      size="sm"
    />
  );
}
