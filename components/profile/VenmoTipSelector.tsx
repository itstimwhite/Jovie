'use client';

import React, { useCallback } from 'react';
import { TipSelector } from '@/components/molecules/TipSelector';

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
  const handleAmountSelected = useCallback(
    (amount: number) => {
      const sep = venmoLink.includes('?') ? '&' : '?';
      const url = `${venmoLink}${sep}utm_amount=${amount}&utm_username=${encodeURIComponent(
        venmoUsername ?? ''
      )}`;

      onContinue?.(url);
      window.open(url, '_blank', 'noopener,noreferrer');
    },
    [venmoLink, venmoUsername, onContinue]
  );

  return (
    <div className={className} role='region' aria-label='Venmo Tipping'>
      <div className='bg-white/60 dark:bg-white/5 backdrop-blur-lg border border-gray-200/30 dark:border-white/10 rounded-2xl p-6 shadow-xl shadow-black/5'>
        <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>
          Send a Tip via Venmo
        </h2>
        <TipSelector amounts={amounts} onContinue={handleAmountSelected} />
        <p className='mt-4 text-sm text-gray-600 dark:text-gray-400'>
          You&apos;ll be redirected to Venmo to complete your tip.
        </p>
      </div>
    </div>
  );
}
