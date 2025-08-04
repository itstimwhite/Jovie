'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/ui/FormField';
import { Form } from '@/components/ui/Form';
import { DataCard } from '@/components/ui/DataCard';
import { useFormState } from '@/lib/hooks/useFormState';
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
  const { loading, error, success, handleAsync, setError } = useFormState();
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

    await handleAsync(async () => {
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
    });
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
          <Form 
            onSubmit={handleAddLink} 
            loading={loading} 
            error={error} 
            success={success}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Platform" required>
                <Select
                  options={SOCIAL_PLATFORMS.map(platform => ({
                    value: platform,
                    label: platform.charAt(0).toUpperCase() + platform.slice(1)
                  }))}
                  placeholder="Select platform"
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="URL" required>
                <Input
                  placeholder="https://..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  type="url"
                  required
                />
              </FormField>
            </div>

            <Button type="submit" disabled={loading || !newPlatform || !newUrl}>
              {loading ? 'Adding...' : 'Add Link'}
            </Button>
          </Form>
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
                <DataCard
                  key={link.id}
                  title={link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                  subtitle={link.url}
                  metadata={`${link.clicks} clicks`}
                  actions={
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDeleteLink(link.id)}
                    >
                      Delete
                    </Button>
                  }
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
