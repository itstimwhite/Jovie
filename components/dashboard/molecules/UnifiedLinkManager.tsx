'use client';

import React, { useMemo } from 'react';
import { MAX_SOCIAL_LINKS } from '@/constants/app';
import type { DetectedLink } from '@/lib/utils/platform-detection';
import { LinkManager } from './LinkManager';

interface LinkItem extends DetectedLink {
  id: string;
  title: string;
  isVisible: boolean;
  order: number;
}

interface UnifiedLinkManagerProps {
  initialLinks?: LinkItem[];
  onLinksChange: (links: LinkItem[]) => void;
  onLinkAdded?: (links: LinkItem[]) => void;
  disabled?: boolean;
}

export const UnifiedLinkManager: React.FC<UnifiedLinkManagerProps> = ({
  initialLinks = [],
  onLinksChange,
  onLinkAdded,
  disabled = false,
}) => {
  // Separate links by category for display
  const { socialLinks, musicLinks, customLinks } = useMemo(() => {
    const social = initialLinks.filter(
      link => link.platform.category === 'social'
    );
    const music = initialLinks.filter(link => link.platform.category === 'dsp');
    const custom = initialLinks.filter(
      link => link.platform.category === 'custom'
    );

    return {
      socialLinks: social.sort((a, b) => a.order - b.order),
      musicLinks: music.sort((a, b) => a.order - b.order),
      customLinks: custom.sort((a, b) => a.order - b.order),
    };
  }, [initialLinks]);

  const handleLinksChange = (links: LinkItem[]) => {
    onLinksChange(links);
  };

  const handleLinkAdded = (links: LinkItem[]) => {
    if (onLinkAdded) {
      onLinkAdded(links);
    }
  };

  return (
    <div className='space-y-8'>
      {/* Universal Link Input */}
      <div className='bg-surface-1 border border-subtle rounded-xl p-6'>
        <div className='mb-6'>
          <h3 className='text-lg font-semibold text-primary mb-2'>
            ✨ Add Any Link
          </h3>
          <p className='text-sm text-secondary'>
            Paste any link and we&apos;ll automatically detect the platform and
            organize it for you
          </p>
        </div>

        <LinkManager
          initialLinks={initialLinks}
          onLinksChange={handleLinksChange}
          onLinkAdded={handleLinkAdded}
          disabled={disabled}
          maxLinks={MAX_SOCIAL_LINKS * 2} // Allow more links total
          allowedCategory='all'
          title=''
          description=''
        />
      </div>

      {/* Organized Link Groups */}
      {(socialLinks.length > 0 ||
        musicLinks.length > 0 ||
        customLinks.length > 0) && (
        <div className='space-y-6'>
          <div className='flex items-center gap-2'>
            <h3 className='text-lg font-semibold text-primary'>Your Links</h3>
            <span className='text-xs text-secondary bg-surface-2 px-2 py-1 rounded-full'>
              {initialLinks.length}{' '}
              {initialLinks.length === 1 ? 'link' : 'links'}
            </span>
          </div>

          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {/* Social Links Group */}
            {socialLinks.length > 0 && (
              <div className='bg-surface-1 border border-subtle rounded-lg p-4'>
                <div className='flex items-center gap-2 mb-4'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                  <h4 className='text-sm font-medium text-primary'>
                    Social ({socialLinks.length})
                  </h4>
                </div>
                <div className='space-y-2'>
                  {socialLinks.map(link => (
                    <div
                      key={link.id}
                      className='flex items-center gap-2 text-xs text-secondary'
                    >
                      <span className='w-1 h-1 bg-blue-500 rounded-full'></span>
                      {link.platform.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Music Links Group */}
            {musicLinks.length > 0 && (
              <div className='bg-surface-1 border border-subtle rounded-lg p-4'>
                <div className='flex items-center gap-2 mb-4'>
                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                  <h4 className='text-sm font-medium text-primary'>
                    Music ({musicLinks.length})
                  </h4>
                </div>
                <div className='space-y-2'>
                  {musicLinks.map(link => (
                    <div
                      key={link.id}
                      className='flex items-center gap-2 text-xs text-secondary'
                    >
                      <span className='w-1 h-1 bg-green-500 rounded-full'></span>
                      {link.platform.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Links Group */}
            {customLinks.length > 0 && (
              <div className='bg-surface-1 border border-subtle rounded-lg p-4'>
                <div className='flex items-center gap-2 mb-4'>
                  <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                  <h4 className='text-sm font-medium text-primary'>
                    Custom ({customLinks.length})
                  </h4>
                </div>
                <div className='space-y-2'>
                  {customLinks.map(link => (
                    <div
                      key={link.id}
                      className='flex items-center gap-2 text-xs text-secondary'
                    >
                      <span className='w-1 h-1 bg-purple-500 rounded-full'></span>
                      {link.title || link.platform.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
