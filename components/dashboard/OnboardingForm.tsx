'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createBrowserClient } from '@/lib/supabase';
import { getSpotifyArtist, getArtistLatestRelease, buildSpotifyAlbumUrl } from '@/lib/spotify';
import { extractSpotifyId, generateHandle } from '@/lib/utils';
import { Artist } from '@/types/db';

interface OnboardingFormProps {
  onSuccess: (artist: Artist) => void;
}

export function OnboardingForm({ onSuccess }: OnboardingFormProps) {
  const { user } = useUser();
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const spotifyId = extractSpotifyId(spotifyUrl);
      if (!spotifyId) {
        throw new Error('Invalid Spotify URL');
      }

      const spotifyArtist = await getSpotifyArtist(spotifyId);
      const suggestedHandle = handle || generateHandle(spotifyArtist.name);

      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', user.id)
        .single();

      let userId;
      if (userError && userError.code === 'PGRST116') {
        const { data: newUser, error: createUserError } = await supabase
          .from('users')
          .insert({
            clerk_id: user.id,
            email: user.primaryEmailAddress?.emailAddress || '',
          })
          .select('id')
          .single();

        if (createUserError) throw createUserError;
        userId = newUser.id;
      } else if (userError) {
        throw userError;
      } else {
        userId = existingUser.id;
      }

      const { data: artist, error: artistError } = await supabase
        .from('artists')
        .insert({
          owner_user_id: userId,
          handle: suggestedHandle,
          spotify_id: spotifyId,
          name: spotifyArtist.name,
          image_url: spotifyArtist.images[0]?.url,
        })
        .select('*')
        .single();

      if (artistError) {
        if (artistError.code === '23505') {
          throw new Error('Handle already taken. Please choose another.');
        }
        throw artistError;
      }

      try {
        const latestRelease = await getArtistLatestRelease(spotifyId);
        if (latestRelease) {
          await supabase.from('releases').insert({
            artist_id: artist.id,
            dsp: 'spotify',
            title: latestRelease.name,
            url: buildSpotifyAlbumUrl(latestRelease.id),
            release_date: latestRelease.release_date,
          });
        }
      } catch (releaseError) {
        console.warn('Failed to fetch latest release:', releaseError);
      }

      onSuccess(artist);
    } catch (error) {
      console.error('Onboarding error:', error);
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Your Spotify</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Spotify Artist URL or ID"
            placeholder="https://open.spotify.com/artist/... or just the ID"
            value={spotifyUrl}
            onChange={(e) => setSpotifyUrl(e.target.value)}
            required
            error={error}
          />
          
          <Input
            label="Custom Handle (optional)"
            placeholder="your-artist-name"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
          />

          <Button
            type="submit"
            disabled={loading || !spotifyUrl}
            className="w-full"
          >
            {loading ? 'Creating Profile...' : 'Create Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}