'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthenticatedSupabase } from '@/lib/supabase';
import { Artist, convertCreatorProfileToArtist } from '@/types/db';
import Image from 'next/image';
import AvatarUploader from '@/components/dashboard/molecules/AvatarUploader';
import { flags } from '@/lib/env';

interface ProfileFormProps {
  artist: Artist;
  onUpdate: (artist: Artist) => void;
}

export function ProfileForm({ artist, onUpdate }: ProfileFormProps) {
  const { getAuthenticatedClient } = useAuthenticatedSupabase();
  const { has } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);

  // Check if user has the remove_branding feature
  const hasRemoveBrandingFeature =
    has?.({ feature: 'remove_branding' }) ?? false;

  const [formData, setFormData] = useState({
    name: artist.name || '',
    tagline: artist.tagline || '',
    image_url: artist.image_url || '',
    hide_branding: artist.settings?.hide_branding ?? false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    setSuccess(false);

    try {
      // Get authenticated Supabase client using native integration
      const supabase = getAuthenticatedClient();

      if (!supabase) {
        setError('Database connection failed. Please try again later.');
        return;
      }

      const { data, error } = await supabase
        .from('creator_profiles')
        .update({
          display_name: formData.name,
          bio: formData.tagline,
          avatar_url: formData.image_url || null,
          // Note: settings field doesn't exist in creator_profiles schema
          // hide_branding could be added later if needed
        })
        .eq('id', artist.id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        setError('Failed to update profile');
      } else {
        // Convert CreatorProfile back to Artist format for the callback
        const updatedArtist = convertCreatorProfileToArtist(data);
        onUpdate(updatedArtist);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Avatar uploader (feature-flagged) */}
      {flags.feature_image_cdn_cloudinary && (
        <FormField label="Profile Image" error={error}>
          <div className="flex items-center gap-4">
            {formData.image_url ? (
              <Image
                src={formData.image_url}
                alt="Current avatar"
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            )}
            <div className="flex-1">
              <AvatarUploader
                onUploaded={(res) => {
                  // For now, persist the secure_url into avatar_url
                  setFormData((f) => ({ ...f, image_url: res.secure_url }));
                }}
                folder="avatars"
              />
            </div>
          </div>
        </FormField>
      )}
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

      {/* Branding Toggle - only show if user has the feature */}
      {hasRemoveBrandingFeature && (
        <FormField label="Branding" error={error}>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Show Jovie branding
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Display Jovie branding on your profile
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  hide_branding: !formData.hide_branding,
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                formData.hide_branding
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : 'bg-indigo-600'
              }`}
              disabled={loading}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.hide_branding ? 'translate-x-1' : 'translate-x-6'
                }`}
              />
            </button>
          </div>
        </FormField>
      )}

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
