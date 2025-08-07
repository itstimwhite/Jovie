'use client';

import { PricingTable } from '@clerk/nextjs';
import { Container } from '@/components/site/Container';
import { useEffect, useState } from 'react';

// Extend Window interface to include Clerk
declare global {
  interface Window {
    Clerk?: any;
  }
}

export default function PricingPage() {
  const [isClerkLoaded, setIsClerkLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Clerk is properly loaded
    if (typeof window !== 'undefined' && window.Clerk) {
      setIsClerkLoaded(true);
    } else {
      setError('Clerk is not properly initialized');
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Container>
          <div className="py-24 sm:py-32">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                Pricing
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Pricing table is currently unavailable. Please try again later.
              </p>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Error: {error}
              </p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!isClerkLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Container>
          <div className="py-24 sm:py-32">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                Loading Pricing...
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Please wait while we load the pricing information.
              </p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Container>
        <div className="py-24 sm:py-32">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Start for free and upgrade when you&apos;re ready to remove
              branding
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <PricingTable />
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
