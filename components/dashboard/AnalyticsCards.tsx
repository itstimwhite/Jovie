'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { createBrowserClient } from '@/lib/supabase';
import { AnalyticsData } from '@/types/common';

interface AnalyticsCardsProps {
  artistId: string;
}

export function AnalyticsCards({ artistId }: AnalyticsCardsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  useEffect(() => {
    fetchAnalytics();
  }, [artistId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const { data: clickEvents, error: clickError } = await supabase
        .from('click_events')
        .select('link_type, target')
        .eq('artist_id', artistId);

      if (clickError) throw clickError;

      const { data: socialLinks, error: socialError } = await supabase
        .from('social_links')
        .select('platform, clicks')
        .eq('artist_id', artistId);

      if (socialError) throw socialError;

      const totalClicks = clickEvents.length;
      const listenClicks = clickEvents.filter(e => e.link_type === 'listen').length;
      const socialClicks = clickEvents.filter(e => e.link_type === 'social').length;

      const linkBreakdown = [
        ...socialLinks.map(link => ({
          type: 'social' as const,
          target: link.platform,
          clicks: link.clicks,
        })),
        {
          type: 'listen' as const,
          target: 'spotify',
          clicks: listenClicks,
        },
      ].filter(item => item.clicks > 0)
       .sort((a, b) => b.clicks - a.clicks);

      setAnalytics({
        totalClicks,
        listenClicks,
        socialClicks,
        linkBreakdown,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400">
            Failed to load analytics data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalClicks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Listen Now Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.listenClicks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Social Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.socialClicks}</div>
          </CardContent>
        </Card>
      </div>

      {analytics.linkBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Click Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.linkBreakdown.map((item, index) => (
                <div
                  key={`${item.type}-${item.target}`}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                    <span className="capitalize">
                      {item.type === 'listen' ? 'Listen Now' : item.target}
                    </span>
                  </div>
                  <span className="font-medium">{item.clicks}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {analytics.linkBreakdown.length === 0 && (
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No clicks yet. Share your profile to start seeing analytics!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}