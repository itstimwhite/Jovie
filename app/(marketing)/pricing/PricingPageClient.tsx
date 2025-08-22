'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { FeatureFlags } from '@/lib/feature-flags';
import { FeatureFlagsProvider } from '@/components/providers/FeatureFlagsProvider';

interface PricingPageClientProps {
  serverFlags: FeatureFlags;
}

export function PricingPageClient({ serverFlags }: PricingPageClientProps) {
  const { isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!isSignedIn) {
      // Redirect to sign up if not authenticated
      window.location.href = '/sign-up';
      return;
    }

    setIsLoading(true);
    try {
      // Get available pricing options from server
      const pricingResponse = await fetch('/api/stripe/pricing-options');
      const pricingData = await pricingResponse.json();

      // Use the first available price (monthly intro pricing)
      const priceId = pricingData.options?.[0]?.priceId;

      if (!priceId) {
        console.error('No pricing options available');
        return;
      }

      // Create Stripe checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FeatureFlagsProvider serverFlags={serverFlags}>
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
            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? 'Processing...'
                : isSignedIn
                  ? 'Subscribe now'
                  : 'Get started'}
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md px-4 py-2 font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Continue free
            </Link>
          </div>
        </div>
      </div>
    </FeatureFlagsProvider>
  );
}
