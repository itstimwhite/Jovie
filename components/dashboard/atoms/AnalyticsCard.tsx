import { DataCard } from '@/components/ui/DataCard';

interface AnalyticsCardProps {
  title: string;
  value: number | string;
  metadata?: string;
  order?: string;
}

export function AnalyticsCard({
  title,
  value,
  metadata,
  order,
}: AnalyticsCardProps) {
  return (
    <div className={order}>
      <DataCard title={title} subtitle={String(value)} metadata={metadata} />
    </div>
  );
}
