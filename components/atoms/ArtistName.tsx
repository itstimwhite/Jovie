import Link from 'next/link';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { cn } from '@/lib/utils';

interface ArtistNameProps {
  name: string;
  handle: string;
  isVerified?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLink?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'text-lg sm:text-xl',
  md: 'text-xl sm:text-2xl',
  lg: 'text-2xl sm:text-3xl',
  xl: 'text-3xl sm:text-4xl',
};

const badgeSizes = {
  sm: 'sm' as const,
  md: 'sm' as const,
  lg: 'sm' as const,
  xl: 'md' as const,
};

export function ArtistName({
  name,
  handle,
  isVerified = false,
  size = 'lg',
  showLink = true,
  className,
}: ArtistNameProps) {
  const content = (
    <span className="flex items-center justify-center gap-2">
      <span
        className={cn(
          'font-semibold text-gray-900 dark:text-white',
          showLink &&
            'hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer',
          className
        )}
      >
        {name}
      </span>
      {isVerified && <VerifiedBadge size={badgeSizes[size]} />}
    </span>
  );

  if (showLink) {
    return (
      <h1 className={cn(sizeClasses[size])} itemProp="name">
        <Link href={`/${handle}`} className="inline-block">
          {content}
        </Link>
      </h1>
    );
  }

  return (
    <h1 className={cn(sizeClasses[size])} itemProp="name">
      {content}
    </h1>
  );
}
