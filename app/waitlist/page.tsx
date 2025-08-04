'use client';

import { Waitlist } from '@clerk/nextjs';
import Link from 'next/link';

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 transition-colors">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
            Join the Waitlist
          </h1>
          <p className="text-xl text-gray-700 dark:text-white/80 mb-12 transition-colors">
            Be the first to know when Jovie launches. Get early access to claim
            your artist profile and connect with your fans.
          </p>

          <div className="bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-gray-200/50 dark:border-white/20 transition-colors">
            <Waitlist signInUrl="/sign-in" />
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600 dark:text-white/60 transition-colors">
              Already have access?{' '}
              <Link
                href="/sign-in"
                className="text-blue-600 hover:text-blue-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
