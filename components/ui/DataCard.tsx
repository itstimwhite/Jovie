import React from 'react';
import { cn } from '@/lib/utils';

interface DataCardProps {
  title: string;
  subtitle?: string;
  metadata?: string;
  badge?: string;
  badgeVariant?: 'default' | 'success' | 'warning' | 'error';
  actions?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export function DataCard({
  title,
  subtitle,
  metadata,
  badge,
  badgeVariant = 'default',
  actions,
  className,
  children,
  icon,
}: DataCardProps) {
  const badgeClasses = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    success:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warning:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800',
        className
      )}
    >
      <div className="flex items-start space-x-3 flex-1 min-w-0">
        {icon && (
          <div className="flex-shrink-0 mt-0.5">
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
              {React.cloneElement(icon as React.ReactElement, {
                className: 'h-5 w-5 text-gray-600 dark:text-gray-300',
              })}
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <p className="font-semibold text-gray-900 dark:text-white truncate">
              {title}
            </p>
            {badge && badge.trim() !== '' && (
              <span
                className={cn(
                  'inline-block px-2 py-0.5 text-xs font-medium rounded-full',
                  badgeClasses[badgeVariant]
                )}
              >
                {badge}
              </span>
            )}
          </div>
          {subtitle && subtitle.trim() !== '' && (
            <p className="text-2xl font-bold text-gray-900 dark:text-white truncate mb-1">
              {subtitle}
            </p>
          )}
          {metadata && metadata.trim() !== '' && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {metadata}
            </p>
          )}
          {children}
        </div>
      </div>
      {actions && <div className="flex-shrink-0 ml-4">{actions}</div>}
    </div>
  );
}
