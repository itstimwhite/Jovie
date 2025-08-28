'use client';

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from '@headlessui/react';
import {
  Bars3Icon,
  ChartPieIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  HomeIcon,
  LinkIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PendingClaimRunner } from '@/components/bridge/PendingClaimRunner';
import { OnboardingForm } from '@/components/dashboard';
import { AnalyticsCards } from '@/components/dashboard/molecules/AnalyticsCards';
import { EnhancedThemeToggle } from '@/components/dashboard/molecules/EnhancedThemeToggle';
import { DashboardSplitView } from '@/components/dashboard/organisms/DashboardSplitView';
import { SettingsPolished } from '@/components/dashboard/organisms/SettingsPolished';
import { UserButton } from '@/components/molecules/UserButton';
import { Logo } from '@/components/ui/Logo';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { APP_NAME } from '@/constants/app';
import type { CreatorProfile } from '@/lib/db/schema';
import { Artist, convertDrizzleCreatorProfileToArtist } from '@/types/db';
import { PendingClaimHandler } from './PendingClaimHandler';

const navigation = [
  {
    name: 'Overview',
    href: '#',
    icon: HomeIcon,
    current: true,
    id: 'overview',
  },
  { name: 'Links', href: '#', icon: LinkIcon, current: false, id: 'links' },
  {
    name: 'Analytics',
    href: '#',
    icon: ChartPieIcon,
    current: false,
    id: 'analytics',
  },
  {
    name: 'Audience',
    href: '#',
    icon: UsersIcon,
    current: false,
    id: 'audience',
  },
  {
    name: 'Settings',
    href: '#',
    icon: Cog6ToothIcon,
    current: false,
    id: 'settings',
  },
];

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface DashboardClientProps {
  initialData: {
    user: { id: string } | null;
    creatorProfiles: CreatorProfile[];
    selectedProfile: CreatorProfile | null;
    needsOnboarding: boolean;
  };
}

