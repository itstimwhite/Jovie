'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PlaceholderImage } from './PlaceholderImage';
import { cn } from '@/lib/utils';
import { generateSEOAltText } from '@/lib/images/seo';
import { versionImageUrl } from '@/lib/images/versioning';

/**
 * Props for the OptimizedImage component
 * 
 * This component wraps next/image with additional features to prevent CLS,
 * handle loading states, provide fallbacks, and optimize for SEO.
 */
interface OptimizedImageProps {
  /** Image source URL (required unless using as a placeholder) */
  src?: string | null;
  
  /** Alt text for the image (required for accessibility) 
   * Use empty string "" for purely decorative images */
  alt: string;
  
  /** Predefined size options with corresponding dimensions */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  /** Shape of the image container */
  shape?: 'circle' | 'square' | 'rounded';
  
  /** Additional CSS classes */
  className?: string;
  
  /** Set to true for LCP (Largest Contentful Paint) images
   * This improves performance metrics by prioritizing the image load */
  priority?: boolean;
  
  /** Whether to use layout="fill" (requires parent to have position: relative) */
  fill?: boolean;
  
  /** Custom width in pixels (overrides size prop) */
  width?: number;
  
  /** Custom height in pixels (overrides size prop) */
  height?: number;
  
  /** Image quality (1-100) */
  quality?: number;
  
  /** Aspect ratio for the image (prevents CLS) */
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide' | number;
  
  /** Object-fit property for the image */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  
  /** Object-position property for the image */
  objectPosition?: string;
  
  /** Responsive sizes attribute for the image */
  sizes?: string;
  
  /** Placeholder type during loading */
  placeholder?: 'blur' | 'empty';
  
  /** Custom blur data URL (base64 encoded) */
  blurDataURL?: string;
  
  /** Fallback image to show on error */
  fallbackSrc?: string;
  
  /** Skip image optimization (not recommended) */
  unoptimized?: boolean;
  
  // SEO and accessibility
  /** Artist name for SEO alt text generation */
  artistName?: string;
  
  /** Type of image for SEO alt text generation */
  imageType?: 'avatar' | 'profile' | 'cover' | 'artwork' | 'icon';
  
  /** Enable cache-busting versioning for the image URL */
  enableVersioning?: boolean;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
  '2xl': 'h-32 w-32',
};

const shapeClasses = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-lg',
};

// Pre-generated blur placeholders for crisp loading states
const BLUR_PLACEHOLDERS = {
  square:
    'data:image/webp;base64,UklGRoQCAABXRUJQVlA4WAoAAAAgAAAAPwAAPwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAaSQBuAGMALgAgADIAMAAxADZWUDhUAAAALwAAAP8QEI0AAAAgHyAQg4CARGQ=',
  video:
    'data:image/webp;base64,UklGRnoCAABXRUJQVlA4WAoAAAAgAAAATwAAOQAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAaSQBuAGMALgAgADIAMAAxADZWUDhUAAAAKwAAAP8QEI0AAAAgHyAQg4CARGQ5iQ==',
  portrait:
    'data:image/webp;base64,UklGRnICAABXRUJQVlA4WAoAAAAgAAAAOQAATwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAaSQBuAGMALgAgADIAMAAxADZWUDhUAAAAKwAAAP8QEI0AAAAgHyAQg4CARGQ5iXnORlY=',
  wide: 'data:image/webp;base64,UklGRnoCAABXRUJQVlA4WAoAAAAgAAAAfwAAOQAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAaSQBuAGMALgAgADIAMAExADZWUDhUAAAAKwAAAP8QEI0AAAAgHyAQg4CARGQ5iXnORlYjFxAQ',
};

// Utility functions for enhanced image handling
function getAspectRatioValue(
  aspectRatio: OptimizedImageProps['aspectRatio']
): number | undefined {
  if (typeof aspectRatio === 'number') return aspectRatio;

  switch (aspectRatio) {
    case 'square':
      return 1;
    case 'video':
      return 16 / 9;
    case 'portrait':
      return 4 / 5;
    case 'wide':
      return 21 / 9;
    default:
      return undefined;
  }
}

