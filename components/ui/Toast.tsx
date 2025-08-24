'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useAudioContext } from '@/lib/hooks/useAudioContext';

// Icons for different toast types
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-react';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  /** Whether to play a sound when the toast appears */
  playSound?: boolean;
}

// Default durations for different toast types (in ms)
const DEFAULT_DURATIONS: Record<ToastType, number> = {
  info: 5000,
  success: 3000,
  warning: 6000,
  error: 8000,
};

// Sound files for different toast types
const TOAST_SOUNDS: Record<ToastType, string> = {
  info: '/sounds/toast-info.mp3',
  success: '/sounds/toast-success.mp3',
  warning: '/sounds/toast-warning.mp3',
  error: '/sounds/toast-error.mp3',
};

export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = 'info',
  duration,
  onClose,
  action,
  className,
  playSound = false,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const { playSound: playSoundEffect } = useAudioContext();

  // Use type-specific default duration if not provided
  const effectiveDuration = duration ?? DEFAULT_DURATIONS[type];

  // Calculate adjusted duration based on message length
  const adjustedDuration = Math.max(
    effectiveDuration,
    // Ensure minimum duration of 3 seconds or longer for longer messages
    Math.min(3000, message.length * 50)
  );

  useEffect(() => {
    // Play sound effect when toast appears
    if (playSound) {
      playSoundEffect(TOAST_SOUNDS[type], 0.2);
    }

    if (!adjustedDuration) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      // Allow time for exit animation
      setTimeout(() => {
        onClose?.();
      }, prefersReducedMotion ? 100 : 300);
    }, adjustedDuration);

    return () => clearTimeout(timer);
  }, [adjustedDuration, onClose, playSound, playSoundEffect, prefersReducedMotion, type]);

  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    action?.onClick();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, prefersReducedMotion ? 100 : 300);
  };

  // Icon components for each toast type
  const IconComponent = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle,
  }[type];

  // Tailwind classes for different toast types
  const typeStyles = {
    info: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/80 dark:text-blue-100 dark:border-blue-800',
    success: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/80 dark:text-green-100 dark:border-green-800',
    warning: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/80 dark:text-amber-100 dark:border-amber-800',
    error: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/80 dark:text-red-100 dark:border-red-800',
  };

  const iconStyles = {
    info: 'text-blue-500 dark:text-blue-400',
    success: 'text-green-500 dark:text-green-400',
    warning: 'text-amber-500 dark:text-amber-400',
    error: 'text-red-500 dark:text-red-400',
  };

  const actionStyles = {
    info: 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300',
    success: 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300',
    warning: 'text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300',
    error: 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300',
  };

  // Animation variants
  const toastVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95,
      transition: { 
        duration: prefersReducedMotion ? 0.1 : 0.2 
      }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: prefersReducedMotion ? 0.1 : 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      transition: { 
        duration: prefersReducedMotion ? 0.1 : 0.2,
        ease: "easeIn"
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={id}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={toastVariants}
          role="alert"
          aria-live={type === 'error' ? 'assertive' : 'polite'}
          className={cn(
            'px-4 py-3 rounded-lg shadow-md flex items-center gap-3 z-50 border',
            'max-w-md w-full backdrop-blur-sm',
            typeStyles[type],
            className
          )}
        >
          <div className={cn('flex-shrink-0', iconStyles[type])}>
            <IconComponent size={18} />
          </div>
          
          <span className="text-sm flex-grow">{message}</span>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {action && (
              <button
                onClick={handleActionClick}
                className={cn(
                  'text-sm font-medium px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10',
                  actionStyles[type]
                )}
              >
                {action.label}
              </button>
            )}
            
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

