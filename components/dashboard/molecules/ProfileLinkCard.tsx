'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Artist } from '@/types/db';
import { APP_URL } from '@/constants/app';
import {
  ClipboardDocumentIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

interface ProfileLinkCardProps {
  artist: Artist;
}

export function ProfileLinkCard({ artist }: ProfileLinkCardProps) {
  const [copied, setCopied] = useState(false);
  const profileUrl = `${APP_URL}/${artist.handle}`;

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
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Your Profile Link
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
              {profileUrl}
            </p>
          </div>
          <div className="flex space-x-2 flex-shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              leftIcon={<ClipboardDocumentIcon />}
              className="whitespace-nowrap"
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleViewProfile}
              rightIcon={<ArrowTopRightOnSquareIcon />}
              className="whitespace-nowrap"
            >
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
