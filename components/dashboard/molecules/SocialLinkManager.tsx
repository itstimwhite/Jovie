'use client';

import React from 'react';
import { LinkManager } from './LinkManager';
import type { DetectedLink } from '@/lib/utils/platform-detection';

interface LinkItem extends DetectedLink {
  id: string;
  title: string;
  isVisible: boolean;
  order: number;
}

interface SocialLinkManagerProps {
  initialLinks?: LinkItem[];
  onLinksChange: (links: LinkItem[]) => void;
  disabled?: boolean;
  maxLinks?: number;
}

export const SocialLinkManager: React.FC<SocialLinkManagerProps> = ({
  initialLinks = [],
  onLinksChange,
  disabled = false,
  maxLinks = 10,
}) => {
  // Filter to only social platform links
  const socialLinks = initialLinks.filter(
    (link) => link.platform.category === 'social'
  );

  const handleSocialLinksChange = (links: LinkItem[]) => {
    // Ensure all links are social platform links
    const validSocialLinks = links.filter(
      (link) => link.platform.category === 'social'
    );
    onLinksChange(validSocialLinks);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3
          className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2"
          id="social-links-heading"
        >
          Social Links
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Add your social media profiles. These will appear in your social link
          bar.
        </p>
      </div>

      {/* Social Link Manager */}
      <div aria-labelledby="social-links-heading">
        <LinkManager
          initialLinks={socialLinks}
          onLinksChange={handleSocialLinksChange}
          disabled={disabled}
          maxLinks={maxLinks}
          allowedCategory="social"
          title="Social Links"
          description="Add Instagram, Twitter, YouTube channels, and other social platforms."
        />
      </div>
    </div>
  );
};
