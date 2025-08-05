'use client';

import { useState, useEffect } from 'react';
import { getAuthenticatedClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SocialLink } from '@/types/db';

interface SocialsFormProps {
  artistId: string;
}

export function SocialsForm({ artistId }: SocialsFormProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const supabase = await getAuthenticatedClient();

        const { data, error } = await supabase
          .from('social_links')
          .select('*')
          .eq('artist_id', artistId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching social links:', error);
        } else {
          setSocialLinks((data as unknown as SocialLink[]) || []);
        }
      } catch (error) {
        console.error('Error fetching social links:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, [artistId]);

  const handleSave = async () => {
    setSaving(true);
    setError(undefined);
    setSuccess(false);

    try {
      const supabase = await getAuthenticatedClient();

      // Delete existing social links
      await supabase.from('social_links').delete().eq('artist_id', artistId);

      // Insert new social links
      if (socialLinks.length > 0) {
        const { error } = await supabase.from('social_links').insert(
          socialLinks.map((link) => ({
            artist_id: artistId,
            platform: link.platform,
            url: link.url,
          }))
        );

        if (error) {
          throw error;
        }
      }

      setSuccess(true);
    } catch (error) {
      console.error('Error saving social links:', error);
      setError('Failed to save social links. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addSocialLink = () => {
    setSocialLinks([
      ...socialLinks,
      {
        id: `temp-${Date.now()}`,
        artist_id: artistId,
        platform: 'instagram',
        url: '',
        clicks: 0,
        created_at: new Date().toISOString(),
      },
    ]);
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
          onClick={addSocialLink}
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
            onClick={addSocialLink}
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
                onValueChange={(value) =>
                  updateSocialLink(index, 'platform', value)
                }
                className="w-32"
              >
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
                <option value="website">Website</option>
              </Select>

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
            onClick={handleSave}
            disabled={saving}
            variant="primary"
            className="w-full"
          >
            {saving ? 'Saving...' : 'Save Social Links'}
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
