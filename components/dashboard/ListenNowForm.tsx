'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataCard } from '@/components/ui/DataCard';
import { InfoBox } from '@/components/ui/InfoBox';
import { createBrowserClient } from '@/lib/supabase';
import { buildSpotifyArtistUrl } from '@/lib/spotify';
import { Artist, Release } from '@/types/db';

interface ListenNowFormProps {
  artist: Artist;
  onUpdate: (artist: Artist) => void;
}

export function ListenNowForm({ artist }: ListenNowFormProps) {
  const [releases, setReleases] = useState<Release[]>([]);
  const supabase = createBrowserClient();

  useEffect(() => {
    fetchReleases();
  }, [artist.id]);

  const fetchReleases = async () => {
    try {
      const { data, error } = await supabase
        .from('releases')
        .select('*')
        .eq('artist_id', artist.id)
        .order('release_date', { ascending: false });

      if (error) throw error;
      setReleases(data || []);
    } catch (error) {
      console.error('Error fetching releases:', error);
    }
  };

  const currentListenUrl =
    releases.length > 0
      ? releases[0].url
      : buildSpotifyArtistUrl(artist.spotify_id);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Listen Now Button</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Link
              </label>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 break-all">
                {currentListenUrl}
              </p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {releases.length > 0
                  ? `Links to your latest release: "${releases[0].title}"`
                  : 'Links to your Spotify artist page'}
              </p>
            </div>

            <InfoBox title="How it works:">
              <ul className="space-y-1">
                <li>• We automatically detect your latest release from Spotify</li>
                <li>• If no recent release is found, we link to your artist page</li>
                <li>• The link updates automatically when you release new music</li>
              </ul>
            </InfoBox>
          </div>
        </CardContent>
      </Card>

      {releases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Releases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {releases.map((release, index) => (
                <DataCard
                  key={release.id}
                  title={release.title}
                  subtitle={release.release_date
                    ? new Date(release.release_date).toLocaleDateString()
                    : 'No date'}
                  badge={index === 0 ? 'Currently featured' : undefined}
                  badgeVariant={index === 0 ? 'success' : 'default'}
                  actions={
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open(release.url, '_blank')}
                    >
                      View
                    </Button>
                  }
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
