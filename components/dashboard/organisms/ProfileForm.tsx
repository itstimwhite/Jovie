'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthenticatedSupabase } from '@/lib/supabase';
import { Artist, convertCreatorProfileToArtist } from '@/types/db';
import Image from 'next/image';
import AvatarUploader from '@/components/dashboard/molecules/AvatarUploader';
import { ErrorSummary } from '@/components/ui/ErrorSummary';
import { flags } from '@/lib/env';
import { validateInstagramHandle } from '@/lib/instagram-utils';

interface ProfileFormProps {
  artist: Artist;
  onUpdate: (artist: Artist) => void;
}

export function ProfileForm({ artist, onUpdate }: ProfileFormProps) {
  const { getAuthenticatedClient } = useAuthenticatedSupabase();
  const { has } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Check if user has the remove_branding feature
  const hasRemoveBrandingFeature =
    has?.({ feature: 'remove_branding' }) ?? false;

  const [formData, setFormData] = useState({
    name: artist.name || '',
    tagline: artist.tagline || '',
    image_url: artist.image_url || '',
    instagram_handle: artist.instagram_handle || '',
    hide_branding: artist.settings?.hide_branding ?? false,
  });

  // Validate form data
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Artist name is required';
    } else if (formData.name.length > 50) {
      errors.name = 'Artist name must be less than 50 characters';
    }

    if (formData.tagline.length > 160) {
      errors.tagline = 'Tagline must be less than 160 characters';
    }

    // Validate Instagram handle if provided
    if (formData.instagram_handle.trim()) {
      const instagramValidation = validateInstagramHandle(formData.instagram_handle);
      if (!instagramValidation.isValid) {
        errors.instagram_handle = instagramValidation.error || 'Invalid Instagram handle';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    // Validate form
    if (!validateForm()) {
      // Focus the first field with an error
      if (validationErrors.name && nameInputRef.current) {
        nameInputRef.current.focus();
      }
      return;
    }

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

      // Check if we should trigger Instagram avatar import
      const shouldImportInstagramAvatar = 
        formData.instagram_handle.trim() && 
        !formData.image_url && 
        flags.feature_image_cdn_cloudinary &&
        flags.feature_instagram_avatar_import;
      
      // Prepare update data
      const updateData = {
        display_name: formData.name,
        bio: formData.tagline,
        instagram_handle: formData.instagram_handle.trim() || null,
        avatar_url: formData.image_url || null,
        // Note: settings field doesn't exist in creator_profiles schema
        // hide_branding could be added later if needed
      };
      
      const { data, error } = await supabase
        .from('creator_profiles')
        .update(updateData)
        .eq('id', artist.id)
        .select('*')
        .single();
        
      // If we should import Instagram avatar, trigger the import
      if (shouldImportInstagramAvatar && data) {
        try {
          // Call the Instagram avatar import API
          const importResponse = await fetch('/api/instagram/avatar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ instagramHandle: formData.instagram_handle }),
          });
          
          if (importResponse.ok) {
            const importResult = await importResponse.json();
            if (importResult.success && importResult.avatarUrl) {
              // Update the form data with the new avatar URL
              setFormData(prev => ({ ...prev, image_url: importResult.avatarUrl }));
              
              // Update the data object with the new avatar URL
              data.avatar_url = importResult.avatarUrl;
            }
          }
        } catch (importError) {
          // Log error but don't fail the profile update
          console.error('Instagram avatar import error:', importError);
        }
      }

      if (error) {
        console.error('Error updating profile:', error);
        setError('Failed to update profile');
      } else {
        // Convert CreatorProfile back to Artist format for the callback
        const updatedArtist = convertCreatorProfileToArtist(data);
        onUpdate(updatedArtist);
        setSuccess(true);

        // Announce success to screen readers
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
          successMessage.textContent = 'Profile updated successfully!';
        }

        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Collect all form errors for the error summary
  const formErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    // Include validation errors
    Object.entries(validationErrors).forEach(([key, value]) => {
      errors[key] = value;
    });

    // Include API error if present
    if (error) {
      errors.form = error;
    }

    return errors;
  }, [validationErrors, error]);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-4"
      noValidate
    >
      {/* Screen reader announcements */}
      <div
        className="sr-only"
        aria-live="assertive"
        aria-atomic="true"
        id="success-message"
      ></div>

      {/* Error summary for screen readers */}
      <ErrorSummary
        errors={formErrors}
        onFocusField={(fieldName) => {
          if (fieldName === 'name' && nameInputRef.current) {
            nameInputRef.current.focus();
          }
        }}
      />

      {/* Avatar uploader (feature-flagged) */}
      {flags.feature_image_cdn_cloudinary && (
        <FormField
          label="Profile Image"
          helpText="Upload a profile picture to personalize your profile"
        >
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
              <div
                className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800"
                aria-label="No profile image"
              />
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

      <FormField
        label="Artist Name"
        error={formSubmitted ? validationErrors.name : undefined}
        helpText="Your name as it will appear on your profile"
        id="artist-name"
        required
      >
        <Input
          ref={nameInputRef}
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Your Artist Name"
          required
          autoCapitalize="words"
          autoCorrect="on"
          autoComplete="name"
          validationState={
            formSubmitted && validationErrors.name ? 'invalid' : null
          }
        />
      </FormField>

      <FormField
        label="Tagline"
        error={formSubmitted ? validationErrors.tagline : undefined}
        helpText="A brief description that appears under your name (max 160 characters)"
        id="artist-tagline"
      >
        <Input
          type="text"
          value={formData.tagline}
          onChange={(e) =>
            setFormData({ ...formData, tagline: e.target.value })
          }
          placeholder="Share your story, music journey, or what inspires you..."
          autoCapitalize="sentences"
          autoCorrect="on"
          autoComplete="off"
          validationState={
            formSubmitted && validationErrors.tagline ? 'invalid' : null
          }
        />
      </FormField>
      
      <FormField
        label="Instagram Handle"
        error={formSubmitted ? validationErrors.instagram_handle : undefined}
        helpText={formData.image_url ? "Your Instagram handle" : "Your Instagram handle (we'll import your profile picture if you don't have one)"}
        id="instagram-handle"
      >
        <Input
          type="text"
          value={formData.instagram_handle}
          onChange={(e) =>
            setFormData({ ...formData, instagram_handle: e.target.value })
          }
          placeholder="@username or instagram.com/username"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          validationState={
            formSubmitted && validationErrors.instagram_handle ? 'invalid' : null
          }
        />
      </FormField>

      {/* Branding Toggle - only show if user has the feature */}
      {hasRemoveBrandingFeature && (
        <FormField
          label="Branding"
          helpText="Control whether Jovie branding appears on your profile"
          id="branding-toggle"
        >
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
              aria-pressed={!formData.hide_branding}
              aria-label={
                formData.hide_branding
                  ? 'Enable Jovie branding'
                  : 'Disable Jovie branding'
              }
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.hide_branding ? 'translate-x-1' : 'translate-x-6'
                }`}
                aria-hidden="true"
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
        aria-busy={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <span
              className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
              aria-hidden="true"
            ></span>
            <span>Updating...</span>
          </div>
        ) : (
          'Update Profile'
        )}
      </Button>

      {success && (
        <div
          className="bg-green-500/10 border border-green-500/20 rounded-lg p-3"
          role="status"
          aria-live="polite"
        >
          <p className="text-sm text-green-600 dark:text-green-400">
            Profile updated successfully!
          </p>
        </div>
      )}
    </form>
  );
}
