import { SignInButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

export function AuthActions() {
  const { isSignedIn } = useUser();
  // Feature flags not used here currently

  if (isSignedIn) {
    return (
      <nav aria-label="User navigation" className="flex items-center space-x-4">
        <Link
          href="/dashboard"
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:text-gray-900 dark:focus:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 rounded-sm px-2 py-1 transition-colors"
        >
          Dashboard
        </Link>
        <span className="text-gray-300 dark:text-gray-600" aria-hidden="true">
          •
        </span>
        <Link
          href="/onboarding"
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:text-gray-900 dark:focus:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 rounded-sm px-2 py-1 transition-colors"
        >
          Get started
        </Link>
        <span className="text-gray-300 dark:text-gray-600" aria-hidden="true">
          •
        </span>
        <Link
          href="/sign-up"
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:text-gray-900 dark:focus:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 rounded-sm px-2 py-1 transition-colors"
        >
          Sign Up
        </Link>
      </nav>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <SignInButton mode="modal">
        <button
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:text-gray-900 dark:focus:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 rounded-sm px-2 py-1 transition-colors"
          aria-label="Sign in to your account"
        >
          Sign in
        </button>
      </SignInButton>
    </div>
  );
}
