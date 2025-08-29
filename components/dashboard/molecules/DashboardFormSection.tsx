import React from 'react';
import { DashboardCardWithHeader } from './DashboardCardWithHeader';

interface DashboardFormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  headerLevel?: 'h2' | 'h3' | 'h4';
}

export function DashboardFormSection({
  title,
  description,
  children,
  className,
  actions,
  headerLevel = 'h3',
}: DashboardFormSectionProps) {
  return (
    <DashboardCardWithHeader
      title={title}
      description={description}
      cardVariant='settings'
      headerActions={actions}
      headerLevel={headerLevel}
      className={className}
    >
      <div className='space-y-6'>{children}</div>
    </DashboardCardWithHeader>
  );
}
