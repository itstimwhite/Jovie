'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Form } from '@/components/ui/Form';
import { useFormState } from '@/lib/hooks/useFormState';
import { createBrowserClient } from '@/lib/supabase';
import { Artist } from '@/types/db';
import { DEFAULT_PROFILE_TAGLINE } from '@/constants/app';

interface ProfileFormProps {
  artist: Artist;
  onUpdate: (artist: Artist) => void;
}

export function ProfileForm({ artist, onUpdate }: ProfileFormProps) {
  const [tagline, setTagline] = useState(artist.tagline || '');
  const [imageUrl, setImageUrl] = useState(artist.image_url || '');
  const { loading, error, success, handleAsync, setSuccess } = useFormState();
  const supabase = createBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await handleAsync(async () => {
      const { data, error } = await supabase
        .from('artists')
        .update({
          tagline: tagline || null,
          image_url: imageUrl || null,
        })
        .eq('id', artist.id)
        .select('*')
        .single();

      if (error) throw error;

      onUpdate(data);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form 
          onSubmit={handleSubmit} 
          loading={loading} 
          error={error} 
          success={success}
        >
          <FormField label="Artist Name">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {artist.name} (from Spotify)
            </p>
          </FormField>

          <FormField label="Tagline">
            <Textarea
              placeholder={DEFAULT_PROFILE_TAGLINE}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              rows={2}
            />
          </FormField>

          <FormField label="Profile Image URL (optional)">
            <Input
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              type="url"
            />
          </FormField>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
