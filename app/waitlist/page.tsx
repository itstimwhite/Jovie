'use client';

import { Waitlist } from '@clerk/nextjs';
import Link from 'next/link';

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Join the Waitlist
          </h1>
          <p className="text-xl text-white/80 mb-12">
            Be the first to know when Jovie launches. Get early access to claim
            your artist profile and connect with your fans.
          </p>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <Waitlist signInUrl="/sign-in" />
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-white/60">
              Already have access?{' '}
              <Link
                href="/sign-in"
                className="text-purple-400 hover:text-purple-300 transition-colors"
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
