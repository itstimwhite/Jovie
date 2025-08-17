'use client';

import { PricingTable } from '@clerk/nextjs';
import { Container } from '@/components/site/Container';
import { env } from '@/lib/env';

// Clerk's PricingTable typings currently omit required configuration props.
// Cast to any so we can supply them directly until official types are updated.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ClerkPricingTable = PricingTable as any;

const publishableKey = env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
// Clerk's PricingTable does not require an env var beyond the publishable key.
// Provide your Pricing Table ID from the Clerk Dashboard here (code/config), not via a new env var.
const pricingTableId = 'ptbl_2pWKUJKH7t2pD9gLJJ7aZF7AJzp';

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
              Start for free and upgrade when you&apos;re ready to remove
              branding
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {pricingTableId ? (
              <ClerkPricingTable
                publishableKey={publishableKey}
                pricingTableId={pricingTableId}
                path="/pricing"
                redirectUrl="/billing/success"
                signInUrl="/sign-in"
                signUpUrl="/sign-up"
              />
            ) : (
              <div className="rounded-lg border border-amber-300/40 bg-amber-50 dark:bg-amber-950/20 p-4 text-amber-800 dark:text-amber-200">
                <p className="font-medium">Pricing Table ID not configured</p>
                <p className="mt-1 text-sm opacity-90">
                  Set your Pricing Table ID from Clerk Dashboard directly in
                  code/config. No extra env vars are required.
                </p>
              </div>
            )}
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
