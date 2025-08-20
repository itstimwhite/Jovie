'use client';

import Link from 'next/link';
import { ArtistAvatar } from '@/components/atoms/ArtistAvatar';

export interface ArtistCardProps {
  handle: string;
  name: string;
  src: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  className?: string;
}

export function ArtistCard({
  handle,
  name,
  src,
  alt,
  size = 'md',
  showName = true,
  className = '',
}: ArtistCardProps) {
  return (
    <Link
      href={`/${handle}`}
      aria-label={`View ${name}'s profile`}
      title={name}
      className={`group block cursor-pointer ${className}`}
    >
      <div className="text-center">
        <ArtistAvatar
          src={src}
          alt={alt ?? name}
          name={name}
          size={size}
          className="mx-auto"
        />
        {showName && (
          <p
            className={`mt-2 font-medium text-gray-700 dark:text-gray-300 ${
              size === 'sm' ? 'text-xs' : 'text-sm'
            }`}
          >
            {name}
          </p>
        )}
      </div>
    </Link>
  );
}
