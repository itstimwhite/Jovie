'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the OptimizedAvatar component
 * 
 * This component is specifically designed for avatar images with:
 * - Fixed aspect ratio (always 1:1)
 * - Circular shape
 * - Optimized loading behavior
 * - Fallback for missing avatars
 */
interface OptimizedAvatarProps {
  /** Avatar image source URL */
  src: string | null | undefined;
  
  /** Alt text for the avatar (e.g., "Profile picture of John Doe") */
  alt: string;
  
  /** Size in pixels (both width and height) */
  size?: 64 | 128 | 256 | 384;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Set to true for important avatars (e.g., profile page main avatar) */
  priority?: boolean;
  
  /** Image quality (1-100) */
  quality?: number;
  
  /** Fallback image to show when src is null or on error */
  fallbackSrc?: string;
}

// Elegant blur placeholder data URIs for different sizes
const BLUR_DATA_URLS = {
  64: 'data:image/webp;base64,UklGRoQCAABXRUJQVlA4WAoAAAAgAAAAPwAAPwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDhUAAAALwAAAP8QEI0AAAAgHyAQg4CARGQ=',
  128: 'data:image/webp;base64,UklGRq4CAABXRUJQVlA4WAoAAAAgAAAAfwAAfwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDhUAAAAMAAAAP8QEI0AAAAgHyAQg4CARGQ5iXnORlYAAAAgFxAQnYCARGQ=',
  256: 'data:image/webp;base64,UklGRroCAABXRUJQVlA4WAoAAAAgAAAA/wAA/wAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDhUAAAAMgAAAP8QEI0AAAAgHyAQg4CARGQ5iXnORlYAAAAgFxAQnYCARGQ5iXmJRlY=',
  384: 'data:image/webp;base64,UklGRsICAABXRUJQVlA4WAoAAAAgAAAAfwEAfwEASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDhUAAAANAAAAP8QEI0AAAAgHyAQg4CARGQ5iXnORlYAAAAgFxAQnYCARGQ5iXmJRlYjFxAQmQCARGQ=',
};

/**
 * OptimizedAvatar component
 * 
 * A specialized image component for avatar/profile pictures that:
 * - Maintains a perfect circle shape
 * - Prevents CLS with fixed dimensions
 * - Provides smooth loading with blur placeholder
 * - Handles missing or errored images gracefully
 * 
 * Use this component for all user/artist avatars instead of OptimizedImage
 * or next/image directly.
 */
export function OptimizedAvatar({
  src,
  alt,
  size = 64,
  className,
  priority = false,
  quality = 90,
  fallbackSrc = '/android-chrome-192x192.png',
}: OptimizedAvatarProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const imageSrc = error || !src ? fallbackSrc : src;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800',
        className
      )}
      style={{
        width: size,
        height: size,
      }}
    >
      <Image
        src={imageSrc}
        alt={alt}
        width={size}
        height={size}
        priority={priority}
        quality={quality}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URLS[size]}
        className={cn(
          'object-cover transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        sizes={`${size}px`}
        style={{
          aspectRatio: 1, // Always square for avatars
          objectPosition: 'center',
        }}
      />

      {/* Loading shimmer effect */}
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
      )}
    </div>
  );
}

// Responsive avatar that adapts to screen size
/**
 * Props for the ResponsiveAvatar component
 * 
 * This component extends OptimizedAvatar to provide responsive sizing
 * based on screen size, preventing the need for media queries in parent components.
 */
interface ResponsiveAvatarProps extends Omit<OptimizedAvatarProps, 'size'> {
  /** Responsive sizes attribute for the image */
  sizes?: string;
  
  /** Size in pixels for mobile screens */
  mobileSize?: number;
  
  /** Size in pixels for desktop screens */
  desktopSize?: number;
}

/**
 * ResponsiveAvatar component
 * 
 * A responsive version of OptimizedAvatar that automatically adjusts size
 * based on screen width. This component:
 * - Uses CSS classes for responsive sizing
 * - Maintains all OptimizedAvatar benefits
 * - Simplifies responsive avatar implementation
 * 
 * Use this component when you need avatars that change size based on viewport.
 */
export function ResponsiveAvatar({
  src,
  alt,
  className,
  priority = false,
  quality = 90,
  fallbackSrc = '/android-chrome-192x192.png',
  sizes = '(max-width: 768px) 64px, 128px',
  desktopSize = 128,
}: ResponsiveAvatarProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const imageSrc = error || !src ? fallbackSrc : src;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800',
        'w-16 h-16 md:w-32 md:h-32', // Responsive sizing with Tailwind
        className
      )}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        priority={priority}
        quality={quality}
        placeholder="blur"
        blurDataURL={
          BLUR_DATA_URLS[desktopSize as keyof typeof BLUR_DATA_URLS] ||
          BLUR_DATA_URLS[256]
        }
        className={cn(
          'object-cover transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        sizes={sizes}
        style={{
          objectPosition: 'center',
        }}
      />

      {/* Loading shimmer effect */}
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
      )}
    </div>
  );
}
