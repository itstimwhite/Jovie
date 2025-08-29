import {
  ChartPieIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  LinkIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import React from 'react';
import { DashboardCard } from '../atoms/DashboardCard';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'interactive';
}

interface QuickActionsGridProps {
  onNavigate: (section: string) => void;
  className?: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'links',
    title: 'Manage Links',
    description: 'Add your social media and streaming platform links',
    icon: LinkIcon,
    variant: 'interactive',
  },
  {
    id: 'analytics',
    title: 'View Analytics',
    description: 'Track your profile performance and engagement',
    icon: ChartPieIcon,
    variant: 'default',
  },
  {
    id: 'audience',
    title: 'Manage Audience',
    description: 'Understand and engage with your fanbase',
    icon: UsersIcon,
    variant: 'default',
  },
  {
    id: 'settings',
    title: 'Profile Settings',
    description: 'Customize your profile and account preferences',
    icon: Cog6ToothIcon,
    variant: 'default',
  },
];

export function QuickActionsGrid({
  onNavigate,
  className,
}: QuickActionsGridProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 ${className}`}
    >
      {quickActions.map(action => {
        const Icon = action.icon;
        const isInteractive = action.variant === 'interactive';

        return (
          <DashboardCard
            key={action.id}
            variant={isInteractive ? 'interactive' : 'analytics'}
            onClick={() => onNavigate(action.id)}
          >
            <div className='flex items-center justify-between mb-3'>
              <Icon className='h-8 w-8 text-accent-token' />
              <ChevronRightIcon className='h-5 w-5 text-secondary group-hover:text-accent-token transition-colors' />
            </div>
            <h3 className='text-lg font-medium text-primary mb-2'>
              {action.title}
            </h3>
            <p className='text-sm text-secondary'>{action.description}</p>
          </DashboardCard>
        );
      })}
    </div>
  );
}
