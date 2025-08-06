'use client';

import { useState } from 'react';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthenticatedSupabase } from '@/lib/supabase';
import { Artist } from '@/types/db';

interface ListenNowFormProps {
  artist: Artist;
  onUpdate: (artist: Artist) => void;
}

export function ListenNowForm({ artist, onUpdate }: ListenNowFormProps) {
  const { getAuthenticatedClient } = useAuthenticatedSupabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    spotify_url: artist.spotify_url || '',
    apple_music_url: artist.apple_music_url || '',
    youtube_url: artist.youtube_url || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    setSuccess(false);

    try {
      // Get authenticated Supabase client using native integration
      const supabase = getAuthenticatedClient();

      if (!supabase) {
        setError('Database connection failed. Please try again later.');
        return;
      }

      const { data, error } = await supabase
        .from('artists')
        .update({
          spotify_url: formData.spotify_url || null,
          apple_music_url: formData.apple_music_url || null,
          youtube_url: formData.youtube_url || null,
        })
        .eq('id', artist.id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating music links:', error);
        setError('Failed to update music links');
      } else {
        onUpdate(data as Artist);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to update music links');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Spotify URL" error={error}>
        <Input
          type="url"
          value={formData.spotify_url}
          onChange={(e) =>
            setFormData({ ...formData, spotify_url: e.target.value })
          }
          placeholder="https://open.spotify.com/artist/..."
        />
      </FormField>

      <FormField label="Apple Music URL">
        <Input
          type="url"
          value={formData.apple_music_url}
          onChange={(e) =>
            setFormData({ ...formData, apple_music_url: e.target.value })
          }
          placeholder="https://music.apple.com/..."
        />
      </FormField>

      <FormField label="YouTube URL">
        <Input
          type="url"
          value={formData.youtube_url}
          onChange={(e) =>
            setFormData({ ...formData, youtube_url: e.target.value })
          }
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
