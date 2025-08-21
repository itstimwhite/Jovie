/**
 * Sensitive Link Interstitial Page
 * /out/:id - Anti-scrape interstitial for sensitive domains
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getWrappedLinkInfo } from '@/lib/link-wrapping';
import { SECURITY_HEADERS } from '@/lib/link-wrapping';
import SensitiveLinkInterstitial from '@/components/link-wrapping/SensitiveLinkInterstitial';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Force no caching and add security headers
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Anti-scrape metadata - no target URL exposed
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: 'External Link - Jovie',
    description: 'You are being redirected to an external website.',
    robots: {
      index: false,
      follow: false,
      nocache: true,
      nosnippet: true,
      noarchive: true,
      notranslate: true,
    },
    other: {
      'referrer': 'no-referrer',
    }
  };
}

export default async function SensitiveLinkPage({ params }: PageProps) {
  const { id } = await params;
  
  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    notFound();
  }
  
  // Get link information (but don't expose target URL in HTML)
  const linkInfo = await getWrappedLinkInfo(id);
  
  if (!linkInfo) {
    notFound();
  }
  
  // Security check: Only sensitive links should use this route
  if (linkInfo.kind !== 'sensitive') {
    // Redirect normal links to direct route
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace('/go/${id}');`
        }}
      />
    );
  }
  
  return (
    <>
      {/* Security headers via meta tags */}
      <meta httpEquiv="X-Robots-Tag" content="noindex, nofollow, nosnippet, noarchive, notranslate" />
      <meta httpEquiv="Referrer-Policy" content="no-referrer" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate, private" />
      
      <SensitiveLinkInterstitial 
        linkId={id}
        domain={linkInfo.domain}
        creatorUsername={linkInfo.creator_username}
      />
    </>
  );
}