'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeIcon, type ThemeType } from '@/components/atoms/ThemeIcon';
import posthog from 'posthog-js';

interface ThemeToggleProps {
  /** Visual variant */
  variant?: 'default' | 'subtle' | 'bold';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show labels */
  showLabels?: boolean;
  /** Whether to use reduced motion */
  reducedMotion?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Callback when theme changes */
  onThemeChange?: (theme: ThemeType) => void;
  /** Whether to use a dropdown style instead of cycling */
  dropdown?: boolean;
}

const themeOrder: ThemeType[] = ['light', 'dark', 'system'];

const variantClasses = {
  default: {
    container: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700',
    activeIndicator: 'bg-white dark:bg-gray-900 shadow-sm',
  },
  subtle: {
    container: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700',
    activeIndicator: 'bg-gray-200 dark:bg-gray-700',
  },
  bold: {
    container: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
    activeIndicator: 'bg-white/20 backdrop-blur-sm',
  },
};

const sizeClasses = {
  sm: {
    container: 'h-8 px-1',
    button: 'h-6 px-2 text-xs gap-1',
    icon: 'sm' as const,
  },
  md: {
    container: 'h-10 px-1',
    button: 'h-8 px-3 text-sm gap-1.5',
    icon: 'md' as const,
  },
  lg: {
    container: 'h-12 px-1.5',
    button: 'h-9 px-4 text-base gap-2',
    icon: 'lg' as const,
  },
};

const themeLabels = {
  light: 'Light',
  dark: 'Dark',
  system: 'Auto',
};

export function ThemeToggle({
  variant = 'default',
  size = 'md',
  showLabels = false,
  reducedMotion = false,
  className = '',
  onThemeChange,
  dropdown = false,
}: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div 
        className={`
          ${variantClasses[variant].container}
          ${sizeClasses[size].container}
          ${className}
          rounded-full flex items-center justify-center
          opacity-60 animate-pulse
        `}
        aria-hidden="true"
      >
        <div className={`${sizeClasses[size].button} rounded-full bg-gray-300 dark:bg-gray-600`} />
      </div>
    );
  }

  const currentTheme = (theme as ThemeType) || 'system';
  const currentIndex = themeOrder.indexOf(currentTheme);

  const cycleTheme = () => {
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    const nextTheme = themeOrder[nextIndex];
    setTheme(nextTheme);
    onThemeChange?.(nextTheme);
    
    // Track theme change in PostHog
    posthog.capture('theme_toggle_cycle', {
      previous_theme: currentTheme,
      new_theme: nextTheme,
      variant,
      size,
      dropdown: false,
    });
  };

  const selectTheme = (selectedTheme: ThemeType) => {
    setTheme(selectedTheme);
    onThemeChange?.(selectedTheme);
    setIsOpen(false);
    
    // Track theme selection in PostHog
    posthog.capture('theme_toggle_select', {
      previous_theme: currentTheme,
      new_theme: selectedTheme,
      variant,
      size,
      dropdown: true,
    });
  };

  const getThemeDescription = () => {
    if (currentTheme === 'system') {
      return `Auto (currently ${resolvedTheme})`;
    }
    return themeLabels[currentTheme];
  };

  const containerVariants = {
    closed: { width: 'auto' },
    open: { width: 'auto' },
  };

  const indicatorVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  };

  if (dropdown) {
    return (
      <div ref={containerRef} className="relative">
        <motion.button
          className={`
            ${variantClasses[variant].container}
            ${sizeClasses[size].container}
            ${sizeClasses[size].button}
            ${className}
            rounded-full flex items-center justify-center
            transition-all duration-200 focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
            dark:focus-visible:ring-offset-gray-900
          `}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsOpen(false);
          }}
          aria-label={`Theme selector. Current: ${getThemeDescription()}`}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          whileTap={reducedMotion ? {} : { scale: 0.98 }}
        >
          <ThemeIcon
            theme={currentTheme}
            isActive
            size={sizeClasses[size].icon}
            reducedMotion={reducedMotion}
          />
          {showLabels && (
            <span className="ml-2 font-medium">
              {themeLabels[currentTheme]}
            </span>
          )}
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[120px] z-50"
              role="menu"
            >
              {themeOrder.map((themeOption) => (
                <button
                  key={themeOption}
                  className={`
                    w-full px-3 py-2 text-left text-sm flex items-center gap-2
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                    ${themeOption === currentTheme ? 'bg-gray-50 dark:bg-gray-700/50' : ''}
                  `}
                  onClick={() => selectTheme(themeOption)}
                  role="menuitem"
                  aria-label={`Switch to ${themeLabels[themeOption]} theme`}
                >
                  <ThemeIcon
                    theme={themeOption}
                    isActive={themeOption === currentTheme}
                    size="sm"
                    reducedMotion={reducedMotion}
                  />
                  <span className="flex-1">{themeLabels[themeOption]}</span>
                  {themeOption === currentTheme && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Cycling toggle variant
  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      className={`
        ${variantClasses[variant].container}
        ${sizeClasses[size].container}
        ${className}
        rounded-full flex items-center justify-center relative overflow-hidden
        transition-all duration-200
      `}
      whileHover={reducedMotion ? {} : { scale: 1.02 }}
    >
      <motion.button
        className={`
          ${sizeClasses[size].button}
          rounded-full flex items-center justify-center relative z-10
          transition-colors duration-200 focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
          dark:focus-visible:ring-offset-gray-900
        `}
        onClick={cycleTheme}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            cycleTheme();
          }
        }}
        aria-label={`Toggle theme. Current: ${getThemeDescription()}. Click to switch to ${themeLabels[themeOrder[(currentIndex + 1) % themeOrder.length]]}`}
        whileTap={reducedMotion ? {} : { scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTheme}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={indicatorVariants}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5"
          >
            <ThemeIcon
              theme={currentTheme}
              isActive
              size={sizeClasses[size].icon}
              reducedMotion={reducedMotion}
            />
            {showLabels && (
              <span className="font-medium">
                {themeLabels[currentTheme]}
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}