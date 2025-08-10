'use client';

import React, { useEffect } from 'react';
import type { AvailableDSP } from '@/lib/dsp';
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

  const onClick = (dspKey: string, url: string) => {
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

      window.open(url, '_blank', 'noopener,noreferrer');
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
          className="w-full max-w-md rounded-lg px-6 py-3 text-base font-semibold transition-transform shadow-sm hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"
          aria-label={`Open in ${dsp.name}`}
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
