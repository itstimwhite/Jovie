'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { getBaseUrl } from '@/lib/utils/platform-detection';
import { Artist } from '@/types/db';
import { DashboardCard } from '../atoms/DashboardCard';

interface ProfileLinkCardProps {
  artist: Artist;
}

export function ProfileLinkCard({ artist }: ProfileLinkCardProps) {
  const [copied, setCopied] = useState(false);
  const profileUrl = `${getBaseUrl()}/${artist.handle}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleViewProfile = () => {
    window.open(profileUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <DashboardCard variant='default' data-testid='profile-link-card'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='font-medium'>Your Profile Link</h3>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            {profileUrl}
          </p>
        </div>
        <div className='flex space-x-2'>
          <Button variant='secondary' size='sm' onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button variant='primary' size='sm' onClick={handleViewProfile}>
            View Profile
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
}
