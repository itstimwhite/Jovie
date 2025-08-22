'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { ThemeIcon, ThemeType } from './ThemeIcon';

export interface ThemeButtonProps {
  /**
   * The current theme
   */
  theme: ThemeType;

  /**
   * The resolved theme (actual theme being applied)
   */
  resolvedTheme?: 'light' | 'dark';

  /**
   * Callback when the button is clicked
   */
  onClick: () => void;

  /**
   * The next theme that will be applied when clicked
   */
  nextTheme?: ThemeType;

  /**
   * Whether to use solid icons instead of outline
   */
  solid?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Size of the button
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
}

/**
 * ThemeButton component provides a button for toggling between themes
 */
export function ThemeButton({
  theme,
  resolvedTheme,
  onClick,
  nextTheme,
  solid = false,
  className = '',
  size = 'sm',
  disabled = false,
}: ThemeButtonProps) {
  // Map button sizes to icon sizes
  const iconSizes = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
  } as const;

  // Generate accessible label based on current theme and next theme
  const getAccessibleLabel = () => {
    const currentThemeLabel =
      theme === 'system' ? `system (${resolvedTheme})` : theme;

    return `Toggle theme (current: ${currentThemeLabel})${
      nextTheme ? `. Switch to ${nextTheme}` : ''
    }`;
  };

  // Generate title attribute for the button
  const getTitle = () => {
    const currentThemeLabel =
      theme === 'system' ? `auto (${resolvedTheme})` : theme;

    return `Current: ${currentThemeLabel}${
      nextTheme ? `. Click to switch to ${nextTheme}` : ''
    }`;
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={onClick}
      className={`h-8 w-8 px-0 rounded-full overflow-hidden transition-colors duration-300 ${className}`}
      title={getTitle()}
      disabled={disabled}
      aria-label={getAccessibleLabel()}
    >
      <span className="sr-only">{getAccessibleLabel()}</span>
      <ThemeIcon
        theme={theme}
        resolvedTheme={resolvedTheme}
        solid={solid}
        size={iconSizes[size]}
      />
    </Button>
  );
}
