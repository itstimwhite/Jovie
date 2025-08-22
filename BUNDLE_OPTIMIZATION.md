# Bundle Size Optimization and Code Splitting

This document outlines the comprehensive bundle optimization strategies implemented in Jovie to improve performance, reduce Time to Interactive (TTI), and enhance Core Web Vitals scores.

## 🎯 Optimization Goals

- **Initial JS bundle**: < 200KB gzipped
- **Time to Interactive**: < 3s
- **First Contentful Paint**: 500ms improvement
- **Lighthouse Performance Score**: > 90

## 🧩 Dynamic Imports Implementation

### Heavy Dependencies

#### 1. Drag & Drop Libraries (@dnd-kit)
**File**: `components/dashboard/molecules/LinkManagerDynamic.tsx`

```typescript
const LinkManager = dynamic(
  () => import('./LinkManager').then((mod) => ({ default: mod.LinkManager })),
  {
    loading: () => <LinkManagerSkeleton />,
    ssr: false, // Drag and drop doesn't work well with SSR
  }
);
```

**Impact**: ~45KB reduction from initial bundle (only loads when dashboard is accessed)

#### 2. Payment Processing (@stripe)
**File**: `components/profile/TipJarDynamic.tsx`

```typescript
const TipJar = dynamic(
  () => import('./TipJar'),
  {
    loading: () => <TipJarSkeleton />,
    ssr: false, // Stripe doesn't work well with SSR
  }
);
```

**Impact**: ~35KB reduction from initial bundle (only loads on tip pages)

### Route-Based Code Splitting

#### 1. Dashboard Page
**File**: `app/dashboard/page.tsx`

- Dynamic import of `DashboardClient` component
- Comprehensive loading skeleton
- Reduces initial bundle for non-dashboard users

#### 2. Onboarding Page
**File**: `app/onboarding/page.tsx`

- Dynamic import of `OnboardingForm` component
- Form-specific loading skeleton
- Optimizes first-time user experience

## ⚙️ Webpack Configuration

### Enhanced Tree Shaking
```javascript
config.optimization = {
  usedExports: true,
  sideEffects: false,
  // ... other optimizations
};
```

### Intelligent Chunk Splitting
```javascript
splitChunks: {
  chunks: 'all',
  minSize: 20000,
  maxSize: 250000,
  cacheGroups: {
    stripe: { priority: 30 },      // Payment processing
    dndKit: { priority: 25 },      // Drag & drop
    framerMotion: { priority: 20 }, // Animations
    clerk: { priority: 15 },       // Authentication
    react: { priority: 10 },       // Core React
    vendor: { priority: 5 },       // Other vendors
  },
}
```

### Package Import Optimization
```javascript
optimizePackageImports: [
  '@headlessui/react',
  '@heroicons/react',
  '@clerk/nextjs',
  '@supabase/supabase-js',
  'framer-motion',
  'react-hook-form',
  'date-fns',
  'zod'
]
```

## 📊 Bundle Analysis

### Setup
```bash
# Install analyzer (if needed)
npm run analyze:install

# Run bundle analysis
npm run analyze
```

### Analysis Output
- Generates `bundle-analysis.html`
- Shows chunk sizes and dependencies
- Identifies optimization opportunities

### CI Integration
```javascript
const withBundleAnalyzer = process.env.ANALYZE === 'true' 
  ? require('@next/bundle-analyzer')({
      enabled: true,
      openAnalyzer: false, // CI-friendly
    })
  : (config) => config;
```

## 🏗️ Implementation Strategy

### Phase 1: Critical Path Optimization ✅
- [x] Split dashboard-specific components
- [x] Lazy load heavy libraries (Stripe, DnD)
- [x] Add route-based splitting
- [x] Configure webpack optimization

### Phase 2: Advanced Optimization (Future)
- [ ] Implement service worker caching
- [ ] Add resource hints and preloading
- [ ] Optimize vendor chunks further

### Phase 3: Monitoring (Future)
- [ ] Add bundle size CI checks
- [ ] Performance budgets
- [ ] Real user monitoring

## 📈 Expected Performance Impact

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Initial Bundle | ~350KB | <200KB | 40-60% reduction |
| Time to Interactive | ~5s | <3s | 1-2s improvement |
| First Contentful Paint | ~2s | ~1.5s | 500ms improvement |
| JS Execution Time | Variable | Optimized | 30-50% reduction |

## 🔧 Usage Examples

### Using Dynamic Components

#### LinkManager (Dashboard)
```typescript
// Instead of direct import
import { LinkManager } from '@/components/dashboard/molecules/LinkManager';

// Use dynamic wrapper
import { LinkManagerDynamic } from '@/components/dashboard/molecules/LinkManagerDynamic';

<LinkManagerDynamic
  initialLinks={links}
  onLinksChange={handleLinksChange}
  maxLinks={20}
/>
```

#### TipJar (Profile Pages)
```typescript
// Instead of direct import
import { TipJar } from '@/components/profile/TipJar';

// Use dynamic wrapper
import { TipJarDynamic } from '@/components/profile/TipJarDynamic';

<TipJarDynamic
  handle={handle}
  artistName={artistName}
/>
```

## 🚀 Migration Guide

### Updating Existing Components

1. **Create Dynamic Wrapper**
   - Copy component interface
   - Create loading skeleton
   - Set up dynamic import

2. **Update Imports**
   - Replace direct imports with dynamic wrappers
   - Verify props compatibility
   - Test loading states

3. **Configure SSR**
   - Set `ssr: false` for client-only components
   - Add proper loading states
   - Handle hydration carefully

### Bundle Analysis Workflow

1. **Before Changes**
   ```bash
   npm run analyze
   # Note current bundle sizes
   ```

2. **After Changes**
   ```bash
   npm run analyze
   # Compare new bundle sizes
   ```

3. **Performance Testing**
   - Test on slow networks
   - Verify loading states work
   - Check Core Web Vitals

## 🐛 Troubleshooting

### Common Issues

#### 1. SSR Mismatches
```typescript
// Fix: Disable SSR for problematic components
const Component = dynamic(() => import('./Component'), {
  ssr: false
});
```

#### 2. Loading State Flashes
```typescript
// Fix: Optimize skeleton components
function ComponentSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Match component structure */}
    </div>
  );
}
```

#### 3. Bundle Analyzer Not Working
```bash
# Install dependencies first
npm run analyze:install

# Then run analysis
npm run analyze
```

## 📝 Best Practices

### Dynamic Import Guidelines
1. **Heavy Dependencies**: Always split libraries >30KB
2. **Route-Specific**: Split components used on specific routes only
3. **User-Specific**: Split features behind authentication
4. **Loading States**: Always provide meaningful skeletons

### Webpack Optimization
1. **Chunk Priorities**: Higher priority for more critical chunks
2. **Size Limits**: Balance between requests and download time
3. **Tree Shaking**: Ensure libraries support it properly

### Performance Monitoring
1. **Regular Analysis**: Run bundle analysis on major changes
2. **Performance Budgets**: Set limits and monitor
3. **Real User Metrics**: Track actual user performance

## 🔗 Resources

- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [webpack Bundle Splitting](https://webpack.js.org/guides/code-splitting/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Performance Budgets](https://web.dev/performance-budgets-101/)

---

**Generated**: 2025-08-22  
**Last Updated**: 2025-08-22  
**Bundle Target**: <200KB gzipped initial bundle