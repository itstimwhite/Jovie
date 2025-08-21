'use client';

/**
 * Wrapped DSP Button Component
 * Replaces direct external URLs with wrapped /go/:id or /out/:id links for DSP platforms
 */

import React, { useState, useEffect, useMemo } from 'react';
import { DSPButton, type DSPButtonProps } from '@/components/atoms/DSPButton';
import { generateWrappedUrl, extractDomain, ClientLinkWrapper } from '@/lib/link-wrapping';

interface WrappedDSPButtonProps extends Omit<DSPButtonProps, 'onClick'> {
  wrappedLinkId?: string;
  originalUrl: string;
  onAnalyticsClick?: (dspKey: string, originalUrl: string, wrapped: boolean, kind: 'normal' | 'sensitive') => void;
}

export function WrappedDSPButton({
  wrappedLinkId,
  originalUrl,
  onAnalyticsClick,
  ...dspButtonProps
}: WrappedDSPButtonProps) {
  const [wrappedUrl, setWrappedUrl] = useState<string | null>(null);
  const [linkKind, setLinkKind] = useState<'normal' | 'sensitive'>('normal');
  
  const clientWrapper = useMemo(() => new ClientLinkWrapper(), []);

  // Determine if this link should be wrapped and what kind
  useEffect(() => {
    const determineWrapping = async () => {
      // If we already have a wrapped_link_id, use it
      if (wrappedLinkId) {
        const domain = extractDomain(originalUrl);
        const isSensitive = await clientWrapper.isSensitiveDomain(domain);
        const kind = isSensitive ? 'sensitive' : 'normal';
        setLinkKind(kind);
        setWrappedUrl(generateWrappedUrl(wrappedLinkId, kind));
        return;
      }

      // For legacy links without wrapped_link_id, check if domain is sensitive
      const domain = extractDomain(originalUrl);
      const isSensitive = await clientWrapper.isSensitiveDomain(domain);
      
      if (isSensitive) {
        // TODO: Create wrapped link via API for legacy links
        console.log(`Legacy sensitive DSP link detected: ${domain}`);
      }
      
      // Use original URL for now (legacy behavior)
      setWrappedUrl(originalUrl);
    };

    determineWrapping().catch(console.error);
  }, [originalUrl, wrappedLinkId, clientWrapper]);

  const handleClick = (dspKey: string, url: string) => {
    // Call analytics callback with original URL and wrapping info
    onAnalyticsClick?.(dspKey, originalUrl, !!wrappedLinkId, linkKind);
    
    // Use wrapped URL if available
    const targetUrl = wrappedUrl || originalUrl;
    
    // For sensitive wrapped links, use location navigation
    if (wrappedLinkId && linkKind === 'sensitive') {
      window.location.href = targetUrl;
      return;
    }
    
    // For normal links (wrapped or unwrapped), open in new tab
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  if (!wrappedUrl) {
    // Loading state while determining wrapped URL
    return (
      <button
        disabled
        className={`
          w-full max-w-md rounded-lg font-semibold transition-all duration-200 ease-out 
          shadow-sm px-6 py-3 text-base opacity-50 cursor-not-allowed
          bg-gray-300 text-gray-600
        `}
        aria-label="Loading..."
      >
        <span className="inline-flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 rounded animate-pulse"></div>
          <span>Loading...</span>
        </span>
      </button>
    );
  }

  return (
    <DSPButton
      {...dspButtonProps}
      url={wrappedUrl}
      onClick={handleClick}
    />
  );
}