# Image Usage Policy

This document outlines the standards for image usage across the Jovie application to ensure consistent loading behavior, prevent Cumulative Layout Shift (CLS), and optimize for performance and accessibility.

## Core Components

### OptimizedImage

The `OptimizedImage` component is a wrapper around Next.js's `Image` component that provides:

- CLS prevention through proper sizing and aspect ratios
- Loading states with shimmer effect
- Error handling with fallback images
- SEO-friendly alt text generation
- Image versioning for cache busting
- Responsive sizing

```tsx
import { OptimizedImage } from '@/components/ui/OptimizedImage';

// Basic usage
<OptimizedImage 
  src="/path/to/image.jpg" 
  alt="Description of the image" 
  width={300} 
  height={200} 
/>

// With predefined size and shape
<OptimizedImage 
  src="/path/to/image.jpg" 
  alt="Description of the image" 
  size="md" 
  shape="rounded" 
/>

// For LCP (Largest Contentful Paint) images
<OptimizedImage 
  src="/path/to/image.jpg" 
  alt="Description of the image" 
  priority={true} 
  size="lg" 
/>
```

### OptimizedAvatar

The `OptimizedAvatar` component is specifically designed for avatar/profile pictures with:

- Fixed aspect ratio (always 1:1)
- Circular shape
- Optimized loading behavior
- Fallback for missing avatars

```tsx
import { OptimizedAvatar } from '@/components/ui/OptimizedAvatar';

// Basic usage
<OptimizedAvatar 
  src="/path/to/avatar.jpg" 
  alt="Profile picture of John Doe" 
  size={64} 
/>

// For important avatars (e.g., profile page main avatar)
<OptimizedAvatar 
  src="/path/to/avatar.jpg" 
  alt="Profile picture of John Doe" 
  size={128} 
  priority={true} 
/>

// Responsive avatar
<ResponsiveAvatar 
  src="/path/to/avatar.jpg" 
  alt="Profile picture of John Doe" 
  sizes="(max-width: 768px) 64px, 128px" 
/>
```

## When to Use Each Component

### Use OptimizedImage for:

- Content images (artwork, covers, etc.)
- UI elements that are not avatars
- Images with various aspect ratios
- Images that need specific shapes (rounded, square)

### Use OptimizedAvatar for:

- User profile pictures
- Artist avatars
- Any circular, 1:1 aspect ratio images of people

### Use ResponsiveAvatar for:

- Avatars that need to change size based on screen width
- Profile pictures in responsive layouts

## Preventing CLS (Cumulative Layout Shift)

CLS is a Core Web Vital that measures visual stability. To prevent CLS:

1. **Always specify dimensions**:
   - Use the `width` and `height` props, or
   - Use the `size` prop with predefined dimensions, or
   - Use the `aspectRatio` prop to maintain proportions

2. **Use appropriate placeholders**:
   - The default `placeholder="blur"` provides a smooth loading experience
   - Custom blur placeholders can be provided via `blurDataURL`

3. **Prioritize LCP images**:
   - Set `priority={true}` for images that are above the fold and part of the LCP

## Alt Text Guidelines

### Informative Images

For images that convey information:

- Be concise but descriptive (aim for under 125 characters)
- Focus on the purpose and content of the image
- Include artist name when relevant
- Avoid redundant phrases like "image of" or "picture of"

Examples:
- ✅ "Taylor Swift performing at Madison Square Garden"
- ✅ "Album cover for 'Midnights' by Taylor Swift"
- ❌ "Image of a singer" (too generic)
- ❌ "Picture of Taylor Swift performing at Madison Square Garden" (redundant "picture of")

### Decorative Images

For purely decorative images that don't add information:

- Use an empty alt text: `alt=""`
- This signals to screen readers to skip the image

Example:
```tsx
<OptimizedImage 
  src="/path/to/decorative-pattern.jpg" 
  alt="" 
  width={300} 
  height={200} 
/>
```

## Performance Optimization

### Image Sizing

- Use the smallest possible image size that maintains quality
- Let the component handle responsive sizing via the `sizes` prop
- Consider different aspect ratios for mobile vs. desktop when appropriate

### Priority Images

- Use `priority={true}` sparingly and only for:
  - LCP (Largest Contentful Paint) images
  - Above-the-fold hero images
  - Main content images that are immediately visible

### Lazy Loading

- All non-priority images are automatically lazy-loaded
- This improves initial page load performance

## Implementation Checklist

When adding images to a component:

- [ ] Use `OptimizedImage` or `OptimizedAvatar` instead of direct `next/image`
- [ ] Specify appropriate dimensions (width/height or size)
- [ ] Provide meaningful alt text (or empty for decorative images)
- [ ] Set `priority={true}` for LCP images
- [ ] Choose appropriate aspect ratio and shape
- [ ] Consider responsive behavior with `sizes` prop

## Migration from Direct next/image Usage

When migrating from direct `next/image` usage:

1. Import the appropriate component:
   ```tsx
   import { OptimizedImage } from '@/components/ui/OptimizedImage';
   // or
   import { OptimizedAvatar } from '@/components/ui/OptimizedAvatar';
   ```

2. Replace the `Image` component with `OptimizedImage` or `OptimizedAvatar`

3. Map the props appropriately:
   - `src`, `alt`, `width`, `height`, `priority` work the same
   - Use `size` and `shape` for predefined dimensions when appropriate
   - Add `aspectRatio` if known
   - Consider adding `artistName` and `imageType` for better SEO

4. Test the component to ensure no layout shift occurs during loading

