'use client';

import React from 'react';
import { ToastProvider as ToastContextProvider } from '@/components/ui/ToastContainer';

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  return <ToastContextProvider>{children}</ToastContextProvider>;
}
