'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { ThemeButton } from '@/components/atoms/theme/ThemeButton';
import { ThemeMenu } from '@/components/atoms/theme/ThemeMenu';
import { ThemeType } from '@/components/atoms/theme/ThemeIcon';

export interface ThemeToggleProps {
  /**
   * The variant of the toggle
   * - 'button': Simple button that cycles through themes
   * - 'menu': Dropdown menu for selecting a theme
   */
  variant?: 'button' | 'menu';

  /**
   * The order of themes to cycle through (for button variant)
   */
  themeOrder?: ThemeType[];

  /**
   * Whether to use solid icons instead of outline
   */
  solid?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Size of the toggle
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Whether to announce theme changes to screen readers
   */
  announceChanges?: boolean;
}

/**
 * ThemeToggle component provides a way to toggle between themes
 */
export function ThemeToggle({
  variant = 'button',
  themeOrder = ['light', 'dark', 'system'],
  solid = false,
  className = '',
  size = 'sm',
  announceChanges = true,
}: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [announcement, setAnnouncement] = useState<string | null>(null);

  // Set mounted state once component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle theme change announcements for screen readers
  useEffect(() => {
    if (announceChanges && mounted && theme) {
      const themeLabel =
        theme === 'system' ? `system (${resolvedTheme})` : theme;

      setAnnouncement(`Theme changed to ${themeLabel}`);

      // Clear announcement after it's been read
      const timer = setTimeout(() => {
        setAnnouncement(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [theme, resolvedTheme, mounted, announceChanges]);

  // Get the next theme in the cycle
  const getNextTheme = (): ThemeType => {
    if (!theme) return themeOrder[0];

    const currentIndex = themeOrder.indexOf(theme as ThemeType);
    if (currentIndex === -1) return themeOrder[0];

    const nextIndex = (currentIndex + 1) % themeOrder.length;
    return themeOrder[nextIndex];
  };

  // Handle theme cycling for button variant
  const cycleTheme = () => {
    setTheme(getNextTheme());
  };

  // Handle theme selection for menu variant
  const handleThemeSelect = (selectedTheme: ThemeType) => {
    setTheme(selectedTheme);
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div
        className={`h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}
      />
    );
  }

  return (
    <>
      {variant === 'button' ? (
        <ThemeButton
          theme={theme as ThemeType}
          resolvedTheme={resolvedTheme as 'light' | 'dark'}
          onClick={cycleTheme}
          nextTheme={getNextTheme()}
          solid={solid}
          className={className}
          size={size}
        />
      ) : (
        <ThemeMenu
          theme={theme as ThemeType}
          resolvedTheme={resolvedTheme as 'light' | 'dark'}
          onThemeSelect={handleThemeSelect}
          solid={solid}
          buttonClassName={className}
          size={size}
        />
      )}

      {/* Visually hidden announcement for screen readers */}
      {announcement && (
        <div role="status" aria-live="polite" className="sr-only">
          {announcement}
        </div>
      )}
    </>
  );
}
