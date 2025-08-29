import React from 'react';
import { DashboardCard } from '../atoms/DashboardCard';
import { DashboardSectionHeader } from '../atoms/DashboardSectionHeader';

interface DashboardCardWithHeaderProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  cardVariant?:
    | 'default'
    | 'interactive'
    | 'settings'
    | 'analytics'
    | 'empty-state';
  headerActions?: React.ReactNode;
  headerLevel?: 'h2' | 'h3' | 'h4';
  className?: string;
  onClick?: () => void;
  border?: boolean;
}

export function DashboardCardWithHeader({
  title,
  description,
  children,
  cardVariant = 'default',
  headerActions,
  headerLevel = 'h3',
  className,
  onClick,
  border = false,
}: DashboardCardWithHeaderProps) {
  return (
    <DashboardCard
      variant={cardVariant}
      className={className}
      onClick={onClick}
    >
      <DashboardSectionHeader
        title={title}
        description={description}
        level={headerLevel}
        actions={headerActions}
        border={border}
      />
      {children}
    </DashboardCard>
  );
}
