'use client';

import { useState, useEffect } from 'react';
import { useAuthenticatedSupabase } from '@/lib/supabase';
import { AnalyticsCard } from '../atoms/AnalyticsCard';

interface AnalyticsData {
  total_clicks: number;
  spotify_clicks: number;
  social_clicks: number;
  recent_clicks: number;
}

export function AnalyticsCards() {
  const { getAuthenticatedClient } = useAuthenticatedSupabase();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [data, setData] = useState<AnalyticsData>({
    total_clicks: 0,
    spotify_clicks: 0,
    social_clicks: 0,
    recent_clicks: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Get authenticated Supabase client using native integration
        const supabase = getAuthenticatedClient();

        if (!supabase) {
          console.error('Failed to get authenticated Supabase client');
          return;
        }

        // Get analytics data for the current user's artists
        const { data: analyticsData, error } = await supabase
          .from('click_events')
          .select('*')
          .gte(
            'created_at',
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          );

        if (error) {
          console.error('Error fetching analytics:', error);
          setError('Failed to load analytics');
        } else {
          // Process analytics data
          const totalClicks = analyticsData?.length || 0;
          const spotifyClicks =
            analyticsData?.filter((e) => e.link_type === 'listen').length || 0;
          const socialClicks =
            analyticsData?.filter((e) => e.link_type === 'social').length || 0;
          const recentClicks =
            analyticsData?.filter(
              (e) =>
                new Date(e.created_at as string) >
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length || 0;

          setData({
            total_clicks: totalClicks,
            spotify_clicks: spotifyClicks,
            social_clicks: socialClicks,
            recent_clicks: recentClicks,
          });
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [getAuthenticatedClient]);

  const cards = [
    {
      id: 'total_clicks',
      title: 'Total Clicks',
      value: data.total_clicks,
      metadata: 'Last 30 days',
    },
    {
      id: 'spotify_clicks',
      title: 'Spotify Clicks',
      value: data.spotify_clicks,
      metadata: 'Music platform clicks',
    },
    {
      id: 'social_clicks',
      title: 'Social Clicks',
      value: data.social_clicks,
      metadata: 'Social media clicks',
    },
    {
      id: 'recent_activity',
      title: 'Recent Activity',
      value: data.recent_clicks,
      metadata: 'Last 7 days',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <AnalyticsCard key={card.id} title="Loading..." value="..." />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <AnalyticsCard
          key={card.id}
          title={card.title}
          value={card.value}
          metadata={card.metadata}
        />
      ))}
    </div>
  );
}
