'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { SocialIcon } from '@/components/atoms/SocialIcon';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  type DetectedLink,
  detectPlatform,
} from '@/lib/utils/platform-detection';

interface UniversalLinkInputProps {
  onAdd: (link: DetectedLink) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const UniversalLinkInput: React.FC<UniversalLinkInputProps> = ({
  onAdd,
  placeholder = 'Paste any link (Spotify, Instagram, TikTok, etc.)',
  disabled = false,
}) => {
  const [url, setUrl] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Real-time platform detection
  const detectedLink = useMemo(() => {
    if (!url.trim()) return null;
    return detectPlatform(url.trim());
  }, [url]);

  // Handle URL input changes
  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value);
      // Reset custom title when URL changes
      if (customTitle && !isEditing) {
        setCustomTitle('');
      }
    },
    [customTitle, isEditing]
  );

  // Handle title editing
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCustomTitle(e.target.value);
      setIsEditing(true);
    },
    []
  );

  // Add link handler
  const handleAdd = useCallback(() => {
    if (!detectedLink || !detectedLink.isValid) return;

    const linkToAdd = {
      ...detectedLink,
      suggestedTitle: customTitle || detectedLink.suggestedTitle,
    };

    onAdd(linkToAdd);

    // Reset form
    setUrl('');
    setCustomTitle('');
    setIsEditing(false);
  }, [detectedLink, customTitle, onAdd]);

  // Handle keyboard interactions
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && detectedLink?.isValid) {
        e.preventDefault();
        handleAdd();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        // Clear the input and reset state
        setUrl('');
        setCustomTitle('');
        setIsEditing(false);
      }
    },
    [handleAdd, detectedLink, setUrl, setCustomTitle, setIsEditing]
  );

  const displayTitle = customTitle || detectedLink?.suggestedTitle || '';
  const brandColor = detectedLink?.platform.color
    ? `#${detectedLink.platform.color}`
    : '#6B7280';

  return (
    <div className='space-y-3'>
      {/* URL Input */}
      <div className='relative'>
        <label htmlFor='link-url-input' className='sr-only'>
          Enter link URL
        </label>
        <Input
          id='link-url-input'
          type='url'
          placeholder={placeholder}
          value={url}
          onChange={handleUrlChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          inputMode='url'
          autoCapitalize='none'
          autoCorrect='off'
          autoComplete='off'
          className='pr-24'
          aria-describedby={detectedLink ? 'link-detection-status' : undefined}
        />

        {/* Platform icon in input */}
        {detectedLink && (
          <div
            className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2'
            aria-hidden='true'
          >
            <div
              className='flex items-center justify-center w-6 h-6 rounded-full'
              style={{
                backgroundColor: `${brandColor}15`,
                color: brandColor,
              }}
            >
              <SocialIcon
                platform={detectedLink.platform.icon}
                className='w-3 h-3'
              />
            </div>
          </div>
        )}
      </div>

      {/* Screen reader status */}
      <div id='link-detection-status' className='sr-only' aria-live='polite'>
        {detectedLink
          ? detectedLink.isValid
            ? `${detectedLink.platform.name} link detected. You can now add a title and add this link.`
            : `Invalid ${detectedLink.platform.name} link. ${detectedLink.error || 'Please check the URL.'}`
          : url
            ? 'No valid link detected. Please enter a valid URL.'
            : ''}
      </div>

      {/* Link preview & title editing */}
      {detectedLink && (
        <div
          className='p-3 rounded-lg border transition-all duration-200'
          style={{
            borderColor: detectedLink.isValid ? `${brandColor}30` : '#ef444430',
            backgroundColor: detectedLink.isValid
              ? `${brandColor}08`
              : '#ef444408',
          }}
          role='region'
          aria-label='Link preview'
        >
          <div className='flex items-start gap-3'>
            {/* Platform icon */}
            <div
              className='flex items-center justify-center w-8 h-8 rounded-lg shrink-0 mt-0.5'
              style={{
                backgroundColor: `${brandColor}15`,
                color: brandColor,
              }}
              aria-hidden='true'
            >
              <SocialIcon
                platform={detectedLink.platform.icon}
                className='w-4 h-4'
              />
            </div>

            <div className='flex-1 min-w-0'>
              {/* Platform name and category */}
              <div className='flex items-center gap-2 mb-2'>
                <span className='font-medium text-sm text-gray-900 dark:text-gray-100'>
                  {detectedLink.platform.name}
                </span>
                <span
                  className='text-xs px-2 py-0.5 rounded-full'
                  style={{
                    backgroundColor: `${brandColor}20`,
                    color: brandColor,
                  }}
                >
                  {detectedLink.platform.category}
                </span>
              </div>

              {/* Title input */}
              <label htmlFor='link-title-input' className='sr-only'>
                Link title
              </label>
              <Input
                id='link-title-input'
                type='text'
                placeholder='Link title'
                value={displayTitle}
                onChange={handleTitleChange}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                inputMode='text'
                autoCapitalize='words'
                autoCorrect='on'
                autoComplete='off'
                className='text-sm mb-2'
                aria-required='true'
                aria-invalid={!displayTitle.trim() ? 'true' : 'false'}
              />

              {/* URL preview */}
              <div className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                {detectedLink.normalizedUrl}
              </div>

              {/* Validation error */}
              {!detectedLink.isValid && detectedLink.error && (
                <div
                  className='text-xs text-red-600 dark:text-red-400 mt-1'
                  role='alert'
                >
                  {detectedLink.error}
                </div>
              )}
            </div>

            {/* Add button */}
            <Button
              onClick={handleAdd}
              disabled={
                disabled || !detectedLink.isValid || !displayTitle.trim()
              }
              size='sm'
              style={{
                backgroundColor: detectedLink.isValid ? brandColor : undefined,
              }}
              className={!detectedLink.isValid ? 'opacity-50' : ''}
              aria-label={`Add ${displayTitle || 'link'}`}
            >
              Add
            </Button>
          </div>
        </div>
      )}

      {/* Validation hint */}
      {url && !detectedLink?.isValid && (
        <div className='text-xs text-gray-500 dark:text-gray-400' role='status'>
          💡 Paste links from Spotify, Instagram, TikTok, YouTube, and more for
          automatic detection
        </div>
      )}
    </div>
  );
};
