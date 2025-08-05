'use client';

import { useState, useEffect } from 'react';
import { getAuthenticatedClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  clicks: number;
}

export function SocialsForm({ artistId }: { artistId: string }) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const supabase = await getAuthenticatedClient();
        
        const { data, error } = await supabase
          .from('social_links')
          .select('*')
          .eq('artist_id', artistId)
          .order('platform');

        if (error) {
          console.error('Error fetching social links:', error);
        } else {
          setSocialLinks((data as unknown as SocialLink[]) || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, [artistId]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = await getAuthenticatedClient();

      // Delete existing links
      await supabase
        .from('social_links')
        .delete()
        .eq('artist_id', artistId);

      // Insert new links
      const linksToInsert = socialLinks
        .filter(link => link.url.trim())
        .map(link => ({
          artist_id: artistId,
          platform: link.platform,
          url: link.url.trim(),
        }));

      if (linksToInsert.length > 0) {
        const { error } = await supabase
          .from('social_links')
          .insert(linksToInsert);

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

  const updateLink = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSocialLinks(newLinks);
  };

  const addLink = () => {
    setSocialLinks([
      ...socialLinks,
      { id: Date.now().toString(), platform: '', url: '', clicks: 0 },
    ]);
  };

  const removeLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">
          Social Links
        </h3>
        <Button onClick={addLink} variant="secondary" size="sm">
          Add Link
        </Button>
      </div>

      {socialLinks.map((link, index) => (
        <div key={link.id} className="flex gap-2">
          <Input
            type="text"
            value={link.platform}
            onChange={(e) => updateLink(index, 'platform', e.target.value)}
            placeholder="Platform (e.g., Instagram)"
            className="flex-1"
          />
          <Input
            type="url"
            value={link.url}
            onChange={(e) => updateLink(index, 'url', e.target.value)}
            placeholder="https://..."
            className="flex-1"
          />
          <Button
            onClick={() => removeLink(index)}
            variant="secondary"
            size="sm"
            className="px-3"
          >
            Remove
          </Button>
        </div>
      ))}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <p className="text-sm text-green-600 dark:text-green-400">
            Social links updated successfully!
          </p>
        </div>
      )}

      <Button onClick={handleSave} disabled={saving} variant="primary" className="w-full">
        {saving ? 'Saving...' : 'Save Social Links'}
      </Button>
    </div>
  );
}
