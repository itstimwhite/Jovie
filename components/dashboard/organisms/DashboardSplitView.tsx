'use client';

import { useSession } from '@clerk/nextjs';
import { CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StaticArtistPage } from '@/components/profile/StaticArtistPage';
import { debounce } from '@/lib/utils';
import type { DetectedLink } from '@/lib/utils/platform-detection';
import type {
  Artist,
  CreatorProfile,
  LegacySocialLink,
  SocialLink,
  SocialPlatform,
} from '@/types/db';
import { DSPLinkManager } from '../molecules/DSPLinkManager';
import { SocialLinkManager } from '../molecules/SocialLinkManager';

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
  const [copySuccess, setCopySuccess] = useState(false);
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
  ) => {
    return linkItems
      .filter(link => link.isVisible)
      .map((link, index) => ({
        creatorProfileId: creatorProfileId,
        platform: link.platform.id,
        platformType: link.platform.id as SocialPlatform,
        url: link.normalizedUrl,
        sortOrder: index,
        isActive: true,
      }));
  };

  // Initialize links from database
  useEffect(() => {
    const fetchLinks = async () => {
      if (!session || !artist.id) return;

      try {
        const res = await fetch(
          `/api/dashboard/social-links?profileId=${encodeURIComponent(artist.id)}`,
          { cache: 'no-store' }
        );
        if (!res.ok) throw new Error(`Failed to fetch links (${res.status})`);
        const json: { links: SocialLink[] } = await res.json();

        // Split links into social and DSP categories
        const socialLinksItems: LinkItem[] = [];
        const dspLinksItems: LinkItem[] = [];

        const allLinks = convertDbLinksToLinkItems(json.links || []);

        allLinks.forEach(link => {
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
      .filter(link => link.isVisible && link.platform.category === 'social')
      .map(link => ({
        id: link.id,
        artist_id: artist.id, // LegacySocialLink still uses artist_id for backwards compatibility
        platform: link.platform.icon,
        url: link.normalizedUrl,
        clicks: 0,
        created_at: new Date().toISOString(),
      }))
      .sort((a, b) => {
        const aIndex = socialLinks.findIndex(l => l.id === a.id);
        const bIndex = socialLinks.findIndex(l => l.id === b.id);
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

      setSaveStatus(prev => ({
        ...prev,
        saving: true,
        success: null,
        error: null,
      }));

      try {
        // Convert links to database format for API payload
        const allLinks = [
          ...convertLinkItemsToDbFormat(socialLinksToSave, artist.id),
          ...convertLinkItemsToDbFormat(dspLinksToSave, artist.id),
        ];

        const res = await fetch('/api/dashboard/social-links', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileId: artist.id, links: allLinks }),
        });
        if (!res.ok) {
          const err = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(`Failed to save links: ${err?.error ?? res.status}`);
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

  // Handle copy to clipboard
  const handleCopyUrl = useCallback(async () => {
    const profileUrl = `https://jov.ie/${artist.username || 'username'}`;

    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = profileUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  }, [artist.username]);

  return (
    <>
      {/* Main Edit Panel */}
      <div className='xl:pr-96'>
        {/* Mobile View Toggle */}
        <div className='xl:hidden flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6'>
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

        {/* Edit Content */}
        <div className={`${viewMode === 'edit' ? 'block' : 'hidden xl:block'}`}>
          <div className='space-y-8 pb-20'>
            {/* Header */}
            <div>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                Manage Your Links
              </h2>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Organize your social media and music streaming links. Changes
                save automatically.
                {saveStatus.lastSaved && (
                  <span className='ml-2 text-xs text-gray-400'>
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
            <div className='border-t border-gray-200 dark:border-gray-700' />

            {/* DSP Links Manager */}
            <DSPLinkManager
              initialLinks={initialDSPLinks}
              onLinksChange={handleDSPLinksChange}
              disabled={disabled || saveStatus.saving}
              maxLinks={10}
            />
          </div>
        </div>
      </div>

      {/* Preview Panel - Fixed aside on XL screens */}
      <aside
        className={`
          fixed inset-y-0 right-0 w-96 overflow-y-auto border-l border-gray-200 dark:border-white/10 px-4 py-6 sm:px-6 lg:px-8
          ${viewMode === 'preview' ? 'block xl:block' : 'hidden xl:block'}
        `}
      >
        <div className='space-y-6'>
          {/* Header */}
          <div className='flex items-center gap-3'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
              Live Preview
            </h2>
            <div className='flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400'>
              <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
              Live
            </div>
          </div>

          {/* Preview Container */}
          <div className='relative'>
            {/* Mobile Frame - iPhone-like dimensions */}
            <div className='max-w-[375px] mx-auto bg-gray-900 dark:bg-gray-800 rounded-[2.5rem] p-2 shadow-2xl'>
              <div className='bg-white dark:bg-gray-900 rounded-[2.3rem] overflow-hidden'>
                {/* Status Bar Mockup */}
                <div className='bg-gray-100 dark:bg-gray-800 h-7 flex items-center justify-between px-6'>
                  <span className='text-[10px] font-medium text-gray-900 dark:text-gray-100'>
                    9:41
                  </span>
                  <div className='flex items-center gap-1'>
                    <div className='w-4 h-3 border border-gray-900 dark:border-gray-100 rounded-sm'>
                      <div className='w-full h-full bg-gray-900 dark:bg-gray-100 rounded-sm scale-x-75 origin-left'></div>
                    </div>
                  </div>
                </div>

                {/* Profile Preview - Fixed height to fit phone */}
                <div className='h-[650px] overflow-y-auto bg-white dark:bg-gray-900'>
                  <StaticArtistPage
                    mode='default'
                    artist={previewArtist}
                    socialLinks={previewSocialLinks}
                    subtitle=''
                    showTipButton={false}
                    showBackButton={false}
                  />
                </div>
              </div>
            </div>

            {/* Update Indicator */}
            <div
              ref={updateIndicatorRef}
              className='absolute top-4 right-4 opacity-0 transition-opacity duration-300 data-[show=true]:opacity-100'
            >
              <div className='bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium'>
                Updated
              </div>
            </div>
          </div>

          {/* Preview Info */}
          <div className='text-center space-y-3'>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              This is how your profile will appear to visitors
            </p>

            {/* Profile URL and View Link */}
            <div className='space-y-2'>
              <div className='flex items-center justify-center gap-2'>
                <code className='text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-300'>
                  jov.ie/{artist.username || 'username'}
                </code>
                <button
                  onClick={handleCopyUrl}
                  className='p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group'
                  title={copySuccess ? 'Copied!' : 'Copy profile URL'}
                >
                  {copySuccess ? (
                    <CheckIcon className='w-3 h-3 text-green-600 dark:text-green-400' />
                  ) : (
                    <ClipboardIcon className='w-3 h-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300' />
                  )}
                </button>
              </div>
              <a
                href={`/${artist.username}`}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors'
              >
                View Profile
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
