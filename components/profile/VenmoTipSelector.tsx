'use client';

import React, { useCallback, useState } from 'react';
import { TipSelector } from '@/components/molecules/TipSelector';
import { TipShareCard } from '@/components/tipping/TipShareCard';

type VenmoTipSelectorProps = {
  venmoLink: string;
  venmoUsername?: string | null;
  amounts?: number[];
  className?: string;
  onContinue?: (url: string) => void;
  artistName?: string;
};

export default function VenmoTipSelector({
  venmoLink,
  venmoUsername,
  amounts = [3, 5, 7],
  className,
  onContinue,
  artistName,
}: VenmoTipSelectorProps) {
  const [tipUrl, setTipUrl] = useState<string | null>(null);
  
  const handleAmountSelected = useCallback(
    (amount: number) => {
      const sep = venmoLink.includes('?') ? '&' : '?';
      const url = `${venmoLink}${sep}utm_amount=${amount}&utm_username=${encodeURIComponent(
        venmoUsername ?? ''
      )}`;

      // Save the tip URL for sharing
      setTipUrl(url);
      
      onContinue?.(url);
      window.open(url, '_blank', 'noopener,noreferrer');
    },
    [venmoLink, venmoUsername, onContinue]
  );

  return (
    <div className={className}>
      <TipSelector amounts={amounts} onContinue={handleAmountSelected} />
      
      {tipUrl && (
        <div className="mt-4">
          <TipShareCard 
            tipUrl={tipUrl} 
            artistName={artistName} 
          />
        </div>
      )}
    </div>
  );
}
