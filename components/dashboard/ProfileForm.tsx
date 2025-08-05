'use client';

import { useState } from 'react';
import { getAuthenticatedClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { FormField } from '@/components/ui/FormField';
import { Artist } from '@/types/db';

interface ProfileFormProps {
  artist: Artist;
  onUpdate: (artist: Artist) => void;
}

export function ProfileForm({ artist, onUpdate }: ProfileFormProps) {
  const [name, setName] = useState(artist.name || '');
  const [tagline, setTagline] = useState(artist.tagline || '');
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
          name: name || null,
          tagline: tagline || null,
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
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Artist Name" error={error}>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Artist Name"
          required
        />
      </FormField>

      <FormField label="Tagline" error={error}>
        <Textarea
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="Share your story, music journey, or what inspires you..."
          rows={4}
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
  );
}
