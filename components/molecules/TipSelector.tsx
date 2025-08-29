import { useState, useEffect, useRef } from 'react';
import { AmountSelector } from '@/components/atoms/AmountSelector';
import { Button } from '@/components/ui/Button';

interface TipSelectorProps {
  amounts?: number[];
  onContinue: (amount: number) => void;
  isLoading?: boolean;
  className?: string;
}

export function TipSelector({
  amounts = [3, 5, 7],
  onContinue,
  isLoading = false,
  className = '',
}: TipSelectorProps) {
  const defaultIdx = Math.floor(Math.max(0, amounts.length - 1) / 2);
  const [selectedIdx, setSelectedIdx] = useState<number>(defaultIdx);
  const statusRef = useRef<HTMLDivElement>(null);

  const selectedAmount = amounts[selectedIdx];

  const handleContinue = () => {
    onContinue(selectedAmount);
  };

  // Announce selection changes to screen readers
  useEffect(() => {
    if (statusRef.current) {
      statusRef.current.textContent = `$${selectedAmount} selected`;
    }
  }, [selectedAmount]);

  return (
    <div className={`space-y-4 ${className}`} data-test='tip-selector' role='group' aria-labelledby='tip-selector-heading'>
      <div id='tip-selector-heading' className='sr-only'>
        Select tip amount
      </div>
      
      {/* Visually hidden live region for screen readers */}
      <div className='sr-only' aria-live='polite' ref={statusRef}></div>
      
      <div className='grid grid-cols-3 gap-3' role='radiogroup' aria-label='Tip amount options'>
        {amounts.map((amount, idx) => (
          <AmountSelector
            key={amount}
            amount={amount}
            isSelected={idx === selectedIdx}
            onClick={() => setSelectedIdx(idx)}
          />
        ))}
      </div>

      <hr className='mt-3 pt-3 border-t border-black/5 dark:border-white/10' />

      <Button
        onClick={handleContinue}
        className='w-full !bg-black !text-white hover:!bg-gray-800 dark:!bg-white dark:!text-black dark:hover:!bg-gray-100'
        size='lg'
        disabled={isLoading}
        variant='plain'
        aria-label={`Continue with $${selectedAmount} tip`}
      >
        {isLoading ? 'Processing...' : 'Continue'}
      </Button>
    </div>
  );
}
