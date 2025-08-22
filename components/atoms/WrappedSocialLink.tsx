/**
 * Anti-Cloaking Safe Social Link Component
 * Wraps external links with crawler-safe labels and proper security headers
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SocialIcon } from './SocialIcon';
import { getCrawlerSafeLabel, isSensitiveDomain } from '@/lib/utils/domain-categorizer';
import { extractDomain } from '@/lib/utils/url-encryption';

interface WrappedSocialLinkProps {
  href: string;
  platform: string;
  children?: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  'aria-label'?: string;
}

interface WrappedLinkData {
  wrappedUrl: string;
  kind: 'normal' | 'sensitive';
  alias: string;
}

export function WrappedSocialLink({
  href,
  platform,
  children,
  className = '',
  target = '_blank',
  rel,
  'aria-label': ariaLabel,
}: WrappedSocialLinkProps) {
  const [wrappedData, setWrappedData] = useState<WrappedLinkData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate crawler-safe label
  const domain = extractDomain(href);
  const isSensitive = isSensitiveDomain(href);
  const crawlerSafeLabel = getCrawlerSafeLabel(domain, platform);

  useEffect(() => {
    // Only wrap external links that aren't already wrapped
    if (!href || href.startsWith('/') || href.includes(window.location.hostname)) {
      return;
    }

    const wrapLink = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/wrap-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: href,
            platform,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to wrap link');
        }

        const data = await response.json();
        setWrappedData({
          wrappedUrl: data.kind === 'sensitive' ? `/out/${data.shortId}` : `/go/${data.shortId}`,
          kind: data.kind,
          alias: data.titleAlias || crawlerSafeLabel,
        });
      } catch (err) {
        console.error('Link wrapping failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Fallback to original URL
        setWrappedData({
          wrappedUrl: href,
          kind: 'normal',
          alias: crawlerSafeLabel,
        });
      } finally {
        setIsLoading(false);
      }
    };

    wrapLink();
  }, [href, platform, crawlerSafeLabel]);

  // Default security attributes
  const securityRel = rel || 'noreferrer noopener ugc nofollow';
  
  // Show loading state or fallback
  if (isLoading || !wrappedData) {
    return (
      <Link
        href={href}
        target={target}
        rel={securityRel}
        className={className}
        aria-label={ariaLabel || `${crawlerSafeLabel} link`}
      >
        {children || (
          <div className="flex items-center gap-2">
            <SocialIcon platform={platform} size={20} />
            <span>{crawlerSafeLabel}</span>
          </div>
        )}
      </Link>
    );
  }

  return (
    <Link
      href={wrappedData.wrappedUrl}
      target={target}
      rel={securityRel}
      className={className}
      aria-label={ariaLabel || `${wrappedData.alias} link`}
      data-link-kind={wrappedData.kind}
    >
      {children || (
        <div className="flex items-center gap-2">
          <SocialIcon platform={platform} size={20} />
          <span>{wrappedData.alias}</span>
          {wrappedData.kind === 'sensitive' && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
              Verification Required
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

/**
 * Simple wrapper for DSP buttons with anti-cloaking protection
 */
interface WrappedDSPButtonProps {
  href: string;
  platform: string;
  className?: string;
  children: React.ReactNode;
}

export function WrappedDSPButton({
  href,
  platform,
  className = '',
  children,
}: WrappedDSPButtonProps) {
  return (
    <WrappedSocialLink
      href={href}
      platform={platform}
      className={className}
      aria-label={`Listen on ${platform}`}
    >
      {children}
    </WrappedSocialLink>
  );
}

/**
 * Fallback component for unwrapped links (legacy support)
 */
interface LegacySocialLinkProps {
  href: string;
  platform: string;
  children: React.ReactNode;
  className?: string;
}

export function LegacySocialLink({
  href,
  platform,
  children,
  className = '',
}: LegacySocialLinkProps) {
  const domain = extractDomain(href);
  const crawlerSafeLabel = getCrawlerSafeLabel(domain, platform);

  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer noopener ugc nofollow"
      className={className}
      aria-label={`${crawlerSafeLabel} link`}
    >
      {children}
    </Link>
  );
}