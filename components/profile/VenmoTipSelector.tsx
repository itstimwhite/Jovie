'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
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

  const handleContinue = useCallback(() => {
    if (!continueUrl) return;
    onContinue?.(continueUrl);
    window.open(continueUrl, '_blank', 'noopener,noreferrer');
  }, [continueUrl, onContinue]);

  // Add keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          setSelectedIdx((prev) => Math.max(0, prev - 1));
          break;
        case 'ArrowRight':
          event.preventDefault();
          setSelectedIdx((prev) => Math.min(amounts.length - 1, prev + 1));
          break;
        case 'Enter':
          event.preventDefault();
          handleContinue();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [amounts.length, handleContinue]);

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
                'w-full aspect-square rounded-xl border text-lg font-semibold transition-colors flex items-center justify-center cursor-pointer',
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
      <hr className="mt-3 pt-3 border-t border-black/5 dark:border-white/10" />

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
