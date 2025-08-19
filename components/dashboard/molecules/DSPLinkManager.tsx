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

interface DSPLinkManagerProps {
  initialLinks?: LinkItem[];
  onLinksChange: (links: LinkItem[]) => void;
  disabled?: boolean;
  maxLinks?: number;
}

export const DSPLinkManager: React.FC<DSPLinkManagerProps> = ({
  initialLinks = [],
  onLinksChange,
  disabled = false,
  maxLinks = 10,
}) => {
  // Filter to only DSP platform links
  const dspLinks = initialLinks.filter(
    (link) => link.platform.category === 'dsp'
  );

  const handleDSPLinksChange = (links: LinkItem[]) => {
    // Ensure all links are DSP platform links
    const validDSPLinks = links.filter(
      (link) => link.platform.category === 'dsp'
    );
    onLinksChange(validDSPLinks);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Music Streaming Links
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Add your music streaming profiles. These will appear in listen mode,
          never in social links.
        </p>
      </div>

      {/* DSP Link Manager */}
      <LinkManager
        initialLinks={dspLinks}
        onLinksChange={handleDSPLinksChange}
        disabled={disabled}
        maxLinks={maxLinks}
        allowedCategory="dsp"
        title="DSP Links"
        description="Add Spotify, Apple Music, YouTube Music, and other streaming platforms."
      />
    </div>
  );
};
