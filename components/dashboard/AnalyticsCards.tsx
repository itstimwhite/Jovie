'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { DataCard } from '@/components/ui/DataCard';
import { getAuthenticatedClient } from '@/lib/supabase';

interface AnalyticsCardsProps {
  artistId: string;
}

export function AnalyticsCards({ artistId }: AnalyticsCardsProps) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    total_plays: 0,
    total_clicks: 0,
    total_fans: 0,
  });

  const fetchAnalytics = useCallback(async () => {
    try {
      // Get Clerk token for Supabase authentication
      const token = await getToken({ template: 'supabase' });

      // Get authenticated Supabase client
      const supabase = await getAuthenticatedClient(token);

      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .eq('artist_id', artistId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching analytics:', error);
      } else {
        setAnalytics(
          data || { total_plays: 0, total_clicks: 0, total_fans: 0 }
        );
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [artistId, getToken]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

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
        subtitle={analytics.total_plays.toLocaleString()}
        badge="+12%"
        badgeVariant="success"
      />
      <DataCard
        title="Total Likes"
        subtitle={analytics.total_clicks.toLocaleString()}
        badge="+8%"
        badgeVariant="success"
      />
      <DataCard
        title="Total Shares"
        subtitle={analytics.total_fans.toLocaleString()}
        badge="+15%"
        badgeVariant="success"
      />
      <DataCard
        title="Total Comments"
        subtitle={analytics.total_fans.toLocaleString()}
        badge="+5%"
        badgeVariant="success"
      />
    </div>
  );
}
