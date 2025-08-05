/**
 * Page metadata utilities for identifying landing pages
 * and configuring adaptive header behavior
 */

export interface PageMetadata {
  isLanding: boolean;
  title?: string;
  description?: string;
}

/**
 * Page metadata configuration
 * Landing pages will have adaptive header behavior
 */
export const pageMetadata: Record<string, PageMetadata> = {
  '/': {
    isLanding: true,
    title: 'Jovie - Link in bio for music artists',
    description:
      'Connect your music, social media, and merch in one link. No design needed.',
  },
  '/pricing': {
    isLanding: true,
    title: 'Pricing - Jovie',
    description: 'Simple, transparent pricing for music artists.',
  },
  // Non-landing pages respect global theme
  '/dashboard': {
    isLanding: false,
  },
  '/docs': {
    isLanding: false,
  },
  '/privacy': {
    isLanding: false,
  },
  '/terms': {
    isLanding: false,
  },
};

/**
 * Check if a route is a landing page
 */
export function isLandingPage(pathname: string): boolean {
  const metadata = pageMetadata[pathname];
  return metadata?.isLanding ?? false;
}

/**
 * Get page metadata for a given pathname
 */
export function getPageMetadata(pathname: string): PageMetadata {
  return pageMetadata[pathname] ?? { isLanding: false };
}
