'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Toast, ToastProps } from './Toast';

export interface ToastOptions extends Omit<ToastProps, 'id' | 'onClose'> {
  id?: string;
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
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (options: ToastOptions): string => {
      const id =
        options.id ||
        `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      setToasts((prevToasts) => [
        ...prevToasts,
        {
          ...options,
          id,
          onClose: () => hideToast(id),
        },
      ]);

      return id;
    },
    [hideToast]
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

  return (
    <ToastContext.Provider value={{ showToast, hideToast, clearToasts }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
