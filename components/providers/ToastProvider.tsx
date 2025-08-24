'use client';

import React from 'react';
import { ToastProvider as ToastContextProvider } from '@/components/ui/ToastContainer';

interface ToastProviderProps {
  children: React.ReactNode;
  /** Maximum number of toasts to show at once */
  maxToasts?: number;
  /** Position of the toast container */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  /** Whether to play sounds for toasts by default */
  playSounds?: boolean;
}

export function ToastProvider({ 
  children,
  maxToasts = 5,
  position = 'bottom-right',
  playSounds = false,
}: ToastProviderProps) {
  return (
    <ToastContextProvider
      maxToasts={maxToasts}
      position={position}
      playSounds={playSounds}
    >
      {children}
    </ToastContextProvider>
  );
}

