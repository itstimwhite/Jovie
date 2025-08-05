'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { getAuthenticatedClient } from '@/lib/supabase';
import { SocialLink } from '@/types/db';

interface SocialsFormProps {
  artistId: string;
}

export function SocialsForm({ artistId }: SocialsFormProps) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newLink, setNewLink] = useState({ platform: '', url: '' });

  const fetchSocialLinks = useCallback(async () => {
    try {
      // Get Clerk token for Supabase authentication
      const token = await getToken({ template: 'supabase' });

      // Get authenticated Supabase client
      const supabase = await getAuthenticatedClient(token);

      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('artist_id', artistId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching social links:', error);
      } else {
        setSocialLinks(data as SocialLink[]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [artistId, getToken]);

  useEffect(() => {
    fetchSocialLinks();
  }, [fetchSocialLinks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.platform || !newLink.url) return;

    setLoading(true);
    setError(undefined);
    setSuccess(false);

    try {
      // Get Clerk token for Supabase authentication
      const token = await getToken({ template: 'supabase' });

      // Get authenticated Supabase client
      const supabase = await getAuthenticatedClient(token);

      const { data, error } = await supabase
        .from('social_links')
        .insert({
          artist_id: artistId,
          platform: newLink.platform,
          url: newLink.url,
        })
        .select('*')
        .single();

      if (error) {
        console.error('Error adding social link:', error);
        setError('Failed to add social link');
      } else {
        setSocialLinks([...socialLinks, data as SocialLink]);
        setNewLink({ platform: '', url: '' });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to add social link');
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
          onClick={() => setNewLink({ platform: 'instagram', url: '' })}
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
            onClick={() => setNewLink({ platform: 'instagram', url: '' })}
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
              <Select
                value={link.platform}
                onChange={(e) =>
                  updateSocialLink(index, 'platform', e.target.value)
                }
                className="w-32"
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
