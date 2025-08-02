'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createBrowserClient } from '@/lib/supabase';
import { SocialLink } from '@/types/db';
import { SOCIAL_PLATFORMS, MAX_SOCIAL_LINKS } from '@/constants/app';

interface SocialsFormProps {
  artistId: string;
}

export function SocialsForm({ artistId }: SocialsFormProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createBrowserClient();

  useEffect(() => {
    fetchSocialLinks();
  }, [artistId]);

  const fetchSocialLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('artist_id', artistId)
        .order('clicks', { ascending: false });

      if (error) throw error;
      setSocialLinks(data || []);
    } catch (error) {
      console.error('Error fetching social links:', error);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlatform || !newUrl) return;

    if (socialLinks.length >= MAX_SOCIAL_LINKS) {
      setError(`Maximum ${MAX_SOCIAL_LINKS} social links allowed`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('social_links')
        .insert({
          artist_id: artistId,
          platform: newPlatform,
          url: newUrl,
        })
        .select('*')
        .single();

      if (error) throw error;

      setSocialLinks([...socialLinks, data]);
      setNewPlatform('');
      setNewUrl('');
    } catch (error) {
      console.error('Error adding social link:', error);
      setError('Failed to add social link');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', linkId);

      if (error) throw error;
      setSocialLinks(socialLinks.filter((link) => link.id !== linkId));
    } catch (error) {
      console.error('Error deleting social link:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Social Link</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddLink} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Platform
                </label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-50"
                  required
                >
                  <option value="">Select platform</option>
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="URL"
                placeholder="https://..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                type="url"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <Button type="submit" disabled={loading || !newPlatform || !newUrl}>
              {loading ? 'Adding...' : 'Add Link'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Social Links</CardTitle>
        </CardHeader>
        <CardContent>
          {socialLinks.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No social links added yet.
            </p>
          ) : (
            <div className="space-y-3">
              {socialLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                >
                  <div>
                    <p className="font-medium capitalize">{link.platform}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {link.url}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {link.clicks} clicks
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDeleteLink(link.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
