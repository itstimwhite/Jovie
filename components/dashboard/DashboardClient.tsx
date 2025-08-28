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

      <div className='min-h-screen bg-white dark:bg-black transition-colors'>
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
              <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-neutral-900 px-6 pb-4'>
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
                                  ? 'bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white'
                                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800',
                                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full text-left'
                              )}
                            >
                              <item.icon
                                className={classNames(
                                  currentNavItem === item.id
                                    ? 'text-gray-900 dark:text-white'
                                    : 'text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white',
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
          <div className='flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 pb-4'>
            <div className='flex h-16 shrink-0 items-center'>
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
                  className='w-8 h-8 rounded-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors'
                  title='Go to Dashboard Overview'
                >
                  <Image
                    src='/favicon.svg'
                    alt='Jovie App Icon'
                    width={24}
                    height={24}
                    className='w-6 h-6'
                  />
                </button>
              )}
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
                              ? 'bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white'
                              : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full text-left',
                            sidebarCollapsed ? 'justify-center' : ''
                          )}
                          title={sidebarCollapsed ? item.name : undefined}
                        >
                          <item.icon
                            className={classNames(
                              currentNavItem === item.id
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white',
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
                {/* Pro Upgrade */}
                <li className='mt-auto'>
                  {!sidebarCollapsed && (
                    <div className='mb-4'>
                      <button
                        onClick={() => router.push('/pricing')}
                        className='w-full flex items-center gap-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 p-3 text-sm font-medium text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm'
                      >
                        <svg
                          className='h-5 w-5 flex-shrink-0'
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
                        <div className='text-left'>
                          <div className='font-semibold'>Upgrade to Pro</div>
                          <div className='text-xs text-white/80'>
                            Unlock premium features
                          </div>
                        </div>
                      </button>
                    </div>
                  )}
                </li>
                {/* Theme Toggle */}
                <li>
                  <div
                    className={classNames(
                      'flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full',
                      sidebarCollapsed ? 'justify-center' : ''
                    )}
                  >
                    {!sidebarCollapsed && (
                      <>
                        <svg
                          className='h-6 w-6 shrink-0 text-gray-400'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
                          />
                        </svg>
                        <span className='text-gray-700 dark:text-gray-300'>
                          Theme
                        </span>
                      </>
                    )}
                    <div className={sidebarCollapsed ? '' : 'ml-auto'}>
                      <EnhancedThemeToggle showSystemOption={false} />
                    </div>
                  </div>
                </li>
                {/* Collapse button */}
                <li>
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className={classNames(
                      'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full text-left',
                      sidebarCollapsed ? 'justify-center' : ''
                    )}
                    title={sidebarCollapsed ? 'Expand menu' : 'Collapse menu'}
                  >
                    {sidebarCollapsed ? (
                      <ChevronRightIcon className='h-6 w-6 shrink-0 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                    ) : (
                      <>
                        <ChevronLeftIcon className='h-6 w-6 shrink-0 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                        <span>Collapse menu</span>
                      </>
                    )}
                  </button>
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
          <div className='sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8'>
            <button
              type='button'
              className='-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden'
              onClick={() => setSidebarOpen(true)}
            >
              <span className='sr-only'>Open sidebar</span>
              <Bars3Icon className='h-6 w-6' aria-hidden='true' />
            </button>

            {/* Separator */}
            <div
              className='h-6 w-px bg-gray-200 dark:bg-neutral-800 lg:hidden'
              aria-hidden='true'
            />

            <div className='flex flex-1 gap-x-4 self-stretch lg:gap-x-6'>
              <div className='relative flex flex-1 items-center'>
                {currentNavItem !== 'settings' && (
                  <h1 className='text-xl font-semibold leading-6 text-gray-900 dark:text-white'>
                    {navigation.find(item => item.id === currentNavItem)
                      ?.name || 'Dashboard'}
                  </h1>
                )}
              </div>
              <div className='flex items-center gap-x-4 lg:gap-x-6'>
                {/* User Menu */}
                <UserButton artist={artist} />
              </div>
            </div>
          </div>

          <main className={currentNavItem === 'settings' ? '' : 'py-10'}>
            <div
              className={
                currentNavItem === 'settings' ? '' : 'px-4 sm:px-6 lg:px-8'
              }
            >
              {/* Main content area */}
              {currentNavItem === 'overview' && artist && (
                <DashboardSplitView
                  artist={artist}
                  onArtistUpdate={handleArtistUpdated}
                />
              )}

              {currentNavItem === 'links' && (
                <div className='text-center py-12'>
                  <LinkIcon className='mx-auto h-12 w-12 text-gray-400' />
                  <h3 className='mt-2 text-sm font-semibold text-gray-900 dark:text-white'>
                    Links Management
                  </h3>
                  <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                    Manage your social and streaming platform links.
                  </p>
                </div>
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

              {currentNavItem === 'settings' && (
                <SettingsPolished
                  artist={artist}
                  onArtistUpdate={handleArtistUpdated}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
