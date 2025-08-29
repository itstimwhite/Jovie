'use client';

import { useEffect, useState } from 'react';
import { useFeatureFlag } from '@/lib/analytics';

interface TipMetricsCardProps {
  artistHandle?: string;
}

export function TipMetricsCard({ artistHandle }: TipMetricsCardProps) {
  const [tipCount, setTipCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const tipEnabled = useFeatureFlag('feature_tipping', false);

  useEffect(() => {
    if (!tipEnabled || !artistHandle) {
      setLoading(false);
      return;
    }

    // In a real implementation, this would fetch data from an API
    // For now, we'll simulate fetching data with a timeout
    const fetchTipData = async () => {
      try {
        // This would be replaced with an actual API call
        // Example: const response = await fetch(`/api/dashboard/tipping/metrics?handle=${artistHandle}`);
        
        // Simulate API response delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data - in production this would come from the API
        const mockCount = Math.floor(Math.random() * 50) + 5;
        
        setTipCount(mockCount);
      } catch (error) {
        console.error('Error fetching tip metrics:', error);
        setTipCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTipData();
  }, [artistHandle, tipEnabled]);

  if (!tipEnabled) {
    return null;
  }

  return (
    <div className="bg-surface-1/80 backdrop-blur-sm rounded-lg border border-subtle/50 p-4 hover:shadow-lg hover:border-accent/20 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary-token">
            Venmo Tip Clicks
          </p>
          {loading ? (
            <div className="h-8 w-24 bg-surface-2 animate-pulse rounded mt-1"></div>
          ) : (
            <p className="text-2xl font-bold text-primary-token">
              {tipCount !== null ? tipCount : '0'}
            </p>
          )}
        </div>
        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
          <span className="text-lg">💸</span>
        </div>
      </div>
      <p className="text-xs text-secondary-token mt-2">
        Total clicks on "Tip with Venmo" button
      </p>
    </div>
  );
}

