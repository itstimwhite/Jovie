import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardSectionHeaderProps {
  title: string;
  description?: string;
  level?: 'h2' | 'h3' | 'h4';
  className?: string;
  actions?: React.ReactNode;
  border?: boolean;
}

export function DashboardSectionHeader({
  title,
  description,
  level = 'h3',
  className,
  actions,
  border = false,
}: DashboardSectionHeaderProps) {
  const HeadingComponent = level;

  const headingSizes = {
    h2: 'text-xl font-semibold',
    h3: 'text-lg font-semibold',
    h4: 'text-base font-semibold',
  };

  return (
    <div
      className={cn(
        'flex items-start justify-between',
        border && 'pb-6 border-b border-subtle mb-6',
        !border && 'mb-4',
        className
      )}
    >
      <div className='flex-1'>
        <HeadingComponent
          className={cn(headingSizes[level], 'text-primary tracking-tight')}
        >
          {title}
        </HeadingComponent>
        {description && (
          <p className='mt-2 text-sm text-secondary'>{description}</p>
        )}
      </div>
      {actions && <div className='ml-4 flex-shrink-0'>{actions}</div>}
    </div>
  );
}
