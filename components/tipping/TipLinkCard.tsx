'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { getBaseUrl } from '@/lib/utils/platform-detection';
import { useToast } from '@/components/ui/ToastContainer';
import { Artist } from '@/types/db';

interface TipLinkCardProps {
  artist: Artist;
}

/**
 * TipLinkCard displays the user's public tip URL with copy and open functionality
 *
 * This component shows the user's public tip URL in the format:
 * - jov.ie/{handle} or
 * - jov.ie/{handle}/tip
 *
 * It provides buttons to copy the URL to clipboard and open it in a new tab.
 */
export function TipLinkCard({ artist }: TipLinkCardProps) {
  const { showToast } = useToast();
  const baseUrl = getBaseUrl();
  const handle = artist.handle || '';

  // Create tip URL format
  const tipUrl = `${baseUrl}/${handle}/tip`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tipUrl);
      showToast({
        message: 'Tip link copied to clipboard!',
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      showToast({
        message: 'Failed to copy link',
        type: 'error',
        duration: 3000,
      });
    }
  };

  const handleOpenLink = () => {
    window.open(tipUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card data-testid='tip-link-card'>
      <CardContent>
        <div className='flex flex-col space-y-4'>
          <div>
            <h3 className='text-lg font-medium'>Your Tip Link</h3>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Share this link with your fans to receive tips
            </p>
          </div>

          <div className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md'>
            <code className='text-sm font-mono'>{tipUrl}</code>
          </div>

          <div className='flex space-x-3'>
            <Button
              variant='secondary'
              onClick={handleCopy}
              className='flex-1'
              aria-label='Copy tip link to clipboard'
            >
              Copy Link
            </Button>
            <Button
              variant='primary'
              onClick={handleOpenLink}
              className='flex-1'
              aria-label='Open tip link in new tab'
            >
              Open Link
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
