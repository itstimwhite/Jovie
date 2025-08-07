import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useFeatureFlags } from '@/components/providers/FeatureFlagsProvider';

export function AuthActions() {
  const { isSignedIn } = useUser();
  const { flags } = useFeatureFlags();

  if (isSignedIn) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard"
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Dashboard
        </Link>
        <span className="text-gray-300 dark:text-gray-600">•</span>
        <Link
          href="/onboarding"
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Get started
        </Link>
        <span className="text-gray-300 dark:text-gray-600">•</span>
        <Link
          href={flags.waitlistEnabled ? '/waitlist' : '/sign-up'}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          {flags.waitlistEnabled ? 'Join Waitlist' : 'Sign Up'}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <SignInButton mode="modal">
        <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
          Sign in
        </button>
      </SignInButton>
      <span className="text-gray-300 dark:text-gray-600">•</span>
      <SignUpButton mode="modal">
        <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
          {flags.waitlistEnabled ? 'Join Waitlist' : 'Sign Up'}
        </button>
      </SignUpButton>
    </div>
  );
}
