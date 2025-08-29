'use client';

import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { useFeatureFlags } from '@/lib/hooks/useFeatureFlags';
import { cn } from '@/lib/utils';
import { DashboardCard } from '../dashboard/atoms/DashboardCard';

interface TipMetricsCardProps {
  className?: string;
  manualAmount?: number | null;
}

export function TipMetricsCard({ className, manualAmount }: TipMetricsCardProps) {
  // We'll use feature flags to control the display of this component
  const { tipPromoEnabled } = useFeatureFlags();

  // If tipping is not enabled, don't render anything
  if (!tipPromoEnabled) {
    return null;
  }

  return (
    <DashboardCard variant='analytics' className={cn('w-full', className)}>
      <div className='flex items-center justify-between'>
        <div className='flex-1'>
          <p className='text-sm font-medium text-secondary mb-2'>Total Tips</p>
          {manualAmount !== undefined && manualAmount !== null ? (
            <p className='text-2xl font-bold text-primary tracking-tight'>
              ${manualAmount.toFixed(2)}
            </p>
          ) : (
            <>
              <p className='text-2xl font-bold text-primary tracking-tight'>
                Not available yet
              </p>
              <p className='text-xs text-tertiary mt-1'>
                Stripe integration coming soon
              </p>
            </>
          )}
        </div>
        <div className='flex-shrink-0 ml-4'>
          <CurrencyDollarIcon className='h-8 w-8 text-accent-token' />
        </div>
      </div>
    </DashboardCard>
  );
}

export default TipMetricsCard;

