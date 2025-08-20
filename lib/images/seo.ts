/**
 * SEO utilities for images - alt text generation, structured data, and accessibility
 */

import { Artist } from '@/types/db';

/**
 * Generate SEO-friendly alt text from various sources
 */
export function generateSEOAltText(
  src: string,
  context: {
    artistName?: string;
    type?: 'avatar' | 'profile' | 'cover' | 'artwork' | 'icon';
    description?: string;
    fallback?: string;
  } = {}
): string {
  const { artistName, type, description, fallback } = context;

  // If we have a description, use it
  if (description && description.trim()) {
    return description.trim();
  }

  // Generate contextual alt text based on type and artist name
  if (artistName) {
    switch (type) {
      case 'avatar':
      case 'profile':
        return `${artistName} - Profile photo`;
      case 'cover':
        return `${artistName} - Cover image`;
      case 'artwork':
        return `${artistName} - Album artwork`;
      default:
        return `${artistName} - Image`;
    }
  }

  // Try to extract meaningful info from filename
  const filename = extractFilename(src);
  if (filename) {
    const cleanName = cleanFilename(filename);
    if (cleanName && cleanName !== 'image') {
      return cleanName;
    }
  }

  // Use fallback or generic description
  return fallback || getGenericAltText(type);
}

/**
 * Extract filename from URL or path
 */
function extractFilename(src: string): string | null {
  try {
    // Handle URLs
    if (src.startsWith('http')) {
      const url = new URL(src);
      const pathname = url.pathname;
      const filename = pathname.split('/').pop();
      return filename ? decodeURIComponent(filename) : null;
    }

    // Handle relative paths
    const filename = src.split('/').pop();
    return filename || null;
  } catch {
    return null;
  }
}

/**
 * Clean and humanize filename for alt text
 */
function cleanFilename(filename: string): string {
  return (
    filename
      // Remove file extension
      .replace(/\.(jpg|jpeg|png|webp|avif|svg|gif)$/i, '')
      // Replace common separators with spaces
      .replace(/[-_]/g, ' ')
      // Remove common image prefixes/suffixes
      .replace(/^(img|image|photo|pic|picture)[\s-_]/i, '')
      .replace(/[\s-_](img|image|photo|pic|picture)$/i, '')
      // Capitalize words
      .replace(/\b\w/g, (l) => l.toUpperCase())
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * Get generic alt text based on image type
 */
function getGenericAltText(type?: string): string {
  switch (type) {
    case 'avatar':
    case 'profile':
      return 'Profile photo';
    case 'cover':
      return 'Cover image';
    case 'artwork':
      return 'Album artwork';
    case 'icon':
      return 'Icon';
    default:
      return 'Image';
  }
}

/**
 * Generate structured data for artist images
 */
export function generateImageStructuredData(
  artist: Artist,
  imageUrl: string,
  type: 'avatar' | 'cover' = 'avatar'
) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    url: imageUrl,
    description: generateSEOAltText(imageUrl, {
      artistName: artist.name,
      type,
    }),
  };

  if (type === 'avatar') {
    return {
      ...baseData,
      '@type': 'ImageObject',
      name: `${artist.name} Profile Photo`,
      author: {
        '@type': 'MusicGroup',
        name: artist.name,
        url: `https://yourapp.com/${artist.handle}`,
      },
    };
  }

  return baseData;
}

/**
 * Generate Open Graph meta tags for images
 */
export function generateOGImageMeta(
  imageUrl: string,
  context: {
    title?: string;
    description?: string;
    width?: number;
    height?: number;
    type?: string;
  } = {}
) {
  const {
    title = 'Image',
    description,
    width = 1200,
    height = 630,
    type = 'image/jpeg',
  } = context;

  return [
    { property: 'og:image', content: imageUrl },
    { property: 'og:image:alt', content: description || title },
    { property: 'og:image:width', content: width.toString() },
    { property: 'og:image:height', content: height.toString() },
    { property: 'og:image:type', content: type },
    // Twitter Card
    { name: 'twitter:image', content: imageUrl },
    { name: 'twitter:image:alt', content: description || title },
  ];
}

