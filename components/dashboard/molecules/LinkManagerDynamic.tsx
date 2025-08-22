'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';
import type { DetectedLink } from '@/lib/utils/platform-detection';

// Skeleton component for loading state
function LinkManagerSkeleton() {
  return (
    <div className="space-y-6">
      {/* Input skeleton */}
      <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
      
      {/* Links list skeleton */}
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

interface LinkItem extends DetectedLink {
  id: string;
  title: string;
  isVisible: boolean;
  order: number;
}

interface LinkManagerProps {
  initialLinks?: LinkItem[];
  onLinksChange: (links: LinkItem[]) => void;
  disabled?: boolean;
  maxLinks?: number;
  allowedCategory?: 'dsp' | 'social' | 'custom' | 'all';
  title?: string;
  description?: string;
}

// Dynamic import with loading state
const LinkManager = dynamic(
  () => import('./LinkManager').then((mod) => ({ default: mod.LinkManager })),
  {
    loading: () => <LinkManagerSkeleton />,
    ssr: false, // Drag and drop doesn't work well with SSR
  }
) as ComponentType<LinkManagerProps>;

export { LinkManager as LinkManagerDynamic };
export type { LinkManagerProps, LinkItem };