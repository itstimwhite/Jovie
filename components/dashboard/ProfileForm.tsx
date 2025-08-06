'use client';

import { useState } from 'react';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { useAuthenticatedSupabase } from '@/lib/supabase';
import { Artist } from '@/types/db';

interface ProfileFormProps {
  artist: Artist;
  onUpdate: (artist: Artist) => void;
}

export function ProfileForm({ artist, onUpdate }: ProfileFormProps) {
  const { getAuthenticatedClient } = useAuthenticatedSupabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: artist.name || '',
    tagline: artist.tagline || '',
    image_url: artist.image_url || '',
  });

  const previewArtist: Artist = { ...artist, ...formData };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    setSuccess(false);

    try {
      // Get authenticated Supabase client
      const supabase = await getAuthenticatedClient();

      if (!supabase) {
        setError('Database connection failed. Please try again later.');
        return;
      }

      const { data, error } = await supabase
        .from('artists')
        .update({
          name: formData.name,
          tagline: formData.tagline,
          image_url: formData.image_url || null,
        })
        .eq('id', artist.id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        setError('Failed to update profile');
      } else {
        onUpdate(data as Artist);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Artist Name" error={error}>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your Artist Name"
            required
          />
        </FormField>

        <FormField label="Tagline" error={error}>
          {/* Assuming Textarea is removed or replaced, using Input for now */}
          <Input
            type="text"
            value={formData.tagline}
            onChange={(e) =>
              setFormData({ ...formData, tagline: e.target.value })
            }
            placeholder="Share your story, music journey, or what inspires you..."
          />
        </FormField>

        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          className="w-full"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </Button>

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-sm text-green-600 dark:text-green-400">
              Profile updated successfully!
            </p>
          </div>
        )}
      </form>

      <aside
        aria-label="Profile preview"
        className="rounded-lg border border-gray-200 p-6 dark:border-gray-700"
      >
        <ProfileHeader artist={previewArtist} />
      </aside>
    </div>
  );
}
