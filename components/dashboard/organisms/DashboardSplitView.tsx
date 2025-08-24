'use client';

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { useSession } from '@clerk/nextjs';
import { SocialLinkManager } from '../molecules/SocialLinkManager';
import { DSPLinkManager } from '../molecules/DSPLinkManager';
import { StaticArtistPage } from '@/components/profile/StaticArtistPage';
import type { DetectedLink } from '@/lib/utils/platform-detection';
import type {
  Artist,
  CreatorProfile,
  LegacySocialLink,
  SocialLink,
  SocialPlatform,
} from '@/types/db';
import { createClerkSupabaseClient } from '@/lib/supabase';
import { debounce } from '@/lib/utils';

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

interface SaveStatus {
  saving: boolean;
  success: boolean | null;
  error: string | null;
  lastSaved: Date | null;
}

export const DashboardSplitView: React.FC<DashboardSplitViewProps> = ({
  artist,
  creatorProfile, // eslint-disable-line @typescript-eslint/no-unused-vars
  onArtistUpdate,
  disabled = false,
}) => {
  const { session } = useSession();
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [socialLinks, setSocialLinks] = useState<LinkItem[]>([]);
  const [dspLinks, setDSPLinks] = useState<LinkItem[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({
    saving: false,
    success: null,
    error: null,
    lastSaved: null,
  });
  const updateIndicatorRef = useRef<HTMLDivElement>(null);

  // Convert database social links to LinkItem format
  const convertDbLinksToLinkItems = (
    dbLinks: SocialLink[] | LegacySocialLink[] = []
  ): LinkItem[] => {
    return dbLinks.map((link, index) => {
      // Determine platform category based on platform name
      const platformCategory = [
        'spotify',
        'apple_music',
        'youtube_music',
        'soundcloud',
        'bandcamp',
        'tidal',
        'deezer',
      ].includes(link.platform)
        ? 'dsp'
        : 'social';

      return {
        id: link.id,
        title: link.platform,
        platform: {
          id: link.platform,
          name: link.platform,
          category: platformCategory,
          icon: link.platform,
          color: '#000000',
          placeholder: link.url,
        },
        normalizedUrl: link.url,
        originalUrl: link.url,
        suggestedTitle: link.platform,
        isValid: true,
        isVisible: true,
        order: index,
      };
    });
  };

  // Convert LinkItems to database format
  const convertLinkItemsToDbFormat = (
    linkItems: LinkItem[],
    creatorProfileId: string
  ): Partial<SocialLink>[] => {
    return linkItems
      .filter((link) => link.isVisible)
      .map((link, index) => ({
        creator_profile_id: creatorProfileId,
        platform: link.platform.id,
        platform_type: link.platform.id as SocialPlatform,
        url: link.normalizedUrl,
        sort_order: index,
        is_active: true,
      }));
  };

  // Initialize links from database
  useEffect(() => {
    const fetchLinks = async () => {
      if (!session || !artist.id) return;

      try {
        const supabase = createClerkSupabaseClient(session);
        if (!supabase) return;

        const { data: socialLinksData, error: socialLinksError } =
          await supabase
            .from('social_links')
            .select('*')
            .eq('creator_profile_id', artist.id);

        if (socialLinksError) {
          console.error('Error fetching social links:', socialLinksError);
          return;
        }

        // Split links into social and DSP categories
        const socialLinksItems: LinkItem[] = [];
        const dspLinksItems: LinkItem[] = [];

        const allLinks = convertDbLinksToLinkItems(socialLinksData || []);

        allLinks.forEach((link) => {
          if (link.platform.category === 'dsp') {
            dspLinksItems.push(link);
          } else {
            socialLinksItems.push(link);
          }
        });

        setSocialLinks(socialLinksItems);
        setDSPLinks(dspLinksItems);
      } catch (error) {
        console.error('Error initializing links:', error);
      }
    };

    fetchLinks();
  }, [session, artist.id]);

  // Convert current links to LinkItem format (split by category)
  const { initialSocialLinks, initialDSPLinks } = useMemo(() => {
    return {
      initialSocialLinks: socialLinks,
      initialDSPLinks: dspLinks,
    };
  }, [socialLinks, dspLinks]);

  // Convert social LinkItems to LegacySocialLink format for preview
  const previewSocialLinks = useMemo((): LegacySocialLink[] => {
    return socialLinks
      .filter((link) => link.isVisible && link.platform.category === 'social')
      .map((link) => ({
        id: link.id,
        artist_id: artist.id, // LegacySocialLink still uses artist_id for backwards compatibility
        platform: link.platform.icon,
        url: link.normalizedUrl,
        clicks: 0,
        created_at: new Date().toISOString(),
      }))
      .sort((a, b) => {
        const aIndex = socialLinks.findIndex((l) => l.id === a.id);
        const bIndex = socialLinks.findIndex((l) => l.id === b.id);
        return aIndex - bIndex;
      });
  }, [socialLinks, artist.id]);

  // Create preview artist object
  const previewArtist = useMemo(
    (): Artist => ({
      ...artist,
      // Apply any real-time changes here
    }),
    [artist]
  );

  // Show update indicator
  const showUpdateIndicator = useCallback((success: boolean) => {
    if (updateIndicatorRef.current) {
      updateIndicatorRef.current.dataset.show = 'true';
      updateIndicatorRef.current.innerHTML = success
        ? '<div class="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">Updated</div>'
        : '<div class="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">Error</div>';

      setTimeout(() => {
        if (updateIndicatorRef.current) {
          updateIndicatorRef.current.dataset.show = 'false';
        }
      }, 2000);
    }
  }, []);

  // Save links to database
  const saveLinks = useCallback(
    async (socialLinksToSave: LinkItem[], dspLinksToSave: LinkItem[]) => {
      if (!session || !artist.id) return;

      setSaveStatus((prev) => ({
        ...prev,
        saving: true,
        success: null,
        error: null,
      }));

      try {
        const supabase = createClerkSupabaseClient(session);
        if (!supabase) {
          throw new Error('Failed to create Supabase client');
        }

        // Convert links to database format
        const allLinks = [
          ...convertLinkItemsToDbFormat(socialLinksToSave, artist.id),
          ...convertLinkItemsToDbFormat(dspLinksToSave, artist.id),
        ];

        // Delete existing links
        const { error: deleteError } = await supabase
          .from('social_links')
          .delete()
          .eq('creator_profile_id', artist.id);

        if (deleteError) {
          throw new Error(
            `Failed to delete existing links: ${deleteError.message}`
          );
        }

        // Insert new links
        if (allLinks.length > 0) {
          const { error: insertError } = await supabase
            .from('social_links')
            .insert(allLinks);

          if (insertError) {
            throw new Error(`Failed to insert links: ${insertError.message}`);
          }
        }

        // Update artist record with timestamp
        const updatedArtist = {
          ...artist,
          updated_at: new Date().toISOString(),
        };

        onArtistUpdate(updatedArtist);

        setSaveStatus({
          saving: false,
          success: true,
          error: null,
          lastSaved: new Date(),
        });

        showUpdateIndicator(true);
      } catch (error) {
        console.error('Error saving links:', error);
        setSaveStatus({
          saving: false,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          lastSaved: null,
        });

        showUpdateIndicator(false);

        // Retry after a delay if it's a network error
        if (error instanceof Error && error.message.includes('network')) {
          setTimeout(() => {
            saveLinks(socialLinksToSave, dspLinksToSave);
          }, 5000);
        }
      }
    },
    [session, artist, onArtistUpdate, showUpdateIndicator]
  );

  // Debounced save function
  const debouncedSave = useMemo(() => {
    const fn = (socialLinks: LinkItem[], dspLinks: LinkItem[]) => {
      saveLinks(socialLinks, dspLinks);
    };
    return debounce(fn as (...args: unknown[]) => void, 800);
  }, [saveLinks]);

  // Handle social link changes
  const handleSocialLinksChange = (newLinks: LinkItem[]) => {
    setSocialLinks(newLinks);
    debouncedSave(newLinks, dspLinks);
  };

  // Handle DSP link changes
  const handleDSPLinksChange = (newLinks: LinkItem[]) => {
    setDSPLinks(newLinks);
    debouncedSave(socialLinks, newLinks);
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
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Manage Your Links
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Organize your social media and music streaming links. Changes save
              automatically.
              {saveStatus.lastSaved && (
                <span className="ml-2 text-xs text-gray-400">
                  Last saved: {saveStatus.lastSaved.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>

          {/* Social Links Manager */}
          <SocialLinkManager
            initialLinks={initialSocialLinks}
            onLinksChange={handleSocialLinksChange}
            disabled={disabled || saveStatus.saving}
            maxLinks={10}
          />

          {/* Separator */}
          <div className="border-t border-gray-200 dark:border-gray-700" />

          {/* DSP Links Manager */}
          <DSPLinkManager
            initialLinks={initialDSPLinks}
            onLinksChange={handleDSPLinksChange}
            disabled={disabled || saveStatus.saving}
            maxLinks={10}
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
            <div
              ref={updateIndicatorRef}
              className="absolute top-4 right-4 opacity-0 transition-opacity duration-300 data-[show=true]:opacity-100"
            >
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
