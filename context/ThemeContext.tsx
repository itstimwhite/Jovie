'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: 'light' | 'dark';
  storageKey?: string;
}

export function ThemeProvider({ 
  children, 
  defaultTheme = 'dark',
  storageKey = 'jovie-theme' 
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<'light' | 'dark'>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Set theme and persist to localStorage
  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem(storageKey, newTheme);
    
    // Apply theme to document
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
  };

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as 'light' | 'dark' | null;
    
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setThemeState(savedTheme);
      
      // Apply theme immediately
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(savedTheme);
    } else {
      // Apply default theme
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(defaultTheme);
    }
    
    setMounted(true);
  }, [defaultTheme, storageKey]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    resolvedTheme: theme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}