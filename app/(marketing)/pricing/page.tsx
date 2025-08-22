import { Container } from '@/components/site/Container';
import { getServerFeatureFlags } from '@/lib/server/feature-flags';
import { PricingPageClient } from './PricingPageClient';

export default async function PricingPage() {
  // Fetch server-side feature flags for SSR
  const serverFlags = await getServerFeatureFlags();

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

          {/* Client component with server flags passed down */}
          <PricingPageClient serverFlags={serverFlags} />

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
