'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { shareContent, isShareSupported } from '@/lib/share';
import { motion } from 'framer-motion';

interface TipShareCardProps {
  tipUrl: string;
  artistName?: string;
  className?: string;
}

export function TipShareCard({
  tipUrl,
  artistName,
  className = '',
}: TipShareCardProps) {
  const [isSharing, setIsSharing] = useState(false);
  const shareSupported = isShareSupported();

  const handleShare = async () => {
    setIsSharing(true);

    try {
      const shareTitle = artistName
        ? `Support ${artistName}`
        : 'Support this artist';

      const shareText = artistName
        ? `Help support ${artistName} with a tip!`
        : 'Help support this artist with a tip!';

      await shareContent({
        url: tipUrl,
        title: shareTitle,
        text: shareText,
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <motion.div
      className={`rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-lg 
        border border-gray-200/30 dark:border-white/10 p-4 shadow-lg shadow-black/5 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='flex flex-col space-y-3'>
        <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          Know someone who wants to support?
        </h3>

        <Button
          onClick={handleShare}
          className='w-full'
          size='md'
          variant='secondary'
          disabled={isSharing}
          aria-label={
            shareSupported ? 'Share tip link' : 'Copy tip link to clipboard'
          }
        >
          {isSharing
            ? 'Processing...'
            : shareSupported
              ? 'Share Tip Link'
              : 'Copy Tip Link'}
        </Button>

        <p className='text-xs text-gray-500 dark:text-gray-400 text-center'>
          {shareSupported
            ? 'Opens native share options on your device'
            : 'Copies the tip link to your clipboard'}
        </p>
      </div>
    </motion.div>
  );
}
