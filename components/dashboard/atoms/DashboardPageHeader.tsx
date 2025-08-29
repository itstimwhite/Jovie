import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardPageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  actions?: React.ReactNode;
}

export function DashboardPageHeader({
  title,
  subtitle,
  className,
  actions,
}: DashboardPageHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-primary tracking-tight'>
            {title}
          </h1>
          {subtitle && <p className='text-secondary mt-1'>{subtitle}</p>}
        </div>
        {actions && <div className='ml-4 flex-shrink-0'>{actions}</div>}
      </div>
    </div>
  );
}
