'use client';

import React from 'react';
import { MAX_SOCIAL_LINKS } from '@/constants/app';
import type { DetectedLink } from '@/lib/utils/platform-detection';
import { LinkManager } from './LinkManager';

interface LinkItem extends DetectedLink {
  id: string;
  title: string;
  isVisible: boolean;
  order: number;
}

interface SocialLinkManagerProps {
  initialLinks?: LinkItem[];
  onLinksChange: (links: LinkItem[]) => void;
  onLinkAdded?: (links: LinkItem[]) => void; // Immediate save callback for new links
  disabled?: boolean;
}

export const SocialLinkManager: React.FC<SocialLinkManagerProps> = ({
  initialLinks = [],
  onLinksChange,
  onLinkAdded,
  disabled = false,
}) => {
  // Filter to only social platform links
  const socialLinks = initialLinks.filter(
    link => link.platform.category === 'social'
  );

  const handleSocialLinksChange = (links: LinkItem[]) => {
    // Ensure all links are social platform links
    const validSocialLinks = links.filter(
      link => link.platform.category === 'social'
    );
    onLinksChange(validSocialLinks);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h3
          className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'
          id='social-links-heading'
        >
          Social Links
        </h3>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Add your social media profiles. These will appear in your social link
          bar.
        </p>
      </div>

      {/* Social Link Manager */}
      <div aria-labelledby='social-links-heading'>
        <LinkManager
          initialLinks={socialLinks}
          onLinksChange={handleSocialLinksChange}
          onLinkAdded={onLinkAdded}
          disabled={disabled}
          maxLinks={MAX_SOCIAL_LINKS}
          allowedCategory='social'
          title='Social Links'
          description='Add Instagram, Twitter, YouTube channels, and other social platforms.'
        />
      </div>
    </div>
  );
};
