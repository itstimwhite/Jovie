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
    <div className={className}>
      <TipSelector amounts={amounts} onContinue={handleAmountSelected} />
    </div>
  );
}
