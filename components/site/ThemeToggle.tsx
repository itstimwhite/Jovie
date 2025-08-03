'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-8 w-8 px-0" disabled>
        <span className="sr-only">Loading theme toggle</span>
        <div className="h-4 w-4 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
      </Button>
    );
  }

  const currentTheme = resolvedTheme || theme;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(currentTheme === 'light' ? 'dark' : 'light')}
      className="h-8 w-8 px-0"
    >
      <span className="sr-only">Toggle theme</span>
      {currentTheme === 'light' ? (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </Button>
  );
}