/**
 * Validate alt text for accessibility compliance
 */
export function validateAltText(
  altText: string,
  context: { isDecorative?: boolean; maxLength?: number } = {}
): {
  isValid: boolean;
  warnings: string[];
  suggestions: string[];
} {
  const { isDecorative = false, maxLength = 125 } = context;
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Decorative images should have empty alt text
  if (isDecorative) {
    if (altText.trim() !== '') {
      warnings.push('Decorative images should have empty alt text');
      suggestions.push('Use empty alt="" for purely decorative images');
    }
    return { isValid: warnings.length === 0, warnings, suggestions };
  }

  // Non-decorative images should have meaningful alt text
  if (!altText || altText.trim() === '') {
    warnings.push('Alt text is required for content images');
    suggestions.push('Add descriptive alt text that conveys the image content');
    return { isValid: false, warnings, suggestions };
  }

  const cleanAlt = altText.trim();

  // Length check
  if (cleanAlt.length > maxLength) {
    warnings.push(
      `Alt text is too long (${cleanAlt.length} chars, max ${maxLength})`
    );
    suggestions.push('Keep alt text concise and under 125 characters');
  }

  // Redundant phrases check
  const redundantPhrases = [
    'image of',
    'picture of',
    'photo of',
    'graphic of',
    'screenshot of',
    'icon of',
  ];

  const lowerAlt = cleanAlt.toLowerCase();
  for (const phrase of redundantPhrases) {
    if (lowerAlt.includes(phrase)) {
      warnings.push(`Avoid redundant phrases like "${phrase}"`);
      suggestions.push(
        "Remove redundant phrases - screen readers already announce it's an image"
      );
      break;
    }
  }

  // Generic alt text check
  const genericTexts = ['image', 'photo', 'picture', 'graphic', 'img'];
  if (genericTexts.includes(lowerAlt)) {
    warnings.push('Alt text is too generic');
    suggestions.push('Provide specific, descriptive alt text');
  }

  return {
    isValid: warnings.length === 0,
    warnings,
    suggestions,
  };
}

/**
 * Generate filename for SEO (for downloaded/saved images)
 */
export function generateSEOFilename(
  originalUrl: string,
  context: {
    artistName?: string;
    type?: string;
    index?: number;
  } = {}
): string {
  const { artistName, type, index } = context;

  // Get original extension
  const originalExt = getImageExtension(originalUrl) || 'jpg';

  // Build filename parts
  const parts: string[] = [];

  if (artistName) {
    parts.push(slugify(artistName));
  }

  if (type) {
    parts.push(slugify(type));
  }

  if (typeof index === 'number') {
    parts.push(index.toString().padStart(2, '0'));
  }

  // If no parts, use generic name
  if (parts.length === 0) {
    parts.push('image');
  }

  return `${parts.join('-')}.${originalExt}`;
}

/**
 * Extract file extension from URL
 */
function getImageExtension(url: string): string | null {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.([a-zA-Z0-9]+)$/);
    return match ? match[1].toLowerCase() : null;
  } catch {
    const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    return match ? match[1].toLowerCase() : null;
  }
}

/**
 * Create URL-safe slug from text
 */
function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      // Replace spaces and special chars with hyphens
      .replace(/[^a-z0-9]+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '')
      // Limit length
      .substring(0, 50)
  );
}

/**
 * Generate caption for images with accessibility in mind
 */
export function generateAccessibleCaption(context: {
  artistName?: string;
  description?: string;
  location?: string;
  date?: string;
  credits?: string;
}): string {
  const { artistName, description, location, date, credits } = context;

  const parts: string[] = [];

  if (description) {
    parts.push(description);
  }

  if (artistName && !description?.includes(artistName)) {
    parts.push(`featuring ${artistName}`);
  }

  if (location) {
    parts.push(`taken in ${location}`);
  }

  if (date) {
    parts.push(`from ${date}`);
  }

  if (credits) {
    parts.push(`Photo credit: ${credits}`);
  }

  return parts.join(', ');
}
