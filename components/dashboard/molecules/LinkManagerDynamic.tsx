'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { DetectedLink } from '@/lib/utils/platform-detection';

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

// Loading skeleton for LinkManager
const LinkManagerSkeleton = () => (
  <div className="space-y-6">
    {/* Input skeleton */}
    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
    
    {/* Links skeleton */}
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
      ))}
    </div>
  </div>
);

// Dynamically import LinkManager with DnD dependencies
const DynamicLinkManager = dynamic(
  () => import('./LinkManager').then((mod) => ({ default: mod.LinkManager })),
  {
    loading: () => <LinkManagerSkeleton />,
    ssr: false, // DnD doesn't work with SSR
  }
);

export const LinkManagerDynamic: React.FC<LinkManagerProps> = (props) => {
  return <DynamicLinkManager {...props} />;
};

export type { LinkManagerProps, LinkItem };