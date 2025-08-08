import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { APP_NAME } from '@/constants/app';

export const metadata: Metadata = {
  title: 'Payment Successful',
  description: 'Your Pro subscription has been activated successfully.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function BillingSuccessPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <Container>
        <div className="py-24 sm:py-32">
          <div className="text-center">
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Welcome to {APP_NAME} Pro!
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Your subscription has been activated successfully. The Jovie
              branding has been removed from your profile.
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/dashboard"
                className="rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/pricing"
                className="text-base font-semibold leading-6 text-gray-900 hover:text-gray-700"
              >
                View Pricing <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="mt-16 rounded-lg bg-gray-50 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What&apos;s included in your Pro plan:
              </h2>
              <ul className="text-left space-y-2 text-gray-600">
                <li className="flex items-center gap-x-3">
                  <span className="text-green-600">✓</span>
                  Jovie branding removed from your profile
                </li>
                <li className="flex items-center gap-x-3">
                  <span className="text-green-600">✓</span>
                  Priority customer support
                </li>
                <li className="flex items-center gap-x-3">
                  <span className="text-green-600">✓</span>
                  All current and future free features
                </li>
                <li className="flex items-center gap-x-3 text-gray-400">
                  <span className="text-gray-400">🚀</span>
                  More Pro features coming soon
                </li>
              </ul>
            </div>

            <div className="mt-8 text-sm text-gray-500">
              <p>
                Questions? Contact us at{' '}
                <a
                  href="mailto:support@jovie.co"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  support@jovie.co
                </a>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
