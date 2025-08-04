'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface AnalyticsCardsProps {
  artistId: string;
}

export function AnalyticsCards({ artistId }: AnalyticsCardsProps) {
  const [analytics, setAnalytics] = useState({
    totalClicks: 0,
    spotifyClicks: 0,
    socialClicks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch total clicks from social links
        const { data: socialLinks, error: socialError } = await supabase
          .from('social_links')
          .select('clicks')
          .eq('artist_id', artistId);

        if (socialError) {
          console.error('Error fetching social analytics:', socialError);
        } else {
          const totalSocialClicks =
            socialLinks?.reduce(
              (sum, link) => sum + (Number(link.clicks) || 0),
              0
            ) || 0;
          setAnalytics((prev) => ({
            ...prev,
            socialClicks: totalSocialClicks,
            totalClicks: totalSocialClicks, // For now, just social clicks
          }));
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
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">
          Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 dark:bg-white/10 rounded-lg animate-pulse transition-colors"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">
        Analytics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 rounded-lg p-4 transition-colors">
          <div className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors">
            {analytics.totalClicks}
          </div>
          <div className="text-sm text-gray-600 dark:text-white/70 transition-colors">
            Total Clicks
          </div>
        </div>
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 rounded-lg p-4 transition-colors">
          <div className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors">
            {analytics.spotifyClicks}
          </div>
          <div className="text-sm text-gray-600 dark:text-white/70 transition-colors">
            Spotify Clicks
          </div>
        </div>
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 rounded-lg p-4 transition-colors">
          <div className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors">
            {analytics.socialClicks}
          </div>
          <div className="text-sm text-gray-600 dark:text-white/70 transition-colors">
            Social Clicks
          </div>
        </div>
      </div>
    </div>
  );
}
