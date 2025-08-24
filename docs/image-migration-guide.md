# Image Component Migration Guide

This guide provides step-by-step instructions for migrating from direct `next/image` usage to our standardized `OptimizedImage` and `OptimizedAvatar` components.

## Why Migrate?

Using our optimized image components instead of direct `next/image` imports provides several benefits:

- **Prevents CLS (Cumulative Layout Shift)** through consistent sizing and placeholders
- **Improves loading experience** with shimmer effects and blur placeholders
- **Handles errors gracefully** with fallback images
- **Optimizes for SEO** with better alt text handling
- **Ensures consistency** across the application
- **Simplifies responsive images** with predefined sizes and aspect ratios

## Migration Steps

### 1. Identify the Type of Image

First, determine which component is appropriate for your use case:

- **OptimizedImage**: For general images, content, UI elements
- **OptimizedAvatar**: For profile pictures, user avatars, circular images of people
- **ResponsiveAvatar**: For avatars that need to change size based on screen width

### 2. Replace the Import

Replace the direct `next/image` import with the appropriate component:

```diff
- import Image from 'next/image';
+ import { OptimizedImage } from '@/components/ui/OptimizedImage';
// or
+ import { OptimizedAvatar } from '@/components/ui/OptimizedAvatar';
```

### 3. Replace the Component

Replace the `Image` component with the appropriate optimized component:

```diff
- <Image
+ <OptimizedImage
    src="/path/to/image.jpg"
    alt="Description of the image"
    width={300}
    height={200}
  />
```

### 4. Map and Enhance Props

Map existing props and consider adding component-specific enhancements:

#### For OptimizedImage:

```diff
  <OptimizedImage
    src="/path/to/image.jpg"
    alt="Description of the image"
    width={300}
    height={200}
+   aspectRatio="video"  // Optional: helps prevent CLS
+   shape="rounded"      // Optional: applies border radius
+   priority={false}     // Set to true for LCP images
+   placeholder="blur"   // Default, provides smooth loading
  />
```

#### For OptimizedAvatar:

```diff
- <Image
+ <OptimizedAvatar
    src="/path/to/avatar.jpg"
    alt="Profile picture of John Doe"
-   width={64}
-   height={64}
+   size={64}           // Simplified sizing (64, 128, 256, or 384)
+   priority={false}    // Set to true for important avatars
  />
```

### 5. Consider Predefined Sizes

For `OptimizedImage`, consider using predefined sizes instead of explicit dimensions:

```diff
  <OptimizedImage
    src="/path/to/image.jpg"
    alt="Description of the image"
-   width={48}
-   height={48}
+   size="md"           // Predefined size (sm, md, lg, xl, 2xl)
+   shape="circle"      // Shape (circle, square, rounded)
  />
```

Size mappings:
- `sm`: 32×32px
- `md`: 48×48px
- `lg`: 64×64px
- `xl`: 96×96px
- `2xl`: 128×128px

### 6. Enhance SEO and Accessibility

Add SEO and accessibility enhancements:

```diff
  <OptimizedImage
    src="/path/to/image.jpg"
    alt="Description of the image"
    size="lg"
+   artistName="Taylor Swift"  // For artist-related images
+   imageType="cover"          // Type of image (avatar, profile, cover, artwork, icon)
  />
```

### 7. Test for CLS

After migration, test the component to ensure no layout shift occurs:

1. Open the page in Chrome DevTools
2. Go to Performance > Experience section
3. Look for CLS (Cumulative Layout Shift) issues
4. Verify that images load with proper placeholders

## Common Migration Patterns

### Basic Image

```diff
- import Image from 'next/image';
+ import { OptimizedImage } from '@/components/ui/OptimizedImage';

- <Image
+ <OptimizedImage
    src="/path/to/image.jpg"
    alt="Description of the image"
    width={300}
    height={200}
  />
```

### Avatar/Profile Picture

```diff
- import Image from 'next/image';
+ import { OptimizedAvatar } from '@/components/ui/OptimizedAvatar';

- <div className="rounded-full overflow-hidden h-16 w-16">
-   <Image
-     src="/path/to/avatar.jpg"
-     alt="Profile picture of John Doe"
-     width={64}
-     height={64}
-     className="object-cover"
-   />
- </div>
+ <OptimizedAvatar
+   src="/path/to/avatar.jpg"
+   alt="Profile picture of John Doe"
+   size={64}
+ />
```

### Responsive Image

```diff
- import Image from 'next/image';
+ import { OptimizedImage } from '@/components/ui/OptimizedImage';

- <Image
+ <OptimizedImage
    src="/path/to/image.jpg"
    alt="Description of the image"
    width={800}
    height={600}
    sizes="(max-width: 768px) 100vw, 800px"
+   aspectRatio="video"
  />
```

### Responsive Avatar

```diff
- import Image from 'next/image';
+ import { ResponsiveAvatar } from '@/components/ui/OptimizedAvatar';

- <div className="rounded-full overflow-hidden w-16 h-16 md:w-32 md:h-32">
-   <Image
-     src="/path/to/avatar.jpg"
-     alt="Profile picture of John Doe"
-     width={128}
-     height={128}
-     className="object-cover"
-   />
- </div>
+ <ResponsiveAvatar
+   src="/path/to/avatar.jpg"
+   alt="Profile picture of John Doe"
+   sizes="(max-width: 768px) 64px, 128px"
+ />
```

### Fill Mode

```diff
- import Image from 'next/image';
+ import { OptimizedImage } from '@/components/ui/OptimizedImage';

  <div className="relative h-64">
-   <Image
+   <OptimizedImage
      src="/path/to/image.jpg"
      alt="Description of the image"
      fill
      className="object-cover"
+     objectFit="cover"
+     objectPosition="center"
    />
  </div>
```

## Troubleshooting

### Image Appears Blurry

- Ensure you're using appropriate dimensions for the image
- Check that the source image is of sufficient quality
- Consider setting `quality={90}` or higher for important images

### Layout Shift Still Occurs

- Make sure you're specifying correct dimensions (width/height or size)
- Add an `aspectRatio` prop if the image has a known aspect ratio
- Ensure the parent container doesn't change size unexpectedly

### Image Doesn't Load

- Check that the `src` URL is correct
- Verify that the image exists at the specified path
- The component will show a fallback image automatically on error

### Need More Customization

If you need more customization than the components provide:

1. Check if you can achieve it with the existing props
2. Consider extending the component for your specific use case
3. Consult with the team before falling back to direct `next/image` usage

## Need Help?

If you encounter any issues during migration, please reach out to the UI team for assistance.

