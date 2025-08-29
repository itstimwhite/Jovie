import React from 'react';
import { cn } from '@/lib/utils';
import { DashboardButton } from '../atoms/DashboardButton';

interface DashboardNavItemProps {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isActive?: boolean;
  isPro?: boolean;
  onClick: () => void;
  collapsed?: boolean;
  className?: string;
  badge?: string;
}

export function DashboardNavItem({
  label,
  icon: Icon,
  isActive,
  isPro,
  onClick,
  collapsed,
  className,
  badge,
}: DashboardNavItemProps) {
  return (
    <DashboardButton
      variant='nav-item'
      isActive={isActive}
      onClick={onClick}
      className={cn(collapsed && 'justify-center', className)}
      title={collapsed ? label : undefined}
    >
      <Icon
        className={cn(
          'h-6 w-6 shrink-0',
          isActive ? 'text-primary' : 'text-secondary group-hover:text-primary'
        )}
        aria-hidden={true}
      />
      {!collapsed && <span className='flex-1 text-left'>{label}</span>}
      {!collapsed && badge && (
        <span className='ml-auto inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-surface-2 text-secondary border border-subtle'>
          {badge}
        </span>
      )}
      {!collapsed && isPro && (
        <span className='ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-surface-2 text-secondary border border-subtle'>
          Pro
        </span>
      )}
    </DashboardButton>
  );
}
