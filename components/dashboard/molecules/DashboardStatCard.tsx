import React from 'react';
import { cn } from '@/lib/utils';
import { DashboardCard } from '../atoms/DashboardCard';

interface DashboardStatCardProps {
  title: string;
  value: number | string;
  metadata?: string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  className?: string;
  onClick?: () => void;
}

export function DashboardStatCard({
  title,
  value,
  metadata,
  icon: Icon,
  trend,
  className,
  onClick,
}: DashboardStatCardProps) {
  const trendColors = {
    increase: 'text-green-600 dark:text-green-400',
    decrease: 'text-red-600 dark:text-red-400',
    neutral: 'text-secondary',
  };

  return (
    <DashboardCard variant='analytics' className={className} onClick={onClick}>
      <div className='flex items-center justify-between'>
        <div className='flex-1'>
          <p className='text-sm font-medium text-secondary mb-2'>{title}</p>
          <p className='text-2xl font-bold text-primary tracking-tight'>
            {value}
          </p>
          {metadata && <p className='text-xs text-tertiary mt-1'>{metadata}</p>}
          {trend && (
            <p
              className={cn(
                'text-xs mt-2 font-medium',
                trendColors[trend.type]
              )}
            >
              {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className='flex-shrink-0 ml-4'>
            <Icon className='h-8 w-8 text-accent-token' />
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