export function DashboardClient({ initialData }: DashboardClientProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    setSidebarOpen(false);
  };

  if (initialData.needsOnboarding) {
    return (
      <div className='min-h-screen bg-white dark:bg-black transition-colors'>
        {/* Subtle grid background pattern */}
        <div className='absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]' />

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
                <h1 className='text-3xl font-semibold text-gray-900 dark:text-white mb-1 transition-colors'>
                  Welcome to {APP_NAME}
                </h1>
                <p className='text-gray-600 dark:text-white/70 transition-colors'>
                  Claim your handle to launch your artist profile
                </p>
              </div>

              {/* Form Card */}
              <div className='bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 rounded-xl p-6 shadow-xl transition-colors'>
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

      <div className='min-h-screen bg-white dark:bg-[#1C1C1E] transition-colors'>
        {/* Mobile sidebar */}
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className='relative z-50 lg:hidden'
        >
          <DialogBackdrop
            transition
            className='fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0'
          />
          <div className='fixed inset-0 flex'>
            <DialogPanel
              transition
              className='relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full'
            >
              <TransitionChild>
                <div className='absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0'>
                  <button
                    type='button'
                    className='-m-2.5 p-2.5'
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className='sr-only'>Close sidebar</span>
                    <XMarkIcon
                      className='h-6 w-6 text-white'
                      aria-hidden='true'
                    />
                  </button>
                </div>
              </TransitionChild>
              <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-[#1A1A1C] px-6 pb-4'>
                <div className='flex h-16 shrink-0 items-center'>
                  <button
                    onClick={() => {
                      setCurrentNavItem('overview');
                      setSidebarOpen(false);
                    }}
                    className='focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md'
                  >
                    <Logo size='md' />
                  </button>
                </div>
                <nav className='flex flex-1 flex-col'>
                  <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                    <li>
                      <ul role='list' className='-mx-2 space-y-1'>
                        {navigation.map(item => (
                          <li key={item.name}>
                            <button
                              onClick={() => handleNavigation(item.id)}
                              className={classNames(
                                currentNavItem === item.id
                                  ? 'bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-zinc-200'
                                  : 'text-gray-700 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 hover:bg-gray-50 dark:hover:bg-white/5',
                                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full text-left'
                              )}
                            >
                              <item.icon
                                className={classNames(
                                  currentNavItem === item.id
                                    ? 'text-gray-900 dark:text-zinc-200'
                                    : 'text-white/50 group-hover:text-gray-900 dark:group-hover:text-white/90',
                                  'h-6 w-6 shrink-0'
                                )}
                                aria-hidden='true'
                              />
                              {item.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                    {/* Profile selector in mobile sidebar */}
                    {creatorProfiles.length > 1 && (
                      <li>
                        <div className='text-xs font-semibold leading-6 text-gray-400 dark:text-gray-500'>
                          Profiles
                        </div>
                        <ul role='list' className='-mx-2 mt-2 space-y-1'>
                          {creatorProfiles.map(profile => (
                            <li key={profile.id}>
                              <button
                                onClick={() =>
                                  handleProfileSelection(profile.id)
                                }
                                className={classNames(
                                  selectedProfileId === profile.id
                                    ? 'bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white'
                                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800',
                                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full text-left'
                                )}
                              >
                                {profile.avatarUrl ? (
                                  <OptimizedImage
                                    src={profile.avatarUrl}
                                    alt={
                                      profile.displayName || profile.username
                                    }
                                    size='sm'
                                    shape='circle'
                                    aspectRatio='square'
                                    objectFit='cover'
                                    priority={false}
                                    quality={75}
                                  />
                                ) : (
                                  <div className='h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center'>
                                    <span className='text-xs font-medium text-gray-600 dark:text-gray-300'>
                                      {(
                                        profile.displayName ||
                                        profile.username ||
                                        'U'
                                      )
                                        .charAt(0)
                                        .toUpperCase()}
                                    </span>
                                  </div>
                                )}
                                <span className='truncate'>
                                  {profile.displayName || profile.username}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </li>
                    )}
                  </ul>
                  {/* Theme toggle and UserButton in mobile sidebar */}
                  <div className='mt-auto pt-4 border-t border-gray-200 dark:border-neutral-700 space-y-3'>
                    <div className='flex justify-center'>
                      <EnhancedThemeToggle />
                    </div>
                    <UserButton artist={artist} showUserInfo={true} />
                  </div>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div
          className={classNames(
            'hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ease-in-out',
            sidebarCollapsed ? 'lg:w-16' : 'lg:w-72'
          )}
        >
          <div className='flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#1A1A1C] px-6 pb-4'>
            <div className='flex h-16 shrink-0 items-center justify-between'>
              <div className='flex items-center'>
                {!sidebarCollapsed && (
                  <button
                    onClick={() => setCurrentNavItem('overview')}
                    className='focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md'
                  >
                    <Logo size='md' />
                  </button>
                )}
                {sidebarCollapsed && (
                  <button
                    onClick={() => setCurrentNavItem('overview')}
                    className='w-10 h-10 rounded-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors'
                    title='Go to Dashboard Overview'
                  >
                    <Image
                      src='/favicon.svg'
                      alt='Jovie Logo'
                      width={32}
                      height={32}
                      className='w-8 h-8 object-contain'
                    />
                  </button>
                )}
              </div>

              {/* Collapse button in sidebar header */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className='p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-md transition-colors'
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? (
                  <ChevronRightIcon className='h-4 w-4' />
                ) : (
                  <ChevronLeftIcon className='h-4 w-4' />
                )}
              </button>
            </div>
            <nav className='flex flex-1 flex-col'>
              <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                <li>
                  <ul role='list' className='-mx-2 space-y-1'>
                    {navigation.map(item => (
                      <li key={item.name}>
                        <button
                          onClick={() => handleNavigation(item.id)}
                          className={classNames(
                            currentNavItem === item.id
                              ? 'bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-zinc-200'
                              : 'text-gray-700 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 hover:bg-gray-50 dark:hover:bg-white/5',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full text-left',
                            sidebarCollapsed ? 'justify-center' : ''
                          )}
                          title={sidebarCollapsed ? item.name : undefined}
                        >
                          <item.icon
                            className={classNames(
                              currentNavItem === item.id
                                ? 'text-gray-900 dark:text-zinc-200'
                                : 'text-white/50 group-hover:text-gray-900 dark:group-hover:text-white/90',
                              'h-6 w-6 shrink-0'
                            )}
                            aria-hidden='true'
                          />
                          {!sidebarCollapsed && item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
                {/* Profile selector in desktop sidebar - hidden when collapsed */}
                {!sidebarCollapsed && creatorProfiles.length > 1 && (
                  <li>
                    <div className='text-xs font-semibold leading-6 text-gray-400 dark:text-gray-500'>
                      Profiles
                    </div>
                    <ul role='list' className='-mx-2 mt-2 space-y-1'>
                      {creatorProfiles.map(profile => (
                        <li key={profile.id}>
                          <button
                            onClick={() => handleProfileSelection(profile.id)}
                            className={classNames(
                              selectedProfileId === profile.id
                                ? 'bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800',
                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full text-left'
                            )}
                          >
                            {profile.avatarUrl ? (
                              <OptimizedImage
                                src={profile.avatarUrl}
                                alt={profile.displayName || profile.username}
                                size='sm'
                                shape='circle'
                                aspectRatio='square'
                                objectFit='cover'
                                priority={false}
                                quality={75}
                              />
                            ) : (
                              <div className='h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center'>
                                <span className='text-xs font-medium text-gray-600 dark:text-gray-300'>
                                  {(
                                    profile.displayName ||
                                    profile.username ||
                                    'U'
                                  )
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              </div>
                            )}
                            <span className='truncate'>
                              {profile.displayName || profile.username}
                            </span>
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={() => router.push('/onboarding')}
                          className='text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full text-left border border-dashed border-gray-300 dark:border-gray-600'
                        >
                          <svg
                            className='h-6 w-6 shrink-0 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M12 4v16m8-8H4'
                            />
                          </svg>
                          <span className='truncate'>Create New Profile</span>
                        </button>
                      </li>
                    </ul>
                  </li>
                )}
                {/* UserButton in sidebar with user info */}
                <li className='mt-auto'>
                  {/* Pro Upgrade - moved above horizontal line */}
                  {!sidebarCollapsed && (
                    <div className='mb-4'>
                      <button
                        onClick={() => router.push('/pricing')}
                        className='inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white shadow-lg hover:opacity-90 transition-opacity duration-200 w-full gap-2'
                      >
                        <svg
                          className='h-4 w-4 flex-shrink-0'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M13 10V3L4 14h7v7l9-11h-7z'
                          />
                        </svg>
                        Upgrade to Pro
                      </button>
                    </div>
                  )}

                  {/* Theme toggle, horizontal divider, and user info */}
                  <div className='pt-4 border-t border-gray-200 dark:border-neutral-700 space-y-3'>
                    <div className='flex justify-center'>
                      <EnhancedThemeToggle />
                    </div>
                    <div
                      className={classNames(
                        'flex',
                        sidebarCollapsed ? 'justify-center' : ''
                      )}
                    >
                      {!sidebarCollapsed && artist ? (
                        <UserButton artist={artist} showUserInfo={true} />
                      ) : (
                        <UserButton artist={artist} />
                      )}
                    </div>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div
          className={classNames(
            'transition-all duration-300 ease-in-out',
            sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-72'
          )}
        >
          {/* Mobile header bar - minimal */}
          <div className='sticky top-0 z-40 lg:hidden flex h-12 shrink-0 items-center gap-x-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm px-4 border-b border-gray-200/50 dark:border-neutral-800/50'>
            <button
              type='button'
              className='-m-2.5 p-2.5 text-gray-700 dark:text-gray-300'
              onClick={() => setSidebarOpen(true)}
            >
              <span className='sr-only'>Open sidebar</span>
              <Bars3Icon className='h-5 w-5' aria-hidden='true' />
            </button>
          </div>

          <main className={currentNavItem === 'settings' ? '' : 'py-10'}>
            <div
              className={
                currentNavItem === 'settings' ? '' : 'px-4 sm:px-6 lg:px-8'
              }
            >
              {/* Main content area */}
              {currentNavItem === 'overview' && artist && (
                <>
                  <div className='mb-8'>
                    <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                      Welcome back, {artist.name || artist.handle}!
                    </h1>
                    <p className='text-gray-600 dark:text-gray-400 mt-1'>
                      Here&apos;s what&apos;s happening with your profile
                    </p>
                  </div>

                  {/* Quick Actions CTA Cards */}
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                    <button
                      onClick={() => handleNavigation('links')}
                      className='bg-white dark:bg-[#202022] rounded-xl border border-gray-200 dark:border-white/[0.08] p-6 text-left hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all group'
                    >
                      <div className='flex items-center justify-between mb-3'>
                        <LinkIcon className='h-8 w-8 text-indigo-600 dark:text-indigo-400' />
                        <ChevronRightIcon className='h-5 w-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors' />
                      </div>
                      <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                        Manage Links
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Add your social media and streaming platform links
                      </p>
                    </button>

                    <button
                      onClick={() => handleNavigation('analytics')}
                      className='bg-white dark:bg-[#202022] rounded-xl border border-gray-200 dark:border-white/[0.08] p-6 text-left hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all group'
                    >
                      <div className='flex items-center justify-between mb-3'>
                        <ChartPieIcon className='h-8 w-8 text-indigo-600 dark:text-indigo-400' />
                        <ChevronRightIcon className='h-5 w-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors' />
                      </div>
                      <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                        View Analytics
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Track your profile performance and engagement
                      </p>
                    </button>

                    <button
                      onClick={() => handleNavigation('audience')}
                      className='bg-white dark:bg-[#202022] rounded-xl border border-gray-200 dark:border-white/[0.08] p-6 text-left hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all group'
                    >
                      <div className='flex items-center justify-between mb-3'>
                        <UsersIcon className='h-8 w-8 text-indigo-600 dark:text-indigo-400' />
                        <ChevronRightIcon className='h-5 w-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors' />
                      </div>
                      <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                        Manage Audience
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Understand and engage with your fanbase
                      </p>
                    </button>

                    <button
                      onClick={() => handleNavigation('settings')}
                      className='bg-white dark:bg-[#202022] rounded-xl border border-gray-200 dark:border-white/[0.08] p-6 text-left hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all group'
                    >
                      <div className='flex items-center justify-between mb-3'>
                        <Cog6ToothIcon className='h-8 w-8 text-indigo-600 dark:text-indigo-400' />
                        <ChevronRightIcon className='h-5 w-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors' />
                      </div>
                      <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                        Profile Settings
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Customize your profile and account preferences
                      </p>
                    </button>
                  </div>

                  {/* Additional overview content can go here */}
                  <div className='mt-8 text-center'>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>
                      Your dashboard overview will show activity and insights
                      here.
                    </p>
                  </div>
                </>
              )}

              {currentNavItem === 'links' && (
                <>
                  <div className='mb-8'>
                    <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                      Links
                    </h1>
                    <p className='text-gray-600 dark:text-gray-400 mt-1'>
                      Manage your social and streaming platform links
                    </p>
                  </div>

                  {/* Use the full DashboardSplitView for universal inputs and live preview */}
                  <DashboardSplitView
                    artist={artist}
                    onArtistUpdate={handleArtistUpdated}
                  />
                </>
              )}

              {currentNavItem === 'analytics' && (
                <div className='space-y-6'>
                  <div>
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                      Analytics
                    </h2>
                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-6'>
                      Track your profile performance and link engagement
                    </p>
                  </div>

                  {/* Analytics Cards */}
                  <AnalyticsCards />

                  {/* Additional analytics info */}
                  <div className='mt-8 bg-gray-50 dark:bg-neutral-800/50 rounded-lg p-6'>
                    <h3 className='text-sm font-medium text-gray-900 dark:text-white mb-2'>
                      Coming Soon
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Detailed analytics with charts, traffic sources, and
                      demographic insights will be available soon.
                    </p>
                  </div>
                </div>
              )}

              {currentNavItem === 'audience' && (
                <div className='space-y-6'>
                  <div>
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                      Audience
                    </h2>
                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-6'>
                      Understand and connect with your fanbase
                    </p>
                  </div>

                  {/* Audience Overview Cards */}
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                    <div className='bg-white dark:bg-[#202022] rounded-lg border border-gray-200 dark:border-white/[0.08] p-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                            Total Followers
                          </p>
                          <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                            1,247
                          </p>
                        </div>
                        <UsersIcon className='h-8 w-8 text-blue-500' />
                      </div>
                      <p className='text-xs text-green-600 dark:text-green-400 mt-2'>
                        +12% from last month
                      </p>
                    </div>

                    <div className='bg-white dark:bg-[#202022] rounded-lg border border-gray-200 dark:border-white/[0.08] p-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                            Engagement Rate
                          </p>
                          <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                            4.2%
                          </p>
                        </div>
                        <div className='h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center'>
                          <span className='text-lg'>📊</span>
                        </div>
                      </div>
                      <p className='text-xs text-green-600 dark:text-green-400 mt-2'>
                        +0.3% from last month
                      </p>
                    </div>

                    <div className='bg-white dark:bg-[#202022] rounded-lg border border-gray-200 dark:border-white/[0.08] p-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                            Monthly Listeners
                          </p>
                          <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                            8,934
                          </p>
                        </div>
                        <div className='h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center'>
                          <span className='text-lg'>🎵</span>
                        </div>
                      </div>
                      <p className='text-xs text-blue-600 dark:text-blue-400 mt-2'>
                        +5.7% from last month
                      </p>
                    </div>

                    <div className='bg-white dark:bg-[#202022] rounded-lg border border-gray-200 dark:border-white/[0.08] p-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                            Top Location
                          </p>
                          <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                            🇺🇸 US
                          </p>
                        </div>
                        <div className='h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center'>
                          <span className='text-lg'>🌍</span>
                        </div>
                      </div>
                      <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
                        45% of total audience
                      </p>
                    </div>
                  </div>

                  {/* Demographics Section */}
                  <div className='bg-white dark:bg-[#202022] rounded-lg border border-gray-200 dark:border-white/[0.08] p-6'>
                    <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                      Demographics
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div>
                        <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                          Age Groups
                        </h4>
                        <div className='space-y-2'>
                          <div className='flex justify-between items-center'>
                            <span className='text-sm text-gray-600 dark:text-gray-400'>
                              18-24
                            </span>
                            <div className='flex items-center gap-2'>
                              <div className='w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full'>
                                <div className='w-3/4 h-full bg-blue-500 rounded-full'></div>
                              </div>
                              <span className='text-sm font-medium text-gray-900 dark:text-white'>
                                35%
                              </span>
                            </div>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-sm text-gray-600 dark:text-gray-400'>
                              25-34
                            </span>
                            <div className='flex items-center gap-2'>
                              <div className='w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full'>
                                <div className='w-1/2 h-full bg-green-500 rounded-full'></div>
                              </div>
                              <span className='text-sm font-medium text-gray-900 dark:text-white'>
                                28%
                              </span>
                            </div>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-sm text-gray-600 dark:text-gray-400'>
                              35-44
                            </span>
                            <div className='flex items-center gap-2'>
                              <div className='w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full'>
                                <div className='w-1/4 h-full bg-purple-500 rounded-full'></div>
                              </div>
                              <span className='text-sm font-medium text-gray-900 dark:text-white'>
                                22%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                          Top Countries
                        </h4>
                        <div className='space-y-2'>
                          <div className='flex justify-between items-center'>
                            <span className='text-sm text-gray-600 dark:text-gray-400'>
                              🇺🇸 United States
                            </span>
                            <span className='text-sm font-medium text-gray-900 dark:text-white'>
                              45%
                            </span>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-sm text-gray-600 dark:text-gray-400'>
                              🇬🇧 United Kingdom
                            </span>
                            <span className='text-sm font-medium text-gray-900 dark:text-white'>
                              18%
                            </span>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-sm text-gray-600 dark:text-gray-400'>
                              🇨🇦 Canada
                            </span>
                            <span className='text-sm font-medium text-gray-900 dark:text-white'>
                              12%
                            </span>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-sm text-gray-600 dark:text-gray-400'>
                              🇦🇺 Australia
                            </span>
                            <span className='text-sm font-medium text-gray-900 dark:text-white'>
                              8%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Audience Insights */}
                  <div className='bg-gray-50 dark:bg-neutral-800/50 rounded-lg p-6'>
                    <h3 className='text-sm font-medium text-gray-900 dark:text-white mb-2'>
                      Coming Soon
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Advanced audience insights including listening habits,
                      discovery sources, and fan engagement patterns will be
                      available soon.
                    </p>
                  </div>
                </div>
              )}

              {currentNavItem === 'settings' && (
                <>
                  <div className='mb-8 px-4 sm:px-6 lg:px-8'>
                    <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                      Settings
                    </h1>
                    <p className='text-gray-600 dark:text-gray-400 mt-1'>
                      Manage your account preferences and settings
                    </p>
                  </div>
                  <SettingsPolished
                    artist={artist}
                    onArtistUpdate={handleArtistUpdated}
                  />
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
