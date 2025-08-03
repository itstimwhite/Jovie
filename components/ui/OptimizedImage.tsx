import Image from 'next/image';
import { useState } from 'react';
import { PlaceholderImage } from './PlaceholderImage';
import clsx from 'clsx';

interface OptimizedImageProps {
  src?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square' | 'rounded';
  className?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
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
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // If no src or error occurred, show placeholder
  if (!src || hasError) {
    return <PlaceholderImage size={size} shape={shape} className={className} />;
  }

  const containerClasses = clsx(
    'relative overflow-hidden',
    sizeClasses[size],
    shapeClasses[shape],
    className
  );

  return (
    <div className={containerClasses}>
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          className={clsx(
            'object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          priority={priority}
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
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
          className={clsx(
            'object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          priority={priority}
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
        />
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse" />
      )}
    </div>
  );
}
