'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Artist } from '@/types/db';

export type ArtistTheme = 'light' | 'dark' | 'auto';

interface ArtistThemeContextType {
  theme: ArtistTheme;
  setTheme: (theme: ArtistTheme) => void;
  resolvedTheme: 'light' | 'dark';
  isCustomTheme: boolean;
}

const ArtistThemeContext = createContext<ArtistThemeContextType | undefined>(
  undefined
);

interface ArtistThemeProviderProps {
  children: React.ReactNode;
  artist: Artist;
}

export function ArtistThemeProvider({
  children,
  artist,
}: ArtistThemeProviderProps) {
  const [theme, setTheme] = useState<ArtistTheme>('auto');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [isCustomTheme, setIsCustomTheme] = useState(false);

  // Initialize theme from artist settings or default to auto
  useEffect(() => {
    const artistTheme = artist.theme as { mode?: ArtistTheme } | undefined;
    if (artistTheme?.mode) {
      setTheme(artistTheme.mode);
      setIsCustomTheme(true);
    } else {
      setTheme('auto');
      setIsCustomTheme(false);
    }
  }, [artist.theme]);

  // Resolve the actual theme based on artist preference and system preference
  useEffect(() => {
    const updateResolvedTheme = () => {
      if (theme === 'auto') {
        // Use system preference
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
          ? 'dark'
          : 'light';
        setResolvedTheme(systemTheme);
      } else {
        setResolvedTheme(theme);
      }
    };

    updateResolvedTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'auto') {
        updateResolvedTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Update document class when theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  const handleSetTheme = async (newTheme: ArtistTheme) => {
    setTheme(newTheme);
    setIsCustomTheme(true);

    // Save theme preference to database
    try {
      await fetch('/api/artist/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artistId: artist.id,
          theme: newTheme,
        }),
      });
    } catch (error) {
      console.error('Failed to save theme preference:', error);
      // Don't throw error - theme change still works locally
    }
  };

  return (
    <ArtistThemeContext.Provider
      value={{
        theme,
        setTheme: handleSetTheme,
        resolvedTheme,
        isCustomTheme,
      }}
    >
      {children}
    </ArtistThemeContext.Provider>
  );
}

export function useArtistTheme() {
  const context = useContext(ArtistThemeContext);
  if (context === undefined) {
    throw new Error(
      'useArtistTheme must be used within an ArtistThemeProvider'
    );
  }
  return context;
}
