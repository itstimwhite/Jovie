'use client';

import React, { useMemo, useState } from 'react';
import PrimaryCTA from '@/components/ui/PrimaryCTA';

type VenmoTipSelectorProps = {
  venmoLink: string;
  venmoUsername?: string | null;
  amounts?: number[];
  className?: string;
  onContinue?: (url: string) => void;
};

export default function VenmoTipSelector({
  venmoLink,
  venmoUsername,
  amounts = [3, 5, 7],
  className,
  onContinue,
}: VenmoTipSelectorProps) {
  const defaultIdx = Math.floor(Math.max(0, amounts.length - 1) / 2); // center index by default
  const [selectedIdx, setSelectedIdx] = useState<number>(defaultIdx);

  const selectedAmount = amounts[selectedIdx];

  const continueUrl = useMemo(() => {
    const sep = venmoLink.includes('?') ? '&' : '?';
    const url = `${venmoLink}${sep}utm_amount=${selectedAmount}&utm_username=${encodeURIComponent(
      venmoUsername ?? ''
    )}`;
    return url;
  }, [venmoLink, selectedAmount, venmoUsername]);

  const handleContinue = () => {
    if (!continueUrl) return;
    onContinue?.(continueUrl);
    window.open(continueUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={className ?? 'space-y-4'}>
      <div className="grid grid-cols-3 gap-3">
        {amounts.map((amt, idx) => {
          const selected = idx === selectedIdx;
          return (
            <button
              key={amt}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              aria-pressed={selected}
              className={[
                'w-full aspect-square rounded-xl border text-lg font-semibold transition-colors flex items-center justify-center',
                'bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100',
                selected
                  ? 'border-purple-500 ring-2 ring-purple-200/60 dark:ring-purple-600/30'
                  : 'border-black/40 hover:border-black/70 dark:border-white/30 dark:hover:border-white/60',
              ].join(' ')}
            >
              ${amt}
            </button>
          );
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/10" />

      <PrimaryCTA
        onClick={handleContinue}
        ariaLabel={`Continue to Venmo with $${selectedAmount}`}
        autoFocus
      >
        Continue
      </PrimaryCTA>
    </div>
  );
}
