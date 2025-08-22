'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';

export type ThemeType = 'light' | 'dark' | 'system';

interface ThemeIconProps {
  /** The theme this icon represents */
  theme: ThemeType;
  /** Whether this icon is currently active */
  isActive?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
  /** Whether to use reduced motion */
  reducedMotion?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

const iconComponents = {
  light: SunIcon,
  dark: MoonIcon,
  system: ComputerDesktopIcon,
};

const iconVariants = {
  inactive: {
    scale: 0.8,
    rotate: -180,
    opacity: 0.6,
  },
  active: {
    scale: 1,
    rotate: 0,
    opacity: 1,
  },
  hover: {
    scale: 1.05,
    rotate: 5,
    opacity: 1,
  },
};

export function ThemeIcon({
  theme,
  isActive = false,
  size = 'md',
  className = '',
  reducedMotion = false,
}: ThemeIconProps) {
  const IconComponent = iconComponents[theme];

  const combinedClassName = `
    ${sizeClasses[size]}
    ${className}
    transition-colors duration-200
    ${isActive ? 'text-current' : 'text-gray-500 dark:text-gray-400'}
  `.trim();

  if (reducedMotion) {
    return (
      <IconComponent
        className={combinedClassName}
        aria-hidden="true"
      />
    );
  }

  return (
    <motion.div
      initial="inactive"
      animate={isActive ? "active" : "inactive"}
      whileHover="hover"
      variants={iconVariants}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        duration: 0.2,
      }}
    >
      <IconComponent
        className={combinedClassName}
        aria-hidden="true"
      />
    </motion.div>
  );
}