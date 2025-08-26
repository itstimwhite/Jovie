'use client';

import { useState } from 'react';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  Artist,
  CreatorProfile,
  convertCreatorProfileToArtist,
} from '@/types/db';

interface ListenNowFormProps {
  artist: Artist;
  onUpdate: (artist: Artist) => void;
}

export function ListenNowForm({ artist, onUpdate }: ListenNowFormProps) {
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
      const res = await fetch('/api/dashboard/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: artist.id,
          updates: {
            spotify_url: formData.spotify_url || null,
            apple_music_url: formData.apple_music_url || null,
            youtube_url: formData.youtube_url || null,
          },
        }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(err?.error ?? 'Failed to update music links');
      }
      const json: { profile: unknown } = await res.json();
      const updatedArtist = convertCreatorProfileToArtist(
        json.profile as CreatorProfile
      );
      onUpdate(updatedArtist);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
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
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
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
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
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
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
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
