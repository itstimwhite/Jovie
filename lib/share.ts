/**
 * Utility for sharing content via Web Share API with fallback to clipboard
 */

import { toast } from 'sonner';

interface ShareOptions {
  url: string;
  title?: string;
  text?: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

/**
 * Share content using the Web Share API with clipboard fallback
 *
 * @param options ShareOptions object containing url, title, and text
 * @returns Promise<boolean> indicating whether sharing was successful
 */
export async function shareContent({
  url,
  title = 'Check out this artist',
  text = 'I found this artist you might like',
  onSuccess,
  onError,
}: ShareOptions): Promise<boolean> {
  // Check if the Web Share API is available
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      });

      onSuccess?.();
      return true;
    } catch (error) {
      // User cancelled or share failed
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error sharing content:', error);
        onError?.(error);
      }
      return false;
    }
  } else {
    // Fallback to clipboard if Web Share API is not available
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
      onSuccess?.();
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      onError?.(error);
      return false;
    }
  }
}

/**
 * Check if the Web Share API is available in the current browser
 *
 * @returns boolean indicating whether Web Share API is supported
 */
export function isShareSupported(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share;
}
