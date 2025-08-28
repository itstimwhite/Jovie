'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useBillingStatus } from '@/hooks/use-billing-status';
import type { Artist } from '@/types/db';

interface UserButtonProps {
  artist?: Artist | null;
}

export function UserButton({ artist }: UserButtonProps) {
  const { isLoaded, user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isBillingLoading, setIsBillingLoading] = useState(false);
  const billingStatus = useBillingStatus();

  if (!isLoaded || !user) {
    return null;
  }

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut(() => router.push('/'));
    } catch (error) {
      console.error('Sign out error:', error);
      setIsLoading(false);
    }
  };

  const handleProfile = () => {
    openUserProfile();
  };

  const handleBilling = async () => {
    if (isBillingLoading) return;

    setIsBillingLoading(true);

    try {
      if (billingStatus.isPro && billingStatus.hasStripeCustomer) {
        // User has a subscription - open billing portal
        const response = await fetch('/api/stripe/portal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to create billing portal session');
        }

        const { url } = await response.json();
        window.location.href = url;
      } else {
        // User doesn't have a subscription - go to pricing page
        router.push('/pricing');
      }
    } catch (error) {
      console.error('Error opening billing portal:', error);
      // Fallback to pricing page
      router.push('/pricing');
    } finally {
      setIsBillingLoading(false);
    }
  };

  const userImageUrl = user.imageUrl;
  const displayName =
    user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress;
  const userInitials = displayName
    ? displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <Menu as='div' className='relative'>
      <MenuButton className='flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900'>
        {userImageUrl ? (
          <Image
            src={userImageUrl}
            alt={displayName || 'User avatar'}
            width={32}
            height={32}
            className='w-8 h-8 rounded-full object-cover'
          />
        ) : (
          <span className='text-xs font-medium text-gray-700 dark:text-gray-200'>
            {userInitials}
          </span>
        )}
      </MenuButton>

      <MenuItems
        className='absolute right-0 top-full z-50 mt-2 w-64 origin-top-right rounded-lg border bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none'
        style={{
          animation: 'user-menu-enter 150ms ease-out',
        }}
      >
        <div className='p-4 border-b border-gray-200/50 dark:border-gray-700/50'>
          <div className='flex items-center gap-3'>
            {userImageUrl ? (
              <Image
                src={userImageUrl}
                alt={displayName || 'User avatar'}
                width={40}
                height={40}
                className='w-10 h-10 rounded-full object-cover'
              />
            ) : (
              <div className='w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-200'>
                  {userInitials}
                </span>
              </div>
            )}
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                {displayName}
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>

        <div className='py-2'>
          <MenuItem>
            {({ focus }) => (
              <button
                onClick={() => router.push('/dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                  focus
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
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
                    d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 5a2 2 0 012-2h4a2 2 0 012 2v1H8V5z'
                  />
                </svg>
                Dashboard
              </button>
            )}
          </MenuItem>

          {artist?.username && (
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={() => router.push(`/${artist.username}`)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    focus
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
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
                      d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                    />
                  </svg>
                  View Profile
                </button>
              )}
            </MenuItem>
          )}

          <MenuItem>
            {({ focus }) => (
              <button
                onClick={handleProfile}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                  focus
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
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
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
                Account Settings
              </button>
            )}
          </MenuItem>

          <MenuItem>
            {({ focus }) => (
              <button
                onClick={handleBilling}
                disabled={isBillingLoading || billingStatus.loading}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  focus
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {isBillingLoading ? (
                  <svg
                    className='w-4 h-4 animate-spin'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                ) : (
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
                      d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
                    />
                  </svg>
                )}
                {isBillingLoading
                  ? 'Loading...'
                  : billingStatus.loading
                    ? 'Billing'
                    : billingStatus.isPro
                      ? 'Manage Billing'
                      : 'Upgrade to Pro'}
              </button>
            )}
          </MenuItem>
        </div>

        <div className='py-2 border-t border-gray-200/50 dark:border-gray-700/50'>
          <MenuItem>
            {({ focus }) => (
              <button
                onClick={handleSignOut}
                disabled={isLoading}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                  focus
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'text-red-600 dark:text-red-400'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
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
                    d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                  />
                </svg>
                {isLoading ? 'Signing out...' : 'Sign out'}
              </button>
            )}
          </MenuItem>
        </div>

        <style jsx>{`
          @keyframes user-menu-enter {
            from {
              opacity: 0;
              transform: translateY(-4px) scale(0.99);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
            }
          }
        `}</style>
      </MenuItems>
    </Menu>
  );
}
