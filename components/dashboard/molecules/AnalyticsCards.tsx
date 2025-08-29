'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { DataCard } from '@/components/ui/DataCard';
import { AnalyticsCard } from '../atoms/AnalyticsCard';

interface AnalyticsData {
  total_clicks: number;
  spotify_clicks: number;
  social_clicks: number;
  recent_clicks: number;
}

interface AnalyticsCardsProps {
  profileUrl?: string;
}

export function AnalyticsCards({ profileUrl }: AnalyticsCardsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [data, setData] = useState<AnalyticsData>({
    total_clicks: 0,
    spotify_clicks: 0,
    social_clicks: 0,
    recent_clicks: 0,
  });

  // Animated display values for a subtle count-up effect
  const [displayValues, setDisplayValues] = useState<AnalyticsData>({
    total_clicks: 0,
    spotify_clicks: 0,
    social_clicks: 0,
    recent_clicks: 0,
  });
  const [copied, setCopied] = useState(false);

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

  // Run count-up animation when data changes
  useEffect(() => {
    const duration = 800; // ms
    const startValues = { ...displayValues };
    const endValues = { ...data };
    const startTime = performance.now();
    let raf = 0;

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const next: AnalyticsData = {
        total_clicks: Math.round(
          startValues.total_clicks +
            (endValues.total_clicks - startValues.total_clicks) * eased
        ),
        spotify_clicks: Math.round(
          startValues.spotify_clicks +
            (endValues.spotify_clicks - startValues.spotify_clicks) * eased
        ),
        social_clicks: Math.round(
          startValues.social_clicks +
            (endValues.social_clicks - startValues.social_clicks) * eased
        ),
        recent_clicks: Math.round(
          startValues.recent_clicks +
            (endValues.recent_clicks - startValues.recent_clicks) * eased
        ),
      };
      setDisplayValues(next);
      if (t < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data.total_clicks,
    data.spotify_clicks,
    data.social_clicks,
    data.recent_clicks,
  ]);

  const cards = [
    {
      id: 'total_clicks',
      title: 'Total Clicks',
      value: displayValues.total_clicks,
      metadata: 'Last 30 days',
    },
    {
      id: 'spotify_clicks',
      title: 'Spotify Clicks',
      value: displayValues.spotify_clicks,
      metadata: 'Music platform clicks',
    },
    {
      id: 'social_clicks',
      title: 'Social Clicks',
      value: displayValues.social_clicks,
      metadata: 'Social media clicks',
    },
    {
      id: 'recent_activity',
      title: 'Recent Activity',
      value: displayValues.recent_clicks,
      metadata: 'Last 7 days',
    },
  ];

  if (loading) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'>
        {cards.map(card => (
          <AnalyticsCard key={card.id} title='Loading...' value='...' />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center text-red-600'>
        <p>{error}</p>
      </div>
    );
  }

  const allZero =
    data.total_clicks === 0 &&
    data.spotify_clicks === 0 &&
    data.social_clicks === 0 &&
    data.recent_clicks === 0;

  const handleCopy = async () => {
    if (!profileUrl) return;
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  if (allZero) {
    return (
      <div className='grid grid-cols-1'>
        <DataCard
          title='No profile views yet'
          subtitle='Share your profile link to get started'
          metadata={profileUrl}
          actions={
            profileUrl ? (
              <Button onClick={handleCopy} aria-label='Copy profile link'>
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
            ) : null
          }
        />
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'>
      {cards.map(card => (
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
