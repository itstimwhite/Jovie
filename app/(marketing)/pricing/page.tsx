'use client';

import { Container } from '@/components/site/Container';
import Link from 'next/link';
// Simple, static pricing page without Clerk's PricingTable for MVP

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Container>
        <div className="py-24 sm:py-32">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Start free. Upgrade any time to remove branding.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/60 backdrop-blur p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Remove branding
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                The only paid feature right now. Everything else is included for
                free.
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  $5
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  /mo
                </span>
              </div>

              <ul className="mt-6 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• All core features</li>
                <li>• Remove the Jovie branding badge</li>
                <li>• Cancel anytime</li>
              </ul>

              <div className="mt-8 flex items-center gap-3">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                >
                  Get started
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Continue free
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              All plans include unlimited updates and our 30-day money-back
              guarantee.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
