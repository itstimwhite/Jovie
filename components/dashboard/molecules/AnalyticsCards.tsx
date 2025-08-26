'use client';

import { useState, useEffect } from 'react';
import { AnalyticsCard } from '../atoms/AnalyticsCard';

interface AnalyticsData {
  total_clicks: number;
  spotify_clicks: number;
  social_clicks: number;
  recent_clicks: number;
}

export function AnalyticsCards() {
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
        const res = await fetch('/api/dashboard/analytics', {
          cache: 'no-store',
        });
        if (!res.ok)
          throw new Error(`Failed to fetch analytics (${res.status})`);
        const json: AnalyticsData = await res.json();
        setData(json);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

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
