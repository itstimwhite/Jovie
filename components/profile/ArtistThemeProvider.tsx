'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
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
  const { setTheme: setSystemTheme, resolvedTheme } = useTheme();
  const [artistTheme, setArtistTheme] = useState<ArtistTheme>('auto');
  const [isCustomTheme, setIsCustomTheme] = useState(false);

  // Initialize theme from artist settings or default to auto
  useEffect(() => {
    const artistThemeData = artist.theme as { mode?: ArtistTheme } | undefined;
    if (artistThemeData?.mode) {
      setArtistTheme(artistThemeData.mode);
      setIsCustomTheme(true);
      // Set the system theme to match artist preference
      if (artistThemeData.mode !== 'auto') {
        setSystemTheme(artistThemeData.mode);
      }
    } else {
      setArtistTheme('auto');
      setIsCustomTheme(false);
    }
  }, [artist.theme, setSystemTheme]);

  const handleSetTheme = async (newTheme: ArtistTheme) => {
    setArtistTheme(newTheme);
    setIsCustomTheme(true);

    // Update the system theme
    if (newTheme === 'auto') {
      setSystemTheme('system');
    } else {
      setSystemTheme(newTheme);
    }

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
        theme: artistTheme,
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
