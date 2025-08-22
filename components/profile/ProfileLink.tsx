'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { cache } from '@/lib/cache';

interface ProfileLinkProps {
  username: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
  warmCache?: boolean;
  onClick?: () => void;
}

/**
 * ProfileLink component with prefetching and cache warming
 *
 * This component enhances the standard Next.js Link with:
 * 1. Prefetching on hover (configurable)
 * 2. Cache warming for profile data (configurable)
 * 3. Analytics tracking
 *
 * @example
 * <ProfileLink username="artistname">
 *   Visit Artist Profile
 * </ProfileLink>
 */
export function ProfileLink({
  username,
  children,
  className = '',
  prefetch = true,
  warmCache = true,
  onClick,
}: ProfileLinkProps) {
  const router = useRouter();
  const [hasPrefetched, setHasPrefetched] = useState(false);

  // Handle hover to prefetch and warm cache
  const handleMouseEnter = useCallback(() => {
    if (hasPrefetched) return;

    // Prefetch the profile page
    if (prefetch) {
      router.prefetch(`/${username}`);
    }

    // Warm the cache by fetching profile data
    if (warmCache) {
      // Fetch profile data to warm the cache
      fetch(`/api/profiles/${username}`, { priority: 'low' }).catch(() => {
        // Ignore errors during prefetch
      });
    }

    setHasPrefetched(true);
  }, [username, prefetch, warmCache, router, hasPrefetched]);

  // Handle click for analytics
  const handleClick = useCallback(() => {
    // Track click in analytics
    try {
      // Simple cache monitoring
      if (cache.isEnabled()) {
        cache.monitoring.trackHit('app', `profile_link:${username}`);
      }

      // Call the provided onClick handler if any
      onClick?.();
    } catch (error) {
      // Ignore errors in click handling
      console.error('Error in ProfileLink click handler:', error);
    }
  }, [username, onClick]);

  return (
    <Link
      href={`/${username}`}
      className={className}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      prefetch={false} // We handle prefetching manually
    >
      {children}
    </Link>
  );
}
