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
import { cn } from '@/lib/utils';
import type { Artist } from '@/types/db';
import { DashboardButton } from '../atoms/DashboardButton';
import { DashboardPageHeader } from '../atoms/DashboardPageHeader';
import { DashboardFormSection } from '../molecules/DashboardFormSection';

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
      <DashboardPageHeader
        title='Your Profile'
        subtitle='This information will be displayed publicly so be mindful what you share.'
        className='pb-6 border-b border-subtle'
      />

      <form onSubmit={handleSubmit} className='space-y-8'>
        {/* Profile Photo Card */}
        <DashboardFormSection
          title='Profile Photo'
          actions={
            <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-surface-2 text-secondary border border-subtle'>
              <SparklesIcon className='w-3 h-3 mr-1' />
              Pro
            </span>
          }
        >
          <div className='flex items-start space-x-6'>
            <div className='flex-shrink-0'>
              <div className='w-20 h-20 rounded-full bg-surface-2 flex items-center justify-center border-2 border-dashed border-subtle hover:border-accent transition-colors cursor-pointer group'>
                <PhotoIcon className='w-8 h-8 text-secondary group-hover:text-accent-token transition-colors' />
              </div>
            </div>
            <div className='flex-1 space-y-3'>
              <DashboardButton variant='secondary' type='button'>
                <PhotoIcon className='w-4 h-4 mr-2' />
                Upload photo
              </DashboardButton>
              <p className='text-sm text-secondary'>
                JPG, GIF or PNG. Max size 2MB. Square images work best.
              </p>
            </div>
          </div>
        </DashboardFormSection>

        {/* Basic Info Card */}
        <DashboardFormSection title='Basic Information'>
          {/* Username */}
          <div>
            <label
              htmlFor='username'
              className='block text-sm font-medium text-primary mb-2'
            >
              Username
            </label>
            <div className='relative'>
              <div className='flex rounded-lg shadow-sm'>
                <span className='inline-flex items-center px-3 rounded-l-lg border border-r-0 border-subtle bg-surface-2 text-secondary text-sm select-none'>
                  {appDomain}/
                </span>
                <input
                  type='text'
                  name='username'
                  id='username'
                  value={formData.username}
                  onChange={e => handleInputChange('username', e.target.value)}
                  className='flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-lg border border-subtle bg-surface-1 text-primary placeholder:text-secondary focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:border-transparent sm:text-sm transition-colors'
                  placeholder='yourname'
                />
              </div>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label
              htmlFor='displayName'
              className='block text-sm font-medium text-primary mb-2'
            >
              Display Name
            </label>
            <input
              type='text'
              name='displayName'
              id='displayName'
              value={formData.displayName}
              onChange={e => handleInputChange('displayName', e.target.value)}
              className='block w-full px-3 py-2 border border-subtle rounded-lg bg-surface-1 text-primary placeholder:text-secondary focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:border-transparent sm:text-sm shadow-sm transition-colors'
              placeholder='The name your fans will see'
            />
          </div>

          {/* Bio */}
          <div>
            <label
              htmlFor='bio'
              className='block text-sm font-medium text-primary mb-2'
            >
              Bio
            </label>
            <textarea
              name='bio'
              id='bio'
              rows={4}
              value={formData.bio}
              onChange={e => handleInputChange('bio', e.target.value)}
              className='block w-full px-3 py-2 border border-subtle rounded-lg bg-surface-1 text-primary placeholder:text-secondary focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:border-transparent sm:text-sm shadow-sm resize-none transition-colors'
              placeholder='Tell your fans about yourself...'
            />
            <p className='mt-2 text-sm text-secondary'>
              A few sentences about your music and what makes you unique.
            </p>
          </div>

          {/* Creator Type */}
          <div>
            <label
              htmlFor='creatorType'
              className='block text-sm font-medium text-primary mb-2'
            >
              Creator Type
            </label>
            <select
              id='creatorType'
              name='creatorType'
              value={formData.creatorType}
              onChange={e => handleInputChange('creatorType', e.target.value)}
              className='block w-full px-3 py-2 border border-subtle rounded-lg bg-surface-1 text-primary focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:border-transparent sm:text-sm shadow-sm transition-colors'
            >
              <option value='artist'>Solo Artist</option>
              <option value='band'>Band</option>
              <option value='podcaster'>Podcaster</option>
              <option value='creator'>Content Creator</option>
            </select>
          </div>
        </DashboardFormSection>

        {/* Save Button */}
        <div className='flex justify-end pt-4 border-t border-subtle'>
          <DashboardButton variant='primary' type='submit' disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </DashboardButton>
        </div>
      </form>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className='space-y-8'>
      <DashboardPageHeader
        title='Appearance'
        subtitle='Customize how the interface looks and feels.'
      />

      {/* Theme Selection Card */}
      <DashboardFormSection title='Interface Theme'>
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
              className={cn(
                'group relative flex flex-col p-4 rounded-xl border-2 transition-all duration-300 ease-in-out',
                'hover:translate-y-[-2px] hover:shadow-lg focus-visible:ring-2 ring-accent focus-visible:outline-none',
                theme === option.value
                  ? 'border-accent/70 bg-surface-2'
                  : 'border-subtle hover:border-accent/50'
              )}
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
                <h4 className='font-medium text-primary text-sm mb-1'>
                  {option.label}
                </h4>
                <p className='text-xs text-secondary mt-1'>
                  {option.description}
                </p>
              </div>

              {/* Animated Checkmark Overlay */}
              {theme === option.value && (
                <div className='absolute top-2 right-2 w-5 h-5 bg-accent-token rounded-full flex items-center justify-center animate-in zoom-in-95 fade-in duration-200'>
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

        <p className='text-xs text-secondary mt-4'>
          Choose how the interface appears. System automatically matches your
          device settings.
        </p>
      </DashboardFormSection>
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
            <DashboardPageHeader
              title='Notifications'
              subtitle='Stay informed about your profile activity.'
              className='pb-6 border-b border-subtle'
            />
            <div className='bg-surface-1 rounded-xl border border-subtle p-8 shadow-sm text-center'>
              <BellIcon className='mx-auto h-12 w-12 text-secondary mb-4' />
              <h3 className='text-lg font-medium text-primary mb-2'>
                Notification settings coming soon
              </h3>
              <p className='text-sm text-secondary'>
                We&apos;re working on giving you more control over your
                notifications.
              </p>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className='space-y-8'>
            <DashboardPageHeader
              title='Privacy & Security'
              subtitle='Control your profile visibility and data.'
              className='pb-6 border-b border-subtle'
            />
            <div className='bg-surface-1 rounded-xl border border-subtle p-8 shadow-sm text-center'>
              <ShieldCheckIcon className='mx-auto h-12 w-12 text-secondary mb-4' />
              <h3 className='text-lg font-medium text-primary mb-2'>
                Privacy settings coming soon
              </h3>
              <p className='text-sm text-secondary'>
                Advanced privacy controls and security settings are in
                development.
              </p>
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className='space-y-8'>
            <DashboardPageHeader
              title='Billing & Subscription'
              subtitle='Manage your subscription and billing details.'
              className='pb-6 border-b border-subtle'
            />
            <div className='bg-surface-1 rounded-xl border border-subtle p-8 shadow-sm text-center'>
              <CreditCardIcon className='mx-auto h-12 w-12 text-secondary mb-4' />
              <h3 className='text-lg font-medium text-primary mb-2'>
                Billing dashboard coming soon
              </h3>
              <p className='text-sm text-secondary mb-4'>
                Subscription management and billing history will be available
                here.
              </p>
              <DashboardButton variant='pro-upgrade'>
                Upgrade to Pro
              </DashboardButton>
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
                  <DashboardButton
                    variant='nav-item'
                    onClick={() => setCurrentSection(item.id)}
                    isActive={currentSection === item.id}
                    isPro={item.isPro}
                    className='border p-3'
                  >
                    <item.icon
                      className={cn(
                        'h-5 w-5 flex-shrink-0 mr-3',
                        currentSection === item.id
                          ? 'text-accent-token'
                          : 'text-secondary group-hover:text-primary'
                      )}
                      aria-hidden='true'
                    />
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between'>
                        <span className='truncate'>{item.name}</span>
                      </div>
                      <div className='text-xs text-secondary mt-0.5 truncate'>
                        {item.description}
                      </div>
                    </div>
                  </DashboardButton>
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
