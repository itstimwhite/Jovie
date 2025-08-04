'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/Input';
import { SocialLink } from '@/types/db';

interface SocialsFormProps {
  artistId: string;
}

export function SocialsForm({ artistId }: SocialsFormProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSocialLinks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('artist_id', artistId)
        .order('platform');

      if (error) {
        console.error('Error fetching social links:', error);
      } else {
        setSocialLinks(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [artistId]);

  useEffect(() => {
    fetchSocialLinks();
  }, [artistId, fetchSocialLinks]);

  const updateSocialLink = async (id: string, url: string) => {
    try {
      const { error } = await supabase
        .from('social_links')
        .update({ url })
        .eq('id', id);

      if (error) {
        console.error('Error updating social link:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUrlChange = async (id: string, url: string) => {
    setSaving(true);
    await updateSocialLink(id, url);
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Social Links</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-white/10 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Social Links</h3>
      <div className="space-y-3">
        {socialLinks.map((link) => (
          <div key={link.id} className="flex items-center space-x-3">
            <div className="w-24 text-sm font-medium text-white/70 capitalize">
              {link.platform}
            </div>
            <Input
              type="url"
              value={link.url || ''}
              onChange={(e) => handleUrlChange(link.id, e.target.value)}
              placeholder={`Your ${link.platform} URL`}
              className="flex-1"
            />
            {saving && <div className="text-xs text-white/50">Saving...</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
