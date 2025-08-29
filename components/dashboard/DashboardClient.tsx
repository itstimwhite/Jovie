'use client';

import {
  ChartPieIcon,
  Cog6ToothIcon,
  HomeIcon,
  LinkIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { PendingClaimRunner } from '@/components/bridge/PendingClaimRunner';
import { OnboardingForm } from '@/components/dashboard';
import { DashboardPageHeader } from '@/components/dashboard/atoms/DashboardPageHeader';
import { AnalyticsCards } from '@/components/dashboard/molecules/AnalyticsCards';
import { DashboardCardWithHeader } from '@/components/dashboard/molecules/DashboardCardWithHeader';
import { EnhancedThemeToggle } from '@/components/dashboard/molecules/EnhancedThemeToggle';
import { DashboardLayout } from '@/components/dashboard/organisms/DashboardLayout';
import { DashboardSplitView } from '@/components/dashboard/organisms/DashboardSplitView';
import { QuickActionsGrid } from '@/components/dashboard/organisms/QuickActionsGrid';
import { SettingsPolished } from '@/components/dashboard/organisms/SettingsPolished';
import { APP_NAME, APP_URL } from '@/constants/app';
import type { CreatorProfile } from '@/lib/db/schema';
import { Artist, convertDrizzleCreatorProfileToArtist } from '@/types/db';
import { PendingClaimHandler } from './PendingClaimHandler';

const navigation = [
  {
    name: 'Overview',
    id: 'overview',
    icon: HomeIcon,
  },
  {
    name: 'Links',
    id: 'links',
    icon: LinkIcon,
  },
  {
    name: 'Analytics',
    id: 'analytics',
    icon: ChartPieIcon,
  },
  {
    name: 'Audience',
    id: 'audience',
    icon: UsersIcon,
  },
  {
    name: 'Settings',
    id: 'settings',
    icon: Cog6ToothIcon,
  },
];

interface DashboardClientProps {
  initialData: {
    user: { id: string } | null;
    creatorProfiles: CreatorProfile[];
    selectedProfile: CreatorProfile | null;
    needsOnboarding: boolean;
  };
}

export function DashboardClient({ initialData }: DashboardClientProps) {
  const [currentNavItem, setCurrentNavItem] = useState('overview');
  const [artist, setArtist] = useState<Artist | null>(
    initialData.selectedProfile
      ? convertDrizzleCreatorProfileToArtist(initialData.selectedProfile)
      : null
  );
  const [creatorProfiles] = useState<CreatorProfile[]>(
    initialData.creatorProfiles
  );
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    initialData.selectedProfile?.id || null
  );

  const handleArtistUpdated = (updatedArtist: Artist) => {
    setArtist(updatedArtist);
  };

  // Handle profile selection when user has multiple creator profiles
  const handleProfileSelection = (profileId: string) => {
    const selectedProfile = creatorProfiles.find(p => p.id === profileId);
    if (selectedProfile) {
      setSelectedProfileId(profileId);
      const artistData = convertDrizzleCreatorProfileToArtist(selectedProfile);
      setArtist(artistData);
    }
  };

  const handleNavigation = (navId: string) => {
    setCurrentNavItem(navId);
  };

  if (initialData.needsOnboarding) {
    return (
      <div className='min-h-screen bg-base transition-colors'>
        {/* Subtle grid background pattern */}
        <div className='absolute inset-0 grid-bg dark:grid-bg-dark' />

        {/* Gradient orbs - more subtle like Linear */}
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl' />
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl' />

        {/* Theme Toggle */}
        <div className='absolute top-4 right-4 z-20'>
          <EnhancedThemeToggle />
        </div>

        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex min-h-screen items-center justify-center py-8'>
            <div className='w-full max-w-md'>
              {/* Header */}
              <div className='text-center mb-6'>
                <h1 className='text-3xl font-semibold text-primary-token mb-1 transition-colors'>
                  Welcome to {APP_NAME}
                </h1>
                <p className='text-secondary-token transition-colors'>
                  Claim your handle to launch your artist profile
                </p>
              </div>

              {/* Form Card */}
              <div className='bg-surface-1 backdrop-blur-sm border border-subtle rounded-xl p-6 shadow-xl transition-colors'>
                <OnboardingForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return null; // This shouldn't happen given the server-side logic
  }

  return (
    <>
      <PendingClaimRunner />
      <PendingClaimHandler />

      <DashboardLayout
        navigation={navigation}
        currentNavItem={currentNavItem}
        onNavigate={handleNavigation}
        artist={artist}
        creatorProfiles={creatorProfiles}
        selectedProfileId={selectedProfileId}
        onProfileSelection={handleProfileSelection}
      >
        {/* Main content area */}
        {currentNavItem === 'overview' && artist && (
          <>
            <DashboardPageHeader
              title={`Welcome back, ${artist.name || artist.handle}!`}
              subtitle="Here's what's happening with your profile"
            />

            {/* Quick Actions Grid */}
            <QuickActionsGrid onNavigate={handleNavigation} className='mb-8' />

            {/* Quick Stats */}
            <div className='mt-8'>
              <h3 className='text-lg font-medium text-primary mb-4'>
                Quick Stats
              </h3>
              <AnalyticsCards profileUrl={`${APP_URL}/${artist.handle}`} />
            </div>

            {/* Recent Activity Card */}
            <div className='mt-8'>
              <DashboardCardWithHeader
                title='Recent Activity'
                cardVariant='default'
              >
                <div className='space-y-3'>
                  <div className='flex items-center gap-3 p-3 rounded-lg bg-surface-2'>
                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-primary'>
                        Profile updated
                      </p>
                      <p className='text-xs text-secondary'>2 hours ago</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3 p-3 rounded-lg bg-surface-2/30'>
                    <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-primary'>
                        New link added
                      </p>
                      <p className='text-xs text-secondary'>1 day ago</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3 p-3 rounded-lg bg-surface-2/30'>
                    <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-primary'>
                        Analytics milestone reached
                      </p>
                      <p className='text-xs text-secondary'>3 days ago</p>
                    </div>
                  </div>
                </div>
              </DashboardCardWithHeader>
            </div>
          </>
        )}

        {currentNavItem === 'links' && (
          <>
            <DashboardPageHeader
              title='Links'
              subtitle='Manage your social and streaming platform links'
            />

            {/* Use the full DashboardSplitView for universal inputs and live preview */}
            <DashboardSplitView
              artist={artist}
              onArtistUpdate={handleArtistUpdated}
            />
          </>
        )}

        {currentNavItem === 'analytics' && (
          <div className='space-y-6 relative z-10'>
            <DashboardPageHeader
              title='Analytics'
              subtitle='Track your profile performance and link engagement'
            />

            {/* Analytics Cards */}
            <AnalyticsCards profileUrl={`${APP_URL}/${artist.handle}`} />

            {/* Additional analytics info */}
            <div className='mt-8'>
              <DashboardCardWithHeader
                title='Coming Soon'
                cardVariant='default'
              >
                <p className='text-sm text-secondary'>
                  Detailed analytics with charts, traffic sources, and
                  demographic insights will be available soon.
                </p>
              </DashboardCardWithHeader>
            </div>
          </div>
        )}

        {currentNavItem === 'audience' && (
          <div className='space-y-6 relative z-10'>
            <DashboardPageHeader
              title='Audience'
              subtitle='Understand your fanbase demographics and engagement patterns'
            />

            {/* Audience Overview Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 relative z-10'>
              <div className='bg-surface-1 backdrop-blur-sm rounded-lg border border-subtle p-4 hover:shadow-lg hover:border-accent/20 transition-all duration-300'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-secondary'>
                      Total Followers
                    </p>
                    <p className='text-2xl font-bold text-primary'>1,247</p>
                  </div>
                  <UsersIcon className='h-8 w-8 text-accent-token' />
                </div>
                <p className='text-xs text-green-600 dark:text-green-400 mt-2'>
                  +12% from last month
                </p>
              </div>

              <div className='bg-surface-1/80 backdrop-blur-sm rounded-lg border border-subtle/50 p-4 hover:shadow-lg hover:border-accent/20 transition-all duration-300'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-secondary'>
                      Engagement Rate
                    </p>
                    <p className='text-2xl font-bold text-primary'>4.2%</p>
                  </div>
                  <div className='h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center'>
                    <span className='text-lg'>📊</span>
                  </div>
                </div>
                <p className='text-xs text-green-600 dark:text-green-400 mt-2'>
                  +0.3% from last month
                </p>
              </div>

              <div className='bg-surface-1/80 backdrop-blur-sm rounded-lg border border-subtle/50 p-4 hover:shadow-lg hover:border-accent/20 transition-all duration-300'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-secondary'>
                      Monthly Listeners
                    </p>
                    <p className='text-2xl font-bold text-primary'>8,934</p>
                  </div>
                  <div className='h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center'>
                    <span className='text-lg'>🎵</span>
                  </div>
                </div>
                <p className='text-xs text-blue-600 dark:text-blue-400 mt-2'>
                  +5.7% from last month
                </p>
              </div>

              <div className='bg-surface-1/80 backdrop-blur-sm rounded-lg border border-subtle/50 p-4 hover:shadow-lg hover:border-accent/20 transition-all duration-300'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-secondary'>
                      Top Location
                    </p>
                    <p className='text-2xl font-bold text-primary'>🇺🇸 US</p>
                  </div>
                  <div className='h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center'>
                    <span className='text-lg'>🌍</span>
                  </div>
                </div>
                <p className='text-xs text-secondary mt-2'>
                  45% of total audience
                </p>
              </div>
            </div>

            {/* Demographics Section */}
            <DashboardCardWithHeader title='Demographics' cardVariant='default'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h4 className='text-sm font-medium text-primary mb-3'>
                    Age Groups
                  </h4>
                  <div className='space-y-2'>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm text-secondary'>18-24</span>
                      <div className='flex items-center gap-2'>
                        <div className='w-16 h-2 bg-surface-2 rounded-full'>
                          <div className='w-3/4 h-full bg-blue-500 rounded-full'></div>
                        </div>
                        <span className='text-sm font-medium text-primary'>
                          35%
                        </span>
                      </div>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm text-secondary'>25-34</span>
                      <div className='flex items-center gap-2'>
                        <div className='w-16 h-2 bg-surface-2 rounded-full'>
                          <div className='w-1/2 h-full bg-green-500 rounded-full'></div>
                        </div>
                        <span className='text-sm font-medium text-primary'>
                          28%
                        </span>
                      </div>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm text-secondary'>35-44</span>
                      <div className='flex items-center gap-2'>
                        <div className='w-16 h-2 bg-surface-2 rounded-full'>
                          <div className='w-1/4 h-full bg-purple-500 rounded-full'></div>
                        </div>
                        <span className='text-sm font-medium text-primary'>
                          22%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className='text-sm font-medium text-primary mb-3'>
                    Top Countries
                  </h4>
                  <div className='space-y-2'>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm text-secondary'>
                        🇺🇸 United States
                      </span>
                      <span className='text-sm font-medium text-primary'>
                        45%
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm text-secondary'>
                        🇬🇧 United Kingdom
                      </span>
                      <span className='text-sm font-medium text-primary'>
                        18%
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm text-secondary'>🇨🇦 Canada</span>
                      <span className='text-sm font-medium text-primary'>
                        12%
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm text-secondary'>
                        🇦🇺 Australia
                      </span>
                      <span className='text-sm font-medium text-primary'>
                        8%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </DashboardCardWithHeader>

            {/* Audience Insights */}
            <DashboardCardWithHeader title='Coming Soon' cardVariant='default'>
              <p className='text-sm text-secondary'>
                Advanced audience insights including listening habits, discovery
                sources, and fan engagement patterns will be available soon.
              </p>
            </DashboardCardWithHeader>
          </div>
        )}

        {currentNavItem === 'settings' && (
          <>
            <div className='mb-8 px-4 sm:px-6 lg:px-8'>
              <DashboardPageHeader
                title='Settings'
                subtitle='Manage your account preferences and settings'
              />
            </div>
            <SettingsPolished
              artist={artist}
              onArtistUpdate={handleArtistUpdated}
            />
          </>
        )}
      </DashboardLayout>
    </>
  );
}
