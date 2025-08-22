'use client';

import React, { forwardRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';
import { Spinner } from '@/components/ui/Spinner';

export interface CTAButtonProps {
  /** The URL the button should navigate to */
  href?: string;
  /** Button content */
  children: React.ReactNode;
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'white';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
  /** Whether the link should open in a new tab */
  external?: boolean;
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  /** Whether the button is in a success state */
  isSuccess?: boolean;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Optional icon to display before text */
  icon?: React.ReactNode;
  /** Optional click handler (for button mode) */
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  /** Optional aria-label for better accessibility */
  ariaLabel?: string;
  /** Whether to use reduced motion */
  reducedMotion?: boolean;
  /** Type attribute for button mode */
  type?: 'button' | 'submit' | 'reset';
}

export const CTAButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  CTAButtonProps
>(
  (
    {
      href,
      children,
      variant = 'primary',
      size = 'md',
      className = '',
      external = false,
      isLoading = false,
      isSuccess = false,
      disabled = false,
      icon,
      onClick,
      ariaLabel,
      reducedMotion = false,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const { theme, systemTheme } = useTheme();
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
    const [showSuccess, setShowSuccess] = useState(false);

    // Update current theme based on system/user preference
    useEffect(() => {
      const effectiveTheme = theme === 'system' ? systemTheme : theme;
      setCurrentTheme(effectiveTheme === 'dark' ? 'dark' : 'light');
    }, [theme, systemTheme]);

    // Handle success state with animation timing
    useEffect(() => {
      if (isSuccess) {
        setShowSuccess(true);
      } else {
        setShowSuccess(false);
      }
    }, [isSuccess]);

    // Base classes for all button variants
    const baseClasses = `
      relative isolate inline-flex items-center justify-center
      font-medium transition-all duration-200
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
    `;

    // Variant-specific classes
    const variantClasses = {
      primary: `
        bg-neutral-900 text-white hover:opacity-90
        dark:bg-white dark:text-black dark:hover:opacity-90
        focus-visible:ring-neutral-500 dark:focus-visible:ring-neutral-400
        dark:focus-visible:ring-offset-gray-900
        shadow-sm hover:shadow-md
      `,
      secondary: `
        bg-indigo-600 text-white hover:bg-indigo-700
        dark:bg-indigo-500 dark:hover:bg-indigo-600
        focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400
        dark:focus-visible:ring-offset-gray-900
        shadow-md hover:shadow-lg
      `,
      outline: `
        border border-current text-current
        hover:bg-neutral-100 dark:hover:bg-neutral-800
        focus-visible:ring-neutral-500 dark:focus-visible:ring-neutral-400
        dark:focus-visible:ring-offset-gray-900
      `,
      white: `
        bg-white text-black hover:bg-gray-50 border border-gray-200
        dark:bg-white dark:text-black dark:hover:bg-gray-100 dark:border-gray-300
        focus-visible:ring-neutral-500 dark:focus-visible:ring-neutral-400
        focus-visible:ring-offset-transparent
        shadow-sm hover:shadow-md
      `,
    };

    // Size-specific classes
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5 min-h-[32px]',
      md: 'px-4 py-2 text-base rounded-xl gap-2 min-h-[40px]',
      lg: 'px-8 py-3 text-lg rounded-xl gap-2.5 min-h-[48px]',
    };

    // Combine all classes
    const buttonClasses = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${className}
    `;

    // Animation variants for content
    const contentVariants = {
      hidden: { opacity: 0, y: 5 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -5 },
    };

    // Animation variants for success icon
    const successVariants = {
      hidden: { scale: 0.5, opacity: 0 },
      visible: { 
        scale: 1, 
        opacity: 1,
        transition: { 
          type: 'spring', 
          stiffness: 500, 
          damping: 15,
          duration: 0.3
        } 
      },
      exit: { scale: 0.5, opacity: 0 },
    };

    // Determine icon size based on button size
    const iconSize = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    // Render button content based on state
    const renderContent = () => (
      <AnimatePresence mode="wait" initial={false}>
        {isSuccess && showSuccess ? (
          <motion.div
            key="success"
            className="absolute inset-0 flex items-center justify-center"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={reducedMotion ? {} : successVariants}
          >
            <CheckIcon className={`${iconSize[size]} text-current`} aria-hidden="true" />
          </motion.div>
        ) : isLoading ? (
          <motion.div
            key="loading"
            className="absolute inset-0 flex items-center justify-center"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={reducedMotion ? {} : contentVariants}
          >
            <Spinner 
              size={size === 'lg' ? 'md' : size === 'md' ? 'sm' : 'sm'} 
              variant={
                variant === 'white' ? 'dark' : // White buttons need dark spinner
                variant === 'primary' ? (currentTheme === 'dark' ? 'dark' : 'light') : // Primary: light spinner on dark theme, dark spinner on light theme
                variant === 'secondary' ? 'light' : // Secondary always has dark background, needs light spinner
                'auto' // Outline uses auto to match current theme
              } 
            />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            className="flex items-center justify-center"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={reducedMotion ? {} : contentVariants}
          >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span>{children}</span>
          </motion.div>
        )}
      </AnimatePresence>
    );

    // Common props for both button and link
    const commonProps = {
      className: buttonClasses,
      'aria-label': ariaLabel || (typeof children === 'string' ? children : undefined),
      'data-state': isSuccess ? 'success' : isLoading ? 'loading' : disabled ? 'disabled' : 'idle',
      'data-theme': currentTheme,
      'data-reduced-motion': reducedMotion,
      onClick: !disabled && !isLoading ? onClick : (e: React.MouseEvent) => e.preventDefault(),
    };

    // If href is provided and not disabled, render as a link
    if (href && !disabled && !isLoading) {
      if (external) {
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={disabled ? 'true' : undefined}
            {...commonProps}
            {...props}
          >
            {renderContent()}
          </a>
        );
      }

      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          aria-disabled={disabled ? 'true' : undefined}
          {...commonProps}
          {...props}
        >
          {renderContent()}
        </Link>
      );
    }

    // Otherwise, render as a button
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        aria-live={isLoading || isSuccess ? 'polite' : undefined}
        {...commonProps}
        {...props}
      >
        {renderContent()}
      </button>
    );
  }
);

CTAButton.displayName = 'CTAButton';

