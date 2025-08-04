'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Artist } from '@/types/db';

interface ListenNowFormProps {
  artist: Artist;
  onUpdate: (artist: Artist) => void;
}

export function ListenNowForm({ artist, onUpdate }: ListenNowFormProps) {
  const [spotifyUrl, setSpotifyUrl] = useState(artist.spotify_url || '');
  const [appleMusicUrl, setAppleMusicUrl] = useState(
    artist.apple_music_url || ''
  );
  const [youtubeUrl, setYoutubeUrl] = useState(artist.youtube_url || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('artists')
        .update({
          spotify_url: spotifyUrl,
          apple_music_url: appleMusicUrl,
          youtube_url: youtubeUrl,
        })
        .eq('id', artist.id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating artist:', error);
      } else {
        onUpdate(data as unknown as Artist);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Listen Now Links</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">
            Spotify URL
          </label>
          <Input
            type="url"
            value={spotifyUrl}
            onChange={(e) => setSpotifyUrl(e.target.value)}
            placeholder="https://open.spotify.com/artist/..."
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">
            Apple Music URL
          </label>
          <Input
            type="url"
            value={appleMusicUrl}
            onChange={(e) => setAppleMusicUrl(e.target.value)}
            placeholder="https://music.apple.com/artist/..."
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">
            YouTube URL
          </label>
          <Input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://youtube.com/@..."
            className="w-full"
          />
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
