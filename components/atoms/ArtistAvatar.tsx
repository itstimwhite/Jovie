'use client';

import { OptimizedImage } from '@/components/ui/OptimizedImage';

export interface ArtistAvatarProps {
  src: string;
  alt: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  priority?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { width: 112, height: 112, className: 'size-28' },
  md: { width: 160, height: 160, className: 'size-40' },
  lg: { width: 192, height: 192, className: 'size-48' },
  xl: { width: 224, height: 224, className: 'size-56' },
};

export function ArtistAvatar({
  src,
  alt,
  name,
  size = 'md',
  priority = false,
  className = '',
}: ArtistAvatarProps) {
  const { width, height, className: sizeClass } = sizeMap[size];

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      aspectRatio="square"
      objectFit="cover"
      objectPosition="center"
      priority={priority}
      quality={85}
      placeholder="blur"
      sizes={`(max-width: 768px) ${width}px, ${width}px`}
      className={`${sizeClass} ring-1 ring-black/10 dark:ring-white/15 shadow-lg group-hover:ring-white/25 ${className}`}
      shape="circle"
      artistName={name}
      imageType="avatar"
      enableVersioning={true}
    />
  );
}
