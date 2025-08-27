import { SignInButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

export function AuthActions() {
  const { isSignedIn } = useUser();
  // Feature flags not used here currently

  if (isSignedIn) {
    return (
      <Link
        href='/dashboard'
        className='text-sm px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-gray-500 rounded-sm'
      >
        Dashboard
      </Link>
    );
  }

  return (
    <div className='flex items-center space-x-4'>
      <SignInButton mode='modal'>
        <button className='text-sm px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-gray-500 rounded-sm'>
          Sign in
        </button>
      </SignInButton>
    </div>
  );
}
