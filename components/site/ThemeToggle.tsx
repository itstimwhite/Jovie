'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/Button';
import { ThemeToggle as ImprovedThemeToggle } from '@/components/molecules/ThemeToggle';
import { getFeatureFlags } from '@/lib/feature-flags';

/**
 * Site-wide theme toggle component that conditionally uses the enhanced
 * version based on feature flags, with fallback to the original implementation.
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [useEnhanced, setUseEnhanced] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    
    // Check feature flag for enhanced theme toggle
    getFeatureFlags().then((flags) => {
      setUseEnhanced(flags.featureEnhancedThemeToggle);
    });
  }, []);

  // Use enhanced version if feature flag is enabled
  if (useEnhanced) {
    return (
      <ImprovedThemeToggle
        variant="subtle"
        size="sm"
        className="h-8 w-8"
      />
    );
  }

  // Original implementation as fallback
  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-8 w-8 px-0" disabled>
        <span className="sr-only">Loading theme toggle</span>
        <div className="h-4 w-4 animate-pulse rounded-sm bg-gray-300 dark:bg-gray-600" />
      </Button>
    );
  }

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    if (theme === 'system') {
      return (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    } else if (resolvedTheme === 'light') {
      return (
        <svg
          className="h-5 w-5"
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
      );
    } else {
      return (
        <svg
          className="h-5 w-5"
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
      );
    }
  };

  const getNextTheme = () => {
    if (theme === 'light') return 'dark';
    if (theme === 'dark') return 'system';
    return 'light';
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      className="h-8 w-8 px-0"
      title={`Current: ${theme === 'system' ? `auto (${resolvedTheme})` : theme}. Click to switch to ${getNextTheme()}`}
    >
      <span className="sr-only">
        Toggle theme (current:{' '}
        {theme === 'system' ? `auto, showing ${resolvedTheme}` : theme})
      </span>
      {getThemeIcon()}
    </Button>
  );
}
