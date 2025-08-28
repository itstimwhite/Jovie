'use client';

import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { APP_URL } from '@/constants/app';
import type { Artist } from '@/types/db';

interface ProfileSettingsProps {
  artist: Artist;
  onArtistUpdate?: (updatedArtist: Artist) => void;
}

export function ProfileSettings({
  artist,
  onArtistUpdate,
}: ProfileSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: artist.handle || '',
    displayName: artist.name || '',
    bio: artist.tagline || '',
    creatorType: 'artist',
  });

  const handleSubmit = async (e: React.FormEvent) => {
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
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const { profile } = await response.json();

      // Update the local artist state with the new data
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
      // You could add toast notification here for user feedback
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get the app domain from APP_URL
  const appDomain = APP_URL.replace(/^https?:\/\//, '');
  return (
    <form onSubmit={handleSubmit}>
      <div className='space-y-12'>
        <div className='grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3 dark:border-white/10'>
          <div>
            <h2 className='text-base/7 font-semibold text-gray-900 dark:text-white'>
              Profile
            </h2>
            <p className='mt-1 text-sm/6 text-gray-600 dark:text-gray-400'>
              This information will be displayed publicly so be careful what you
              share.
            </p>
          </div>

          <div className='grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2'>
            <div className='sm:col-span-4'>
              <label
                htmlFor='username'
                className='block text-sm/6 font-medium text-gray-900 dark:text-white'
              >
                Username
              </label>
              <div className='mt-2'>
                <div className='flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 dark:bg-white/5 dark:outline-white/10 dark:focus-within:outline-indigo-500'>
                  <div className='shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400'>
                    {appDomain}/
                  </div>
                  <input
                    id='username'
                    name='username'
                    type='text'
                    placeholder='username'
                    value={formData.username}
                    onChange={e =>
                      handleInputChange('username', e.target.value)
                    }
                    className='block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500'
                  />
                </div>
              </div>
            </div>

            <div className='col-span-full'>
              <label
                htmlFor='about'
                className='block text-sm/6 font-medium text-gray-900 dark:text-white'
              >
                Bio
              </label>
              <div className='mt-2'>
                <textarea
                  id='about'
                  name='about'
                  rows={3}
                  value={formData.bio}
                  onChange={e => handleInputChange('bio', e.target.value)}
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500'
                />
              </div>
              <p className='mt-3 text-sm/6 text-gray-600 dark:text-gray-400'>
                Write a few sentences about yourself or your music.
              </p>
            </div>

            <div className='col-span-full'>
              <label
                htmlFor='photo'
                className='block text-sm/6 font-medium text-gray-900 dark:text-white'
              >
                Profile Photo
              </label>
              <div className='mt-2 flex items-center gap-x-3'>
                <UserCircleIcon
                  aria-hidden='true'
                  className='size-12 text-gray-300 dark:text-gray-500'
                />
                <button
                  type='button'
                  className='rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:shadow-none dark:ring-white/5 dark:hover:bg-white/20'
                >
                  Change
                </button>
              </div>
            </div>

            <div className='col-span-full'>
              <label
                htmlFor='cover-photo'
                className='block text-sm/6 font-medium text-gray-900 dark:text-white'
              >
                Cover photo
              </label>
              <div className='mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 dark:border-white/25'>
                <div className='text-center'>
                  <PhotoIcon
                    aria-hidden='true'
                    className='mx-auto size-12 text-gray-300 dark:text-gray-500'
                  />
                  <div className='mt-4 flex text-sm/6 text-gray-600 dark:text-gray-400'>
                    <label
                      htmlFor='file-upload'
                      className='relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 hover:text-indigo-500 dark:bg-transparent dark:text-indigo-400 dark:focus-within:outline-indigo-500 dark:hover:text-indigo-400'
                    >
                      <span>Upload a file</span>
                      <input
                        id='file-upload'
                        name='file-upload'
                        type='file'
                        className='sr-only'
                      />
                    </label>
                    <p className='pl-1'>or drag and drop</p>
                  </div>
                  <p className='text-xs/5 text-gray-600 dark:text-gray-400'>
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information section */}
        <div className='grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3 dark:border-white/10'>
          <div>
            <h2 className='text-base/7 font-semibold text-gray-900 dark:text-white'>
              Account Information
            </h2>
            <p className='mt-1 text-sm/6 text-gray-600 dark:text-gray-400'>
              Update your account settings and preferences.
            </p>
          </div>

          <div className='grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2'>
            <div className='sm:col-span-3'>
              <label
                htmlFor='first-name'
                className='block text-sm/6 font-medium text-gray-900 dark:text-white'
              >
                Display name
              </label>
              <div className='mt-2'>
                <input
                  id='first-name'
                  name='first-name'
                  type='text'
                  autoComplete='given-name'
                  value={formData.displayName}
                  onChange={e =>
                    handleInputChange('displayName', e.target.value)
                  }
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500'
                />
              </div>
            </div>

            <div className='sm:col-span-4'>
              <label
                htmlFor='email'
                className='block text-sm/6 font-medium text-gray-900 dark:text-white'
              >
                Email address
              </label>
              <div className='mt-2'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500'
                />
              </div>
            </div>

            <div className='sm:col-span-3'>
              <label
                htmlFor='creator-type'
                className='block text-sm/6 font-medium text-gray-900 dark:text-white'
              >
                Creator Type
              </label>
              <div className='mt-2 grid grid-cols-1'>
                <select
                  id='creator-type'
                  name='creator-type'
                  value={formData.creatorType}
                  onChange={e =>
                    handleInputChange('creatorType', e.target.value)
                  }
                  className='col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:*:bg-neutral-800 dark:focus:outline-indigo-500'
                >
                  <option value='artist'>Artist</option>
                  <option value='band'>Band</option>
                  <option value='podcaster'>Podcaster</option>
                  <option value='creator'>Creator</option>
                </select>
                <ChevronDownIcon
                  aria-hidden='true'
                  className='pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4 dark:text-gray-400'
                />
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3 dark:border-white/10'>
          <div>
            <h2 className='text-base/7 font-semibold text-gray-900 dark:text-white'>
              Notifications
            </h2>
            <p className='mt-1 text-sm/6 text-gray-600 dark:text-gray-400'>
              Choose what updates you want to receive about your profile and
              links.
            </p>
          </div>

          <div className='max-w-2xl space-y-10 md:col-span-2'>
            <fieldset>
              <legend className='text-sm/6 font-semibold text-gray-900 dark:text-white'>
                Email Notifications
              </legend>
              <div className='mt-6 space-y-6'>
                <div className='flex gap-3'>
                  <div className='flex h-6 shrink-0 items-center'>
                    <div className='group grid size-4 grid-cols-1'>
                      <input
                        defaultChecked
                        id='analytics'
                        name='analytics'
                        type='checkbox'
                        aria-describedby='analytics-description'
                        className='col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:checked:border-indigo-500 dark:checked:bg-indigo-500 dark:indeterminate:border-indigo-500 dark:indeterminate:bg-indigo-500 dark:focus-visible:outline-indigo-500 dark:disabled:border-white/5 dark:disabled:bg-white/10 dark:disabled:checked:bg-white/10 forced-colors:appearance-auto'
                      />
                      <svg
                        fill='none'
                        viewBox='0 0 14 14'
                        className='pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25 dark:group-has-[:disabled]:stroke-white/25'
                      >
                        <path
                          d='M3 8L6 11L11 3.5'
                          strokeWidth={2}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='opacity-0 group-has-[:checked]:opacity-100'
                        />
                        <path
                          d='M3 7H11'
                          strokeWidth={2}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='opacity-0 group-has-[:indeterminate]:opacity-100'
                        />
                      </svg>
                    </div>
                  </div>
                  <div className='text-sm/6'>
                    <label
                      htmlFor='analytics'
                      className='font-medium text-gray-900 dark:text-white'
                    >
                      Weekly Analytics
                    </label>
                    <p
                      id='analytics-description'
                      className='text-gray-500 dark:text-gray-400'
                    >
                      Get weekly reports about your profile views and link
                      clicks.
                    </p>
                  </div>
                </div>
                <div className='flex gap-3'>
                  <div className='flex h-6 shrink-0 items-center'>
                    <div className='group grid size-4 grid-cols-1'>
                      <input
                        id='tips'
                        name='tips'
                        type='checkbox'
                        aria-describedby='tips-description'
                        className='col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:checked:border-indigo-500 dark:checked:bg-indigo-500 dark:indeterminate:border-indigo-500 dark:indeterminate:bg-indigo-500 dark:focus-visible:outline-indigo-500 dark:disabled:border-white/5 dark:disabled:bg-white/10 dark:disabled:checked:bg-white/10 forced-colors:appearance-auto'
                      />
                      <svg
                        fill='none'
                        viewBox='0 0 14 14'
                        className='pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25 dark:group-has-[:disabled]:stroke-white/25'
                      >
                        <path
                          d='M3 8L6 11L11 3.5'
                          strokeWidth={2}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='opacity-0 group-has-[:checked]:opacity-100'
                        />
                        <path
                          d='M3 7H11'
                          strokeWidth={2}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='opacity-0 group-has-[:indeterminate]:opacity-100'
                        />
                      </svg>
                    </div>
                  </div>
                  <div className='text-sm/6'>
                    <label
                      htmlFor='tips'
                      className='font-medium text-gray-900 dark:text-white'
                    >
                      New Tips
                    </label>
                    <p
                      id='tips-description'
                      className='text-gray-500 dark:text-gray-400'
                    >
                      Get notified when someone sends you a tip.
                    </p>
                  </div>
                </div>
                <div className='flex gap-3'>
                  <div className='flex h-6 shrink-0 items-center'>
                    <div className='group grid size-4 grid-cols-1'>
                      <input
                        id='marketing'
                        name='marketing'
                        type='checkbox'
                        aria-describedby='marketing-description'
                        className='col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:checked:border-indigo-500 dark:checked:bg-indigo-500 dark:indeterminate:border-indigo-500 dark:indeterminate:bg-indigo-500 dark:focus-visible:outline-indigo-500 dark:disabled:border-white/5 dark:disabled:bg-white/10 dark:disabled:checked:bg-white/10 forced-colors:appearance-auto'
                      />
                      <svg
                        fill='none'
                        viewBox='0 0 14 14'
                        className='pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25 dark:group-has-[:disabled]:stroke-white/25'
                      >
                        <path
                          d='M3 8L6 11L11 3.5'
                          strokeWidth={2}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='opacity-0 group-has-[:checked]:opacity-100'
                        />
                        <path
                          d='M3 7H11'
                          strokeWidth={2}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='opacity-0 group-has-[:indeterminate]:opacity-100'
                        />
                      </svg>
                    </div>
                  </div>
                  <div className='text-sm/6'>
                    <label
                      htmlFor='marketing'
                      className='font-medium text-gray-900 dark:text-white'
                    >
                      Marketing Updates
                    </label>
                    <p
                      id='marketing-description'
                      className='text-gray-500 dark:text-gray-400'
                    >
                      Receive news about new features and updates.
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>

      <div className='mt-6 flex items-center justify-end gap-x-6'>
        <button
          type='button'
          className='text-sm/6 font-semibold text-gray-900 dark:text-white'
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={isLoading}
          className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-500 dark:shadow-none dark:focus-visible:outline-indigo-500'
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
