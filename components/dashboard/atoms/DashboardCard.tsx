import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  variant?:
    | 'default'
    | 'interactive'
    | 'settings'
    | 'analytics'
    | 'empty-state';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

const cardVariants = {
  default:
    'bg-surface-1 border border-subtle rounded-xl p-6 shadow-sm card-hover',
  interactive:
    'bg-surface-1 backdrop-blur-sm rounded-xl border border-subtle p-6 text-left hover:shadow-xl hover:shadow-accent/10 hover:ring-1 ring-accent hover:border-accent/30 hover:bg-surface-2 transition-all duration-300 group transform hover:-translate-y-1 cursor-pointer',
  settings:
    'bg-surface-1 rounded-xl border border-subtle p-6 shadow-sm card-hover',
  analytics:
    'bg-surface-1 border border-subtle rounded-xl p-6 hover:shadow-lg hover:shadow-accent/5 hover:border-accent/20 transition-all duration-300 group card-hover',
  'empty-state':
    'bg-surface-1 border border-subtle rounded-xl p-8 text-center relative overflow-hidden',
};

export function DashboardCard({
  variant = 'default',
  children,
  className,
  onClick,
  hover = true,
}: DashboardCardProps) {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={cn(
        cardVariants[variant],
        !hover &&
          variant === 'interactive' &&
          'hover:shadow-none hover:transform-none hover:ring-0 hover:border-subtle hover:bg-surface-1',
        className
      )}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {children}
    </Component>
  );
}
