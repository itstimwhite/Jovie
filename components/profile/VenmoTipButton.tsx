'use client';

import { useCallback } from 'react';
import { track } from '@/lib/analytics';
import { useFeatureFlags } from '@/lib/hooks/useFeatureFlags';
import { LegacySocialLink } from '@/types/db';

interface VenmoTipButtonProps {
  socialLinks: LegacySocialLink[];
  artistHandle: string;
  artistName?: string;
}

export function VenmoTipButton({
  socialLinks,
  artistHandle,
  artistName,
}: VenmoTipButtonProps) {
  const { venmoTipButtonEnabled } = useFeatureFlags();
  
  // Find Venmo link if it exists
  const venmoLink = socialLinks.find(link => link.platform === 'venmo')?.url;
  
  // Extract Venmo handle from URL
  const extractVenmoHandle = (url: string | undefined): string | null => {
    if (!url) return null;
    try {
      const u = new URL(url);
      const allowedVenmoHosts = ['venmo.com', 'www.venmo.com'];
      if (allowedVenmoHosts.includes(u.hostname)) {
        const parts = u.pathname.split('/').filter(Boolean);
        if (parts[0] === 'u' && parts[1]) return parts[1];
        if (parts[0]) return parts[0];
      }
      return null;
    } catch {
      return null;
    }
  };
  
  const venmoHandle = extractVenmoHandle(venmoLink);
  
  const handleClick = useCallback(() => {
    // Track the click event
    track('tip_click', {
      artist_handle: artistHandle,
      artist_name: artistName,
      platform: 'venmo',
      venmo_handle: venmoHandle,
    });
    
    // Open Venmo in a new tab
    if (venmoLink) {
      window.open(venmoLink, '_blank', 'noopener,noreferrer');
    }
  }, [venmoLink, artistHandle, artistName, venmoHandle]);
  
  // Don't render if feature flag is disabled or no Venmo handle exists
  if (!venmoTipButtonEnabled || !venmoHandle || !venmoLink) {
    return null;
  }
  
  return (
    <button
      onClick={handleClick}
      className="mt-3 inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-full text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-colors duration-200"
      aria-label={`Tip ${artistName || artistHandle} with Venmo`}
    >
      <svg 
        className="w-3.5 h-3.5 mr-1.5" 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path d="M19.5 3h-15A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zm-7.45 15.5c-2.4 0-4.35-1.05-4.35-2.65 0-.9.55-1.55 1.4-1.55.8 0 1.4.5 1.4 1.3 0 .65-.35 1.05-.75 1.05-.25 0-.45-.15-.45-.35 0-.15.1-.3.25-.3.05 0 .1.05.1.1 0 .05-.05.1-.05.1.05.05.1.1.15.1.2 0 .35-.2.35-.55 0-.5-.35-.85-.95-.85-.55 0-.95.45-.95 1.1 0 1.25 1.65 2.2 3.85 2.2 2.25 0 3.9-.95 3.9-2.2 0-.65-.4-1.1-.95-1.1-.6 0-.95.35-.95.85 0 .35.15.55.35.55.05 0 .1-.05.15-.1 0 0-.05-.05-.05-.1 0-.05.05-.1.1-.1.15 0 .25.15.25.3 0 .2-.2.35-.45.35-.4 0-.75-.4-.75-1.05 0-.8.6-1.3 1.4-1.3.85 0 1.4.65 1.4 1.55 0 1.6-1.95 2.65-4.35 2.65z" />
      </svg>
      Tip with Venmo
    </button>
  );
}