function getBlurPlaceholder(
  aspectRatio: OptimizedImageProps['aspectRatio']
): string {
  if (typeof aspectRatio === 'number') return BLUR_PLACEHOLDERS.square;
  return (
    BLUR_PLACEHOLDERS[aspectRatio as keyof typeof BLUR_PLACEHOLDERS] ||
    BLUR_PLACEHOLDERS.square
  );
}

function generateAltText(
  src: string,
  fallback: string,
  artistName?: string,
  imageType?: string
): string {
  return generateSEOAltText(src, {
    artistName,
    type: imageType as 'avatar' | 'profile' | 'cover' | 'artwork' | 'icon',
    fallback,
  });
}

/**
 * OptimizedImage component
 * 
 * A wrapper around next/image that provides:
 * - CLS prevention through proper sizing and aspect ratios
 * - Loading states with shimmer effect
 * - Error handling with fallback images
 * - SEO-friendly alt text generation
 * - Image versioning for cache busting
 * - Responsive sizing
 * 
 * Use this component instead of next/image directly to ensure consistent
 * image loading behavior and prevent layout shifts.
 */
export function OptimizedImage({
  src,
  alt,
  size = 'md',
  shape = 'circle',
  className,
  priority = false,
  fill = false,
  width,
  height,
  quality = 90,
  aspectRatio,
  objectFit = 'cover',
  objectPosition = 'center',
  sizes,
  placeholder = 'blur',
  blurDataURL,
  fallbackSrc = '/android-chrome-192x192.png',
  unoptimized = false,
  artistName,
  imageType,
  enableVersioning = true,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  let imageSrc = hasError || !src ? fallbackSrc : src;

  // Apply versioning for cache busting if enabled
  if (enableVersioning && imageSrc && !imageSrc.includes('/android-chrome-')) {
    imageSrc = versionImageUrl(imageSrc);
  }

  const computedAlt = generateAltText(imageSrc, alt, artistName, imageType);
  const aspectRatioValue = getAspectRatioValue(aspectRatio);
  const defaultBlur = blurDataURL || getBlurPlaceholder(aspectRatio);

  // If no src or error occurred and no fallback, show placeholder
  if (!imageSrc) {
    return <PlaceholderImage size={size} shape={shape} className={className} />;
  }

  // Generate intelligent sizes if not provided
  const defaultSizes =
    !sizes && !fill
      ? `(max-width: 640px) ${size === 'sm' ? '32px' : size === 'md' ? '48px' : size === 'lg' ? '64px' : size === 'xl' ? '96px' : '128px'}, ${size === 'sm' ? '32px' : size === 'md' ? '48px' : size === 'lg' ? '64px' : size === 'xl' ? '96px' : '128px'}`
      : sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';

  const containerClasses = cn(
    'relative overflow-hidden',
    !fill && sizeClasses[size],
    shapeClasses[shape],
    className
  );

  const imageProps = {
    src: imageSrc,
    alt: computedAlt,
    priority,
    quality,
    placeholder: placeholder as 'blur' | 'empty',
    ...(placeholder === 'blur' && { blurDataURL: defaultBlur }),
    ...(priority && { fetchPriority: 'high' as const }),
    className: cn(
      'transition-opacity duration-300',
      isLoading ? 'opacity-0' : 'opacity-100'
    ),
    onLoad: () => setIsLoading(false),
    onError: () => setHasError(true),
    style: {
      objectFit,
      objectPosition,
      ...(aspectRatioValue && { aspectRatio: aspectRatioValue }),
    },
    unoptimized,
  };

  return (
    <div className={containerClasses}>
      {fill ? (
        <Image {...imageProps} alt={computedAlt} fill sizes={defaultSizes} />
      ) : (
        <Image
          {...imageProps}
          alt={computedAlt}
          width={
            width ||
            (size === 'sm'
              ? 32
              : size === 'md'
                ? 48
                : size === 'lg'
                  ? 64
                  : size === 'xl'
                    ? 96
                    : 128)
          }
          height={
            height ||
            (size === 'sm'
              ? 32
              : size === 'md'
                ? 48
                : size === 'lg'
                  ? 64
                  : size === 'xl'
                    ? 96
                    : 128)
          }
          sizes={defaultSizes}
        />
      )}

      {/* Enhanced loading skeleton with shimmer */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse" />
      )}
    </div>
  );
}
