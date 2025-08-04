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
            socialLinks?.reduce((sum, link) => sum + (link.clicks || 0), 0) ||
            0;
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
        <h3 className="text-lg font-semibold text-white">Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-white/10 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-semibold text-white">
            {analytics.totalClicks}
          </div>
          <div className="text-sm text-white/70">Total Clicks</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-semibold text-white">
            {analytics.spotifyClicks}
          </div>
          <div className="text-sm text-white/70">Spotify Clicks</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-semibold text-white">
            {analytics.socialClicks}
          </div>
          <div className="text-sm text-white/70">Social Clicks</div>
        </div>
      </div>
    </div>
  );
}
