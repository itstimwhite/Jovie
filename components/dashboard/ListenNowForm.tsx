'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { createBrowserClient } from '@/lib/supabase';
import { buildSpotifyArtistUrl } from '@/lib/spotify';
import { Artist, Release } from '@/types/db';

interface ListenNowFormProps {
  artist: Artist;
  onUpdate: (artist: Artist) => void;
}

export function ListenNowForm({ artist }: ListenNowFormProps) {
  const [releases, setReleases] = useState<Release[]>([]);
  const artistId = artist.id;

  const fetchReleases = useCallback(async () => {
    if (!artistId) return;

    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('releases')
        .select('*')
        .eq('artist_id', artistId)
        .order('release_date', { ascending: false });

      if (error) throw error;
      setReleases(data || []);
    } catch (error) {
      console.error('Error fetching releases:', error);
    }
  }, [artistId]);

  useEffect(() => {
    fetchReleases();
  }, [fetchReleases]);

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

            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <h4 className="font-medium mb-2">How it works:</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>
                  • We automatically detect your latest release from Spotify
                </li>
                <li>
                  • If no recent release is found, we link to your artist page
                </li>
                <li>
                  • The link updates automatically when you release new music
                </li>
              </ul>
            </div>
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
                <div
                  key={release.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                >
                  <div>
                    <p className="font-medium">{release.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {release.release_date
                        ? new Date(release.release_date).toLocaleDateString()
                        : 'No date'}
                    </p>
                    {index === 0 && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-200">
                        Currently featured
                      </span>
                    )}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => window.open(release.url, '_blank')}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
