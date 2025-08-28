'use client';

import {
  BellIcon,
  CreditCardIcon,
  PaintBrushIcon,
  PhotoIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import { useCallback, useState } from 'react';
import { APP_URL } from '@/constants/app';
import type { Artist } from '@/types/db';

interface SettingsPolishedProps {
  artist: Artist;
  onArtistUpdate?: (updatedArtist: Artist) => void;
}

const settingsNavigation = [
  {
    name: 'Profile',
    id: 'profile',
    icon: UserIcon,
    description: 'Your identity and presence',
    isPro: false,
  },
  {
    name: 'Appearance',
    id: 'appearance',
    icon: PaintBrushIcon,
    description: 'Theme and visual preferences',
    isPro: false,
  },
  {
    name: 'Notifications',
    id: 'notifications',
    icon: BellIcon,
    description: 'Stay informed, your way',
    isPro: true,
  },
  {
    name: 'Privacy & Security',
    id: 'privacy',
    icon: ShieldCheckIcon,
    description: 'Control your visibility',
    isPro: true,
  },
  {
    name: 'Billing',
    id: 'billing',
    icon: CreditCardIcon,
    description: 'Subscription and payments',
    isPro: false,
  },
];

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function SettingsPolished({
  artist,
  onArtistUpdate,
}: SettingsPolishedProps) {
  const [currentSection, setCurrentSection] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const [formData, setFormData] = useState({
    username: artist.handle || '',
    displayName: artist.name || '',
    bio: artist.tagline || '',
    creatorType: 'artist',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);

    try {
      // Save theme preference to database for signed-in users
      const response = await fetch('/api/dashboard/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updates: {
            theme: { preference: newTheme },
          },
        }),
      });

      if (!response.ok) {
        console.error('Failed to save theme preference');
      }
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        const response = await fetch('/api/dashboard/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            updates: {
              username: formData.username,
              displayName: formData.displayName,
              bio: formData.bio,
              creatorType: formData.creatorType,
            },
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update profile');
        }

        const { profile } = await response.json();

        if (onArtistUpdate) {
          onArtistUpdate({
            ...artist,
            handle: profile.username,
            name: profile.displayName,
            tagline: profile.bio,
          });
        }
      } catch (error) {
        console.error('Failed to update profile:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [formData, artist, onArtistUpdate]
  );

  const appDomain = APP_URL.replace(/^https?:\/\//, '');

  const renderProfileSection = () => (
    <div className='space-y-8'>
      {/* Header */}
      <div className='pb-6 border-b border-gray-100 dark:border-neutral-800'>
        <h1 className='text-2xl font-semibold tracking-tight text-gray-900 dark:text-white'>
          Your Profile
        </h1>
        <p className='mt-2 text-sm text-gray-600 dark:text-neutral-400'>
          This information will be displayed publicly so be mindful what you
          share.
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-8'>
        {/* Profile Photo Card */}
        <div className='bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
              Profile Photo
            </h3>
            <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'>
              <SparklesIcon className='w-3 h-3 mr-1' />
              Pro
            </span>
          </div>
          <div className='flex items-start space-x-6'>
            <div className='flex-shrink-0'>
              <div className='w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-neutral-600 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors cursor-pointer group'>
                <PhotoIcon className='w-8 h-8 text-gray-400 dark:text-neutral-500 group-hover:text-indigo-500 transition-colors' />
              </div>
            </div>
            <div className='flex-1 space-y-3'>
              <button
                type='button'
                className='inline-flex items-center px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors'
              >
                <PhotoIcon className='w-4 h-4 mr-2' />
                Upload photo
              </button>
              <p className='text-sm text-gray-500 dark:text-neutral-400'>
                JPG, GIF or PNG. Max size 2MB. Square images work best.
              </p>
            </div>
          </div>
        </div>

        {/* Basic Info Card */}
        <div className='bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6 shadow-sm'>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-6'>
            Basic Information
          </h3>

          <div className='space-y-6'>
            {/* Username */}
            <div>
              <label
                htmlFor='username'
                className='block text-sm font-medium text-gray-900 dark:text-white mb-2'
              >
                Username
              </label>
              <div className='relative'>
                <div className='flex rounded-lg shadow-sm'>
                  <span className='inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400 text-sm select-none'>
                    {appDomain}/
                  </span>
                  <input
                    type='text'
                    name='username'
                    id='username'
                    value={formData.username}
                    onChange={e =>
                      handleInputChange('username', e.target.value)
                    }
                    className='flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors'
                    placeholder='yourname'
                  />
                </div>
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label
                htmlFor='displayName'
                className='block text-sm font-medium text-gray-900 dark:text-white mb-2'
              >
                Display Name
              </label>
              <input
                type='text'
                name='displayName'
                id='displayName'
                value={formData.displayName}
                onChange={e => handleInputChange('displayName', e.target.value)}
                className='block w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm transition-colors'
                placeholder='The name your fans will see'
              />
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor='bio'
                className='block text-sm font-medium text-gray-900 dark:text-white mb-2'
              >
                Bio
              </label>
              <textarea
                name='bio'
                id='bio'
                rows={4}
                value={formData.bio}
                onChange={e => handleInputChange('bio', e.target.value)}
                className='block w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm resize-none transition-colors'
                placeholder='Tell your fans about yourself...'
              />
              <p className='mt-2 text-sm text-gray-500 dark:text-neutral-400'>
                A few sentences about your music and what makes you unique.
              </p>
            </div>

            {/* Creator Type */}
            <div>
              <label
                htmlFor='creatorType'
                className='block text-sm font-medium text-gray-900 dark:text-white mb-2'
              >
                Creator Type
              </label>
              <select
                id='creatorType'
                name='creatorType'
                value={formData.creatorType}
                onChange={e => handleInputChange('creatorType', e.target.value)}
                className='block w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm transition-colors'
              >
                <option value='artist'>Solo Artist</option>
                <option value='band'>Band</option>
                <option value='podcaster'>Podcaster</option>
                <option value='creator'>Content Creator</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className='flex justify-end pt-4 border-t border-gray-100 dark:border-neutral-800'>
          <button
            type='submit'
            disabled={isLoading}
            className='inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className='space-y-8'>
      {/* Apple-styled header */}
      <div className='mb-8'>
        <h1 className='text-[22px] font-semibold tracking-[-0.01em] text-gray-900 dark:text-white'>
          Appearance
        </h1>
        <p className='text-sm text-zinc-400 mt-1'>
          Customize how the interface looks and feels.
        </p>
      </div>

      {/* Theme Selection Card */}
      <div className='bg-white/5 dark:bg-[#202022] rounded-xl backdrop-blur ring-1 ring-white/10 dark:ring-white/[0.08] p-6 space-y-4'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-zinc-200 mb-6'>
          Interface Theme
        </h3>

        <div className='grid grid-cols-3 gap-4'>
          {[
            {
              value: 'light',
              label: 'Light',
              description: 'Bright and clean.',
              preview: {
                bg: 'bg-white',
                sidebar: 'bg-gray-50',
                accent: 'bg-gray-100',
              },
            },
            {
              value: 'dark',
              label: 'Dark',
              description: 'Bold and focused.',
              preview: {
                bg: 'bg-gray-900',
                sidebar: 'bg-gray-800',
                accent: 'bg-gray-700',
              },
            },
            {
              value: 'system',
              label: 'System',
              description: 'Match device settings.',
              preview: {
                bg: 'bg-gradient-to-br from-white to-gray-900',
                sidebar: 'bg-gradient-to-br from-gray-50 to-gray-800',
                accent: 'bg-gradient-to-br from-gray-100 to-gray-700',
              },
            },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                handleThemeChange(option.value as 'light' | 'dark' | 'system')
              }
              className={`
                group relative flex flex-col p-4 rounded-xl border-2 transition-all duration-300 ease-in-out
                hover:translate-y-[-2px] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none
                ${
                  theme === option.value
                    ? 'border-indigo-500/70 bg-indigo-50/50 dark:bg-indigo-950/30'
                    : 'border-gray-200 dark:border-white/[0.08] hover:border-indigo-300 dark:hover:border-indigo-500/40'
                }
              `}
            >
              {/* Miniature Dashboard Preview */}
              <div className='relative w-full h-20 rounded-lg overflow-hidden mb-3'>
                <div className={`w-full h-full ${option.preview.bg}`}>
                  {/* Sidebar */}
                  <div
                    className={`absolute left-0 top-0 w-6 h-full ${option.preview.sidebar} rounded-r`}
                  />
                  {/* Content area with some mock elements */}
                  <div className='absolute left-8 top-2 right-2 bottom-2 space-y-1'>
                    <div
                      className={`h-2 ${option.preview.accent} rounded w-1/3`}
                    />
                    <div
                      className={`h-1.5 ${option.preview.accent} rounded w-1/2 opacity-60`}
                    />
                    <div
                      className={`h-1.5 ${option.preview.accent} rounded w-2/3 opacity-40`}
                    />
                  </div>
                </div>
              </div>

              {/* Option Info */}
              <div className='text-left'>
                <h4 className='font-medium text-gray-900 dark:text-zinc-200 text-sm mb-1'>
                  {option.label}
                </h4>
                <p className='text-xs text-gray-500 dark:text-zinc-500 mt-1'>
                  {option.description}
                </p>
              </div>

              {/* Animated Checkmark Overlay */}
              {theme === option.value && (
                <div className='absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center animate-in zoom-in-95 fade-in duration-200'>
                  <svg
                    className='w-3 h-3 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={3}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        <p className='text-xs text-zinc-500 mt-4'>
          Choose how the interface appears. System automatically matches your
          device settings.
        </p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentSection) {
      case 'profile':
        return renderProfileSection();
      case 'appearance':
        return renderAppearanceSection();
      case 'notifications':
        return (
          <div className='space-y-8'>
            <div className='pb-6 border-b border-gray-100 dark:border-neutral-800'>
              <h1 className='text-2xl font-semibold tracking-tight text-gray-900 dark:text-white'>
                Notifications
              </h1>
              <p className='mt-2 text-sm text-gray-600 dark:text-neutral-400'>
                Stay informed about your profile activity.
              </p>
            </div>
            <div className='bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-8 shadow-sm text-center'>
              <BellIcon className='mx-auto h-12 w-12 text-gray-400 dark:text-neutral-500 mb-4' />
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                Notification settings coming soon
              </h3>
              <p className='text-sm text-gray-500 dark:text-neutral-400'>
                We&apos;re working on giving you more control over your
                notifications.
              </p>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className='space-y-8'>
            <div className='pb-6 border-b border-gray-100 dark:border-neutral-800'>
              <h1 className='text-2xl font-semibold tracking-tight text-gray-900 dark:text-white'>
                Privacy & Security
              </h1>
              <p className='mt-2 text-sm text-gray-600 dark:text-neutral-400'>
                Control your profile visibility and data.
              </p>
            </div>
            <div className='bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-8 shadow-sm text-center'>
              <ShieldCheckIcon className='mx-auto h-12 w-12 text-gray-400 dark:text-neutral-500 mb-4' />
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                Privacy settings coming soon
              </h3>
              <p className='text-sm text-gray-500 dark:text-neutral-400'>
                Advanced privacy controls and security settings are in
                development.
              </p>
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className='space-y-8'>
            <div className='pb-6 border-b border-gray-100 dark:border-neutral-800'>
              <h1 className='text-2xl font-semibold tracking-tight text-gray-900 dark:text-white'>
                Billing & Subscription
              </h1>
              <p className='mt-2 text-sm text-gray-600 dark:text-neutral-400'>
                Manage your subscription and billing details.
              </p>
            </div>
            <div className='bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-8 shadow-sm text-center'>
              <CreditCardIcon className='mx-auto h-12 w-12 text-gray-400 dark:text-neutral-500 mb-4' />
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                Billing dashboard coming soon
              </h3>
              <p className='text-sm text-gray-500 dark:text-neutral-400 mb-4'>
                Subscription management and billing history will be available
                here.
              </p>
              <button className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors'>
                Upgrade to Pro
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='flex gap-8 px-4 sm:px-6 lg:px-8'>
      {/* Settings Navigation - Fixed/Sticky */}
      <div className='w-64 flex-shrink-0'>
        <div className='sticky top-8'>
          <nav>
            <ul className='space-y-2'>
              {settingsNavigation.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => setCurrentSection(item.id)}
                    className={classNames(
                      currentSection === item.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                        : 'text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 border-transparent',
                      'group flex w-full items-center rounded-lg border p-3 text-left text-sm font-medium transition-all duration-200'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        currentSection === item.id
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-400 dark:text-neutral-500 group-hover:text-gray-600 dark:group-hover:text-neutral-300',
                        'h-5 w-5 flex-shrink-0 mr-3'
                      )}
                      aria-hidden='true'
                    />
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between'>
                        <span className='truncate'>{item.name}</span>
                        {item.isPro && (
                          <span className='inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 ml-2'>
                            Pro
                          </span>
                        )}
                      </div>
                      <div className='text-xs text-gray-500 dark:text-neutral-400 mt-0.5 truncate'>
                        {item.description}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Settings Content */}
      <div className='flex-1 min-w-0'>{renderContent()}</div>
    </div>
  );
}
