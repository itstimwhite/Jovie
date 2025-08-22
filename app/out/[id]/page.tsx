/**
 * Sensitive Link Interstitial Page (/out/[id])
 * Anti-cloaking compliant interstitial for sensitive domains
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getWrappedLink } from '@/lib/services/link-wrapping';
import { getCategoryDescription } from '@/lib/utils/domain-categorizer';
import { InterstitialClient } from './InterstitialClient';
import { FeatureFlagsProvider } from '@/components/providers/FeatureFlagsProvider';
import { getServerFeatureFlags } from '@/lib/server/feature-flags';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata(): Promise<Metadata> {
  // Generic metadata to avoid exposing sensitive information to crawlers
  return {
    title: 'Link Confirmation Required',
    description: 'This link requires confirmation before proceeding.',
    robots: {
      index: false,
      follow: false,
      nocache: true,
      nosnippet: true,
      noarchive: true,
    },
    referrer: 'no-referrer',
  };
}

export default async function InterstitialPage({ params }: PageProps) {
  const { id: shortId } = params;

  if (!shortId || shortId.length > 20) {
    notFound();
  }

  // Get wrapped link information
  const wrappedLink = await getWrappedLink(shortId);

  if (!wrappedLink) {
    notFound();
  }

  // Ensure this is a sensitive link
  if (wrappedLink.kind !== 'sensitive') {
    // Redirect normal links to /go/ route
    const redirectUrl = `/go/${shortId}`;
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace('${redirectUrl}');`,
        }}
      />
    );
  }

  // Get generic description for crawlers
  const genericDescription = getCategoryDescription(
    wrappedLink.category || 'adult'
  );

  // Fetch server-side feature flags for SSR
  const serverFlags = await getServerFeatureFlags();

  return (
    <FeatureFlagsProvider serverFlags={serverFlags}>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          {/* Generic content visible to crawlers */}
          <div className="text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-xl font-semibold text-gray-900 mb-3">
              Link Confirmation Required
            </h1>

            <p className="text-gray-600 mb-6">{genericDescription}</p>

            {/* Client-side component for human verification */}
            <InterstitialClient
              shortId={shortId}
              titleAlias={wrappedLink.titleAlias || 'External Link'}
              domain={wrappedLink.domain}
              category={wrappedLink.category}
            />

            <div className="mt-6 text-sm text-gray-500">
              <p>This confirmation helps protect against automated access.</p>
            </div>
          </div>
        </div>
      </div>
    </FeatureFlagsProvider>
  );
}
