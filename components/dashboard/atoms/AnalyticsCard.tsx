import {
  ChartBarIcon,
  ClockIcon,
  MusicalNoteIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { DashboardStatCard } from '../molecules/DashboardStatCard';

interface AnalyticsCardProps {
  title: string;
  value: number | string;
  metadata?: string;
  order?: string;
}

const getIcon = (title: string) => {
  switch (title) {
    case 'Total Clicks':
      return ChartBarIcon;
    case 'Spotify Clicks':
      return MusicalNoteIcon;
    case 'Social Clicks':
      return ShareIcon;
    case 'Recent Activity':
      return ClockIcon;
    default:
      return ChartBarIcon;
  }
};

export function AnalyticsCard({
  title,
  value,
  metadata,
  order,
}: AnalyticsCardProps) {
  return (
    <div className={order}>
      <DashboardStatCard
        title={title}
        value={value}
        metadata={metadata}
        icon={getIcon(title)}
      />
    </div>
  );
}
