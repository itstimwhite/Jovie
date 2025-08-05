'use client';

import { useState, useEffect } from 'react';
import { getAuthenticatedClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Artist } from '@/types/db';

interface ListenNowFormProps {
  artist: Artist;
  onUpdate: (artist: Artist) => void;
}

export function ListenNowForm({ artist, onUpdate }: ListenNowFormProps) {
  const [spotifyUrl, setSpotifyUrl] = useState(artist.spotify_url || '');
  const [appleMusicUrl, setAppleMusicUrl] = useState(artist.apple_music_url || '');
  const [youtubeUrl, setYoutubeUrl] = useState(artist.youtube_url || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    setSuccess(false);

    try {
      const supabase = await getAuthenticatedClient();

      const { data, error } = await supabase
        .from('artists')
        .update({
          spotify_url: spotifyUrl || null,
          apple_music_url: appleMusicUrl || null,
          youtube_url: youtubeUrl || null,
        })
        .eq('id', artist.id)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      onUpdate(data as unknown as Artist);
      setSuccess(true);
    } catch (error) {
      console.error('Error updating listen now links:', error);
      setError('Failed to update links. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Spotify URL"
        error={error}
      >
        <Input
          type="url"
          value={spotifyUrl}
          onChange={(e) => setSpotifyUrl(e.target.value)}
          placeholder="https://open.spotify.com/artist/..."
        />
      </FormField>

      <FormField
        label="Apple Music URL"
      >
        <Input
          type="url"
          value={appleMusicUrl}
          onChange={(e) => setAppleMusicUrl(e.target.value)}
          placeholder="https://music.apple.com/..."
        />
      </FormField>

      <FormField
        label="YouTube URL"
      >
        <Input
          type="url"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://youtube.com/..."
        />
      </FormField>

      <Button
        type="submit"
        disabled={loading}
        variant="primary"
        className="w-full"
      >
        {loading ? 'Updating...' : 'Update Links'}
      </Button>

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <p className="text-sm text-green-600 dark:text-green-400">
            Links updated successfully!
          </p>
        </div>
      )}
    </form>
  );
}
