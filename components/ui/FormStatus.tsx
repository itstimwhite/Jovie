import React from 'react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

interface FormStatusProps {
  loading?: boolean;
  error?: string;
  success?: string;
  className?: string;
}

export function FormStatus({ 
  loading = false, 
  error, 
  success, 
  className 
}: FormStatusProps) {
  if (!loading && !error && !success) return null;

  return (
    <div className={cn('space-y-2', className)}>
      {loading && (
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <LoadingSpinner size="sm" />
          <span>Processing...</span>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      
      {success && (
        <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
      )}
    </div>
  );
}