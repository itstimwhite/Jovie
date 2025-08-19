'use client';

import React, { useState, useMemo } from 'react';
import { LinkManager } from '../molecules/LinkManager';
import { StaticArtistPage } from '@/components/profile/StaticArtistPage';
import type { DetectedLink } from '@/lib/utils/platform-detection';
import type { Artist, CreatorProfile, LegacySocialLink } from '@/types/db';

interface LinkItem extends DetectedLink {
  id: string;
  title: string;
  isVisible: boolean;
  order: number;
}

interface DashboardSplitViewProps {
  artist: Artist;
  creatorProfile: CreatorProfile;
  onArtistUpdate: (updatedArtist: Artist) => void;
  disabled?: boolean;
}

export const DashboardSplitView: React.FC<DashboardSplitViewProps> = ({
  artist,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  creatorProfile: _creatorProfile, // TODO: Use for additional profile data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onArtistUpdate: _onArtistUpdate, // TODO: Implement auto-save functionality
  disabled = false,
}) => {
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [links, setLinks] = useState<LinkItem[]>([]);

  // Convert current social links to LinkItem format
  const initialLinks = useMemo(() => {
    // TODO: Convert existing social_links from database to LinkItem format
    // This would need to be populated from the existing social links
    return [];
  }, []);

  // Convert LinkItems to LegacySocialLink format for preview
  const previewSocialLinks = useMemo((): LegacySocialLink[] => {
    return links
      .filter((link) => link.isVisible)
      .map((link) => ({
        id: link.id,
        artist_id: artist.id,
        platform: link.platform.icon,
        url: link.normalizedUrl,
        clicks: 0,
        created_at: new Date().toISOString(),
      }))
      .sort((a, b) => {
        const aIndex = links.findIndex((l) => l.id === a.id);
        const bIndex = links.findIndex((l) => l.id === b.id);
        return aIndex - bIndex;
      });
  }, [links, artist.id]);

  // Create preview artist object
  const previewArtist = useMemo(
    (): Artist => ({
      ...artist,
      // Apply any real-time changes here
    }),
    [artist]
  );

  // Handle link changes
  const handleLinksChange = (newLinks: LinkItem[]) => {
    setLinks(newLinks);
    // TODO: Auto-save to database here
    // This should trigger an API call to save the links
  };

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Mobile View Toggle */}
      <div className="lg:hidden flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6">
        <button
          onClick={() => setViewMode('edit')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
            viewMode === 'edit'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Edit
        </button>
        <button
          onClick={() => setViewMode('preview')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
            viewMode === 'preview'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Preview
        </button>
      </div>

      {/* Edit Panel */}
      <div
        className={`
        lg:w-1/2 lg:pr-8 
        ${viewMode === 'edit' ? 'block' : 'hidden lg:block'}
      `}
      >
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Manage Links
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add and organize your social media and streaming links. Changes
              save automatically.
            </p>
          </div>

          {/* Link Manager */}
          <LinkManager
            initialLinks={initialLinks}
            onLinksChange={handleLinksChange}
            disabled={disabled}
            maxLinks={20}
          />
        </div>
      </div>

      {/* Preview Panel */}
      <div
        className={`
        lg:w-1/2 lg:pl-8 lg:border-l lg:border-gray-200 lg:dark:border-gray-700
        ${viewMode === 'preview' ? 'block' : 'hidden lg:block'}
      `}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Live Preview
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live
            </div>
          </div>

          {/* Preview Container */}
          <div className="relative">
            {/* Mobile Frame */}
            <div className="max-w-sm mx-auto bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] p-2">
              <div className="bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden">
                {/* Status Bar Mockup */}
                <div className="bg-gray-100 dark:bg-gray-700 h-6 flex items-center justify-center">
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Preview Mode
                  </div>
                </div>

                {/* Profile Preview */}
                <div className="h-[600px] overflow-y-auto">
                  <StaticArtistPage
                    mode="default"
                    artist={previewArtist}
                    socialLinks={previewSocialLinks}
                    subtitle=""
                    showTipButton={false}
                    showBackButton={false}
                  />
                </div>
              </div>
            </div>

            {/* Update Indicator */}
            <div className="absolute top-4 right-4 opacity-0 transition-opacity duration-300 data-[show=true]:opacity-100">
              <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                Updated
              </div>
            </div>
          </div>

          {/* Preview Info */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This is how your profile will appear to visitors
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
