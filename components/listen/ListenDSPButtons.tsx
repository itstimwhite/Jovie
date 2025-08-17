'use client';

import React, { useEffect } from 'react';
import type { AvailableDSP } from '@/lib/dsp';
import { getDSPDeepLinkConfig, openDeepLink } from '@/lib/deep-links';
import { LISTEN_COOKIE } from '@/constants/app';

type ListenDSPButtonsProps = {
  handle: string;
  dsps: AvailableDSP[];
  initialPreferredUrl?: string | null;
};

export default function ListenDSPButtons({
  handle,
  dsps,
  initialPreferredUrl,
}: ListenDSPButtonsProps) {
  useEffect(() => {
    // Auto open preferred URL if provided
    if (initialPreferredUrl) {
      try {
        window.open(initialPreferredUrl, '_blank', 'noopener,noreferrer');
      } catch {
        // noop
      }
    }
  }, [initialPreferredUrl]);

  const onClick = async (dspKey: string, url: string) => {
    try {
      // Save preference for 1 year
      document.cookie = `${LISTEN_COOKIE}=${dspKey}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      try {
        localStorage.setItem(LISTEN_COOKIE, dspKey);
      } catch {}

      // Fire-and-forget tracking
      try {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ handle, linkType: 'listen', target: dspKey }),
          keepalive: true,
        }).catch(() => {});
      } catch {}

      // Try deep linking
      const deepLinkConfig = getDSPDeepLinkConfig(dspKey);

      if (deepLinkConfig) {
        try {
          await openDeepLink(url, deepLinkConfig, {
            onNativeAttempt: () => {
              // Optional: could add loading state here
            },
            onFallback: () => {
              // Optional: could track fallback usage
            },
          });
        } catch (error) {
          console.debug('Deep link failed, using fallback:', error);
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      } else {
        // No deep link config, use original URL
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch {
      // noop
    }
  };

  return (
    <div className="space-y-3">
      {dsps.map((dsp) => (
        <button
          key={dsp.key}
          onClick={() => onClick(dsp.key, dsp.url)}
          className="w-full max-w-md rounded-lg px-6 py-3 text-base font-semibold transition-all duration-200 ease-out shadow-sm hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/50 cursor-pointer"
          aria-label={`Open in ${dsp.name} app if installed, otherwise opens in web browser`}
          style={{
            backgroundColor: dsp.config.color,
            color: dsp.config.textColor,
          }}
        >
          <span className="inline-flex items-center gap-2">
            <span dangerouslySetInnerHTML={{ __html: dsp.config.logoSvg }} />
            <span>Open in {dsp.name}</span>
          </span>
        </button>
      ))}
      <p className="text-xs text-gray-500 text-center">
        Your preference will be saved for next time
      </p>
    </div>
  );
}
