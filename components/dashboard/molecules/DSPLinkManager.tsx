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

interface DSPLinkManagerProps {
  initialLinks?: LinkItem[];
  onLinksChange: (links: LinkItem[]) => void;
  onLinkAdded?: (links: LinkItem[]) => void; // Immediate save callback for new links
  disabled?: boolean;
}

export const DSPLinkManager: React.FC<DSPLinkManagerProps> = ({
  initialLinks = [],
  onLinksChange,
  onLinkAdded,
  disabled = false,
}) => {
  // Filter to only DSP platform links
  const dspLinks = initialLinks.filter(
    link => link.platform.category === 'dsp'
  );

  const handleDSPLinksChange = (links: LinkItem[]) => {
    // Ensure all links are DSP platform links
    const validDSPLinks = links.filter(
      link => link.platform.category === 'dsp'
    );
    onLinksChange(validDSPLinks);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>
          Music Streaming Links
        </h3>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Add your music streaming profiles. These will appear in listen mode,
          never in social links.
        </p>
      </div>

      {/* DSP Link Manager */}
      <LinkManager
        initialLinks={dspLinks}
        onLinksChange={handleDSPLinksChange}
        onLinkAdded={onLinkAdded}
        disabled={disabled}
        maxLinks={MAX_SOCIAL_LINKS}
        allowedCategory='dsp'
        title='DSP Links'
        description='Add Spotify, Apple Music, YouTube Music, and other streaming platforms.'
      />
    </div>
  );
};
