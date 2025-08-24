'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Toast, ToastProps } from './Toast';
import { AnimatePresence } from 'framer-motion';

export interface ToastOptions extends Omit<ToastProps, 'id' | 'onClose'> {
  id?: string;
  /** Group similar toasts (same type and similar message) */
  groupSimilar?: boolean;
}

export interface ToastContextValue {
  showToast: (options: ToastOptions) => string;
  hideToast: (id: string) => void;
  clearToasts: () => void;
}

export const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined
);

export const useToast = (): ToastContextValue => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Maximum number of toasts to show at once */
  maxToasts?: number;
  /** Position of the toast container */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  /** Whether to play sounds for toasts by default */
  playSounds?: boolean;
}

// Helper to get similar toast messages
const getSimilarToastId = (toasts: ToastProps[], newToast: ToastOptions): string | null => {
  if (!newToast.groupSimilar) return null;

  return toasts.find(
    (toast) => 
      toast.type === newToast.type && 
      toast.message.toLowerCase().includes(newToast.message.toLowerCase().substring(0, 10))
  )?.id || null;
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  maxToasts = 5,
  position = 'bottom-right',
  playSounds = false,
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (options: ToastOptions): string => {
      // Check for similar toasts if grouping is enabled
      if (options.groupSimilar) {
        const similarToastId = getSimilarToastId(toasts, options);
        if (similarToastId) {
          // Update existing toast instead of creating a new one
          setToasts((prevToasts) => 
            prevToasts.map((toast) => 
              toast.id === similarToastId 
                ? { 
                    ...toast, 
                    message: options.message,
                    // Reset duration to give user time to read the updated message
                    duration: options.duration || toast.duration,
                  } 
                : toast
            )
          );
          return similarToastId;
        }
      }

      const id =
        options.id ||
        `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      setToasts((prevToasts) => {
        // If we're at max capacity, remove the oldest toast
        const newToasts = prevToasts.length >= maxToasts 
          ? prevToasts.slice(1) 
          : [...prevToasts];

        return [
          ...newToasts,
          {
            ...options,
            id,
            onClose: () => hideToast(id),
            // Apply default sound setting if not specified
            playSound: options.playSound ?? playSounds,
          },
        ];
      });

      return id;
    },
    [hideToast, maxToasts, playSounds, toasts]
  );

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Clean up toasts when component unmounts
  useEffect(() => {
    return () => {
      setToasts([]);
    };
  }, []);

  // Position styles for the toast container
  const positionStyles = useMemo(() => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4 items-end';
      case 'top-left':
        return 'top-4 left-4 items-start';
      case 'bottom-right':
        return 'bottom-4 right-4 items-end';
      case 'bottom-left':
        return 'bottom-4 left-4 items-start';
      case 'top-center':
        return 'top-4 left-1/2 -translate-x-1/2 items-center';
      case 'bottom-center':
        return 'bottom-4 left-1/2 -translate-x-1/2 items-center';
      default:
        return 'bottom-4 right-4 items-end';
    }
  }, [position]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, clearToasts }}>
      {children}
      <div 
        className={`fixed flex flex-col gap-2 z-50 ${positionStyles}`}
        aria-live="polite"
        role="region"
        aria-label="Notifications"
      >
        <AnimatePresence mode="sync">
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
