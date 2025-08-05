'use client';

import { useState, useEffect } from 'react';
import { getAuthenticatedClient } from '@/lib/supabase';
import { DataCard } from '@/components/ui/DataCard';

interface AnalyticsData {
  totalPlays: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
}

export function AnalyticsCards({ artistId }: { artistId: string }) {
  const [data, setData] = useState<AnalyticsData>({
    totalPlays: 0,
    totalLikes: 0,
    totalShares: 0,
    totalComments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const supabase = await getAuthenticatedClient();

        // Fetch analytics data for the artist
        const { data: analytics, error } = await supabase
          .from('analytics')
          .select('*')
          .eq('artist_id', artistId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching analytics:', error);
        } else if (analytics) {
          setData({
            totalPlays: (analytics.total_plays as number) || 0,
            totalLikes: (analytics.total_likes as number) || 0,
            totalShares: (analytics.total_shares as number) || 0,
            totalComments: (analytics.total_comments as number) || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [artistId]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <DataCard
        title="Total Plays"
        subtitle={data.totalPlays.toLocaleString()}
        badge="+12%"
        badgeVariant="success"
      />
      <DataCard
        title="Total Likes"
        subtitle={data.totalLikes.toLocaleString()}
        badge="+8%"
        badgeVariant="success"
      />
      <DataCard
        title="Total Shares"
        subtitle={data.totalShares.toLocaleString()}
        badge="+15%"
        badgeVariant="success"
      />
      <DataCard
        title="Total Comments"
        subtitle={data.totalComments.toLocaleString()}
        badge="+5%"
        badgeVariant="success"
      />
    </div>
  );
}
