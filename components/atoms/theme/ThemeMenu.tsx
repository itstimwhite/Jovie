'use client';

import React from 'react';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { ThemeIcon, ThemeType } from './ThemeIcon';

export interface ThemeMenuProps {
  /**
   * The current theme
   */
  theme: ThemeType;
  
  /**
   * The resolved theme (actual theme being applied)
   */
  resolvedTheme?: 'light' | 'dark';
  
  /**
   * Callback when a theme is selected
   */
  onThemeSelect: (theme: ThemeType) => void;
  
  /**
   * Additional CSS classes for the menu button
   */
  buttonClassName?: string;
  
  /**
   * Additional CSS classes for the menu items container
   */
  menuClassName?: string;
  
  /**
   * Whether to use solid icons instead of outline
   */
  solid?: boolean;
  
  /**
   * Size of the button
   */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * ThemeMenu component provides a dropdown menu for selecting a theme
 */
export function ThemeMenu({
  theme,
  resolvedTheme,
  onThemeSelect,
  buttonClassName = '',
  menuClassName = '',
  solid = false,
  size = 'sm',
}: ThemeMenuProps) {
  // Available themes
  const themes: ThemeType[] = ['light', 'dark', 'system'];
  
  // Theme labels for display
  const themeLabels: Record<ThemeType, string> = {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  };
  
  return (
    <Menu as="div" className="relative">
      <MenuButton as="button" className={`h-8 w-8 px-0 rounded-full overflow-hidden transition-colors duration-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 ${buttonClassName}`}>
        <span className="sr-only">Select theme</span>
        <ThemeIcon 
          theme={theme} 
          resolvedTheme={resolvedTheme}
          solid={solid}
          size={size === 'lg' ? 'lg' : size === 'md' ? 'md' : 'sm'}
        />
      </MenuButton>
      
      <MenuItems
        className={`absolute right-0 z-50 mt-2 w-36 origin-top-right rounded-lg border bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none ${menuClassName}`}
        style={{
          animation: 'theme-menu-enter 150ms ease-out',
        }}
      >
        <div className="py-1">
          {themes.map((themeOption) => (
            <MenuItem key={themeOption}>
              {({ focus }) => (
                <button
                  onClick={() => onThemeSelect(themeOption)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                    focus
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  } ${
                    theme === themeOption ? 'font-medium' : ''
                  }`}
                >
                  <ThemeIcon 
                    theme={themeOption} 
                    resolvedTheme={resolvedTheme}
                    solid={theme === themeOption || solid}
                    size="sm"
                    className={theme === themeOption ? 'text-indigo-600 dark:text-indigo-400' : ''}
                  />
                  <span>{themeLabels[themeOption]}</span>
                  {theme === themeOption && (
                    <span className="ml-auto text-indigo-600 dark:text-indigo-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              )}
            </MenuItem>
          ))}
        </div>
        
        <style jsx>{`
          @keyframes theme-menu-enter {
            from {
              opacity: 0;
              transform: translateY(-4px) scale(0.97);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
            }
          }
        `}</style>
      </MenuItems>
    </Menu>
  );
}

