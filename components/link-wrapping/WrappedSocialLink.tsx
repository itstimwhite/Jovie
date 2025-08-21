'use client';

/**
 * Wrapped Social Link Component
 * Replaces direct external URLs with wrapped /go/:id or /out/:id links
 */

import { SocialIcon, getPlatformIcon } from '@/components/atoms/SocialIcon';
import { track } from '@/lib/analytics';
import { getSocialDeepLinkConfig, openDeepLink } from '@/lib/deep-links';
import { generateWrappedUrl, extractDomain, ClientLinkWrapper } from '@/lib/link-wrapping';
import type { LegacySocialLink as SocialLinkType } from '@/types/db';
import { useMemo, useState, useEffect } from 'react';

interface WrappedSocialLinkProps {
  link: SocialLinkType & { wrapped_link_id?: string };
  handle: string;
  artistName: string;
}

export function WrappedSocialLink({ link, handle, artistName }: WrappedSocialLinkProps) {
  const [hover, setHover] = useState(false);
  const [wrappedUrl, setWrappedUrl] = useState<string | null>(null);
  const [linkKind, setLinkKind] = useState<'normal' | 'sensitive'>('normal');
  
  const brandHex = useMemo(
    () => getPlatformIcon(link.platform)?.hex,
    [link.platform]
  );

  const clientWrapper = useMemo(() => new ClientLinkWrapper(), []);

  // Determine if this link should be wrapped and what kind
  useEffect(() => {
    const determineWrapping = async () => {
      // If we already have a wrapped_link_id, use it
      if (link.wrapped_link_id) {
        const domain = extractDomain(link.url);
        const isSensitive = await clientWrapper.isSensitiveDomain(domain);
        const kind = isSensitive ? 'sensitive' : 'normal';
        setLinkKind(kind);
        setWrappedUrl(generateWrappedUrl(link.wrapped_link_id, kind));
        return;
      }

      // For legacy links without wrapped_link_id, check if domain is sensitive
      const domain = extractDomain(link.url);
      const isSensitive = await clientWrapper.isSensitiveDomain(domain);
      
      if (isSensitive) {
        // TODO: Create wrapped link via API for legacy links
        console.log(`Legacy sensitive link detected: ${domain}`);
      }
      
      // Use original URL for now (legacy behavior)
      setWrappedUrl(link.url);
    };

    determineWrapping().catch(console.error);
  }, [link.url, link.wrapped_link_id, clientWrapper]);

  const hexToRgba = (hex: string, alpha: number) => {
    const h = hex.replace('#', '');
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Track analytics first
    track('social_click', {
      handle,
      artist: artistName,
      platform: link.platform,
      url: link.url, // Original URL for analytics
      wrapped: !!link.wrapped_link_id,
      kind: linkKind,
    });

    // Fire-and-forget server tracking
    fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        handle,
        linkType: 'social',
        target: link.platform,
        linkId: link.id,
        wrappedLinkId: link.wrapped_link_id,
      }),
    }).catch(() => {
      // Ignore tracking errors
    });

    // Use wrapped URL if available, otherwise fallback to original logic
    const targetUrl = wrappedUrl || link.url;

    // For sensitive wrapped links, let the browser handle the navigation normally
    if (link.wrapped_link_id && linkKind === 'sensitive') {
      window.location.href = targetUrl;
      return;
    }

    // Try deep linking for normal links (wrapped or unwrapped)
    const deepLinkConfig = getSocialDeepLinkConfig(link.platform);

    if (deepLinkConfig && !link.wrapped_link_id) {
      // Only use deep linking for unwrapped links
      try {
        await openDeepLink(targetUrl, deepLinkConfig, {
          onNativeAttempt: () => {
            // Optional: could add loading state here
          },
          onFallback: () => {
            // Optional: could track fallback usage
          },
        });
      } catch (error) {
        console.debug('Deep link failed, using fallback:', error);
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
    } else {
      // Use wrapped URL or original URL
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (!wrappedUrl) {
    // Loading state while determining wrapped URL
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse">
        <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    );
  }

  return (
    <a
      href={wrappedUrl}
      onClick={(e) => handleClick(e)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-all duration-150 hover:scale-105 active:scale-95 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 cursor-pointer ring-1 ring-black/5 dark:ring-white/10"
      style={
        hover && brandHex
          ? {
              color: `#${brandHex}`,
              boxShadow: `0 0 0 0.5px ${hexToRgba(brandHex, 0.6)}, 0 10px 24px -12px ${hexToRgba(brandHex, 0.6)}`,
            }
          : undefined
      }
      title={`Follow on ${link.platform}`}
      aria-label={`Follow ${artistName} on ${link.platform}`}
      // Add security attributes for external links
      rel="noreferrer noopener ugc nofollow"
      referrerPolicy="no-referrer"
    >
      <SocialIcon platform={link.platform} className="h-4 w-4" />
    </a>
  );
}