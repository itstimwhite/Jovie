'use client';

import { useState, useEffect } from 'react';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useAuthenticatedSupabase } from '@/lib/supabase';
import { Artist } from '@/types/db';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface SocialsFormProps {
  artist: Artist;
}

export function SocialsForm({ artist }: SocialsFormProps) {
  const { getAuthenticatedClient } = useAuthenticatedSupabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const supabase = await getAuthenticatedClient();

        const { data, error } = await supabase
          .from('social_links')
          .select('*')
          .eq('artist_id', artist.id);

        if (error) {
          console.error('Error fetching social links:', error);
        } else {
          setSocialLinks(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchSocialLinks();
  }, [artist.id, getAuthenticatedClient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    setSuccess(false);

    try {
      const supabase = await getAuthenticatedClient();

      // Delete existing social links
      await supabase.from('social_links').delete().eq('artist_id', artist.id);

      // Insert new social links
      const linksToInsert = socialLinks
        .filter((link) => link.url.trim())
        .map((link) => ({
          artist_id: artist.id,
          platform: link.platform,
          url: link.url.trim(),
        }));

      if (linksToInsert.length > 0) {
        const { error } = await supabase
          .from('social_links')
          .insert(linksToInsert);

        if (error) {
          console.error('Error updating social links:', error);
          setError('Failed to update social links');
        } else {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        }
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to update social links');
    } finally {
      setLoading(false);
    }
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const updateSocialLink = (
    index: number,
    field: keyof SocialLink,
    value: string
  ) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setSocialLinks(updatedLinks);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Social Media Links
        </h3>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            setSocialLinks([
              ...socialLinks,
              { id: '', platform: 'instagram', url: '' },
            ])
          }
          className="text-sm"
        >
          Add Link
        </Button>
      </div>

      {socialLinks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No social media links added yet.
          </p>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              setSocialLinks([{ id: '', platform: 'instagram', url: '' }])
            }
            className="mt-2"
          >
            Add Your First Link
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {socialLinks.map((link, index) => (
            <div
              key={link.id}
              className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <FormField label="Platform" className="w-32">
                <Select
                  value={link.platform}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    updateSocialLink(index, 'platform', e.target.value)
                  }
                  options={[
                    { value: 'instagram', label: 'Instagram' },
                    { value: 'twitter', label: 'Twitter' },
                    { value: 'tiktok', label: 'TikTok' },
                    { value: 'youtube', label: 'YouTube' },
                    { value: 'facebook', label: 'Facebook' },
                    { value: 'linkedin', label: 'LinkedIn' },
                    { value: 'website', label: 'Website' },
                  ]}
                />
              </FormField>

              <Input
                type="url"
                value={link.url}
                onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                placeholder="https://..."
                className="flex-1"
              />

              <Button
                type="button"
                variant="secondary"
                onClick={() => removeSocialLink(index)}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Remove
              </Button>
            </div>
          ))}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            variant="primary"
            className="w-full"
          >
            {loading ? 'Saving...' : 'Save Social Links'}
          </Button>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <p className="text-sm text-green-600 dark:text-green-400">
            Social links saved successfully!
          </p>
        </div>
      )}
    </div>
  );
}
