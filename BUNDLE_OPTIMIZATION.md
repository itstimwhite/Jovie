# Bundle Size Optimization Guide

This document outlines the bundle optimization strategies implemented in the Jovie project.

## 🎯 Optimization Goals

- **Initial JS bundle**: < 200KB gzipped
- **Time to Interactive**: < 3s
- **First Contentful Paint**: 500ms improvement
- **JavaScript execution time**: 30-50% reduction

## 🛠 Implemented Optimizations

### 1. Dynamic Imports for Heavy Dependencies

#### @dnd-kit Components (Dashboard Only)
- **File**: `components/dashboard/molecules/LinkManagerDynamic.tsx`
- **Impact**: Removes drag-and-drop libraries from initial bundle
- **Usage**: Import `LinkManagerDynamic` instead of `LinkManager`

```typescript
import { LinkManagerDynamic } from '@/components/dashboard/molecules/LinkManagerDynamic';
```

#### @stripe Components (Billing Only)
- **File**: `components/profile/TipJarDynamic.tsx`
- **Impact**: Removes Stripe SDK from initial bundle
- **Usage**: Import `TipJarDynamic` instead of `TipJar`

```typescript
import { TipJarDynamic } from '@/components/profile/TipJarDynamic';
```

### 2. Route-Based Code Splitting

#### Dashboard Page
- **File**: `app/dashboard/page.tsx`
- **Change**: Dynamic import of `DashboardClient`
- **Impact**: Reduces initial load for non-dashboard pages

#### Onboarding Page
- **File**: `app/onboarding/page.tsx`
- **Change**: Dynamic import of `OnboardingForm`
- **Impact**: Smaller bundle for marketing pages

### 3. Enhanced Webpack Configuration

#### Tree Shaking
```javascript
config.optimization = {
  usedExports: true,
  sideEffects: false,
  // ... splitChunks config
};
```

#### Vendor Chunk Splitting
- **Stripe**: Separate chunk for payment processing
- **DnD Kit**: Separate chunk for drag-and-drop
- **Framer Motion**: Separate chunk for animations
- **Common**: Shared code across routes

#### Package Import Optimization
```javascript
optimizePackageImports: [
  '@headlessui/react',
  '@heroicons/react',
  '@stripe/stripe-js',
  '@dnd-kit/core',
  '@dnd-kit/sortable',
  '@dnd-kit/modifiers',
  'framer-motion'
]
```

## 📊 Bundle Analysis

### Setup Bundle Analyzer

```bash
# Install bundle analyzer
npm run analyze:install

# Or manually
npm install --save-dev @next/bundle-analyzer
npm run analyze
```

### Analysis Commands

```bash
# Analyze current bundle
npm run analyze

# Build without analysis
npm run build
```

The analyzer will generate `bundle-analysis.html` in the project root.

### Performance Budgets

You can add performance budgets to your CI/CD pipeline:

```javascript
// next.config.js
module.exports = {
  experimental: {
    performanceBudgets: [
      {
        path: '/',
        maxInitialJSSize: 200 * 1024, // 200KB
        maxTotalJSSize: 400 * 1024,   // 400KB
      }
    ]
  }
}
```

## 🎨 Loading States

All dynamic components include loading skeletons:

- **Dashboard**: Spinner with branded styling
- **LinkManager**: Form and list skeletons
- **TipJar**: Payment form skeleton
- **Onboarding**: Form loading state

## 🔄 Migration Guide

### Updating Components to Use Dynamic Versions

1. **Replace LinkManager**:
   ```typescript
   // Before
   import { LinkManager } from '@/components/dashboard/molecules/LinkManager';
   
   // After
   import { LinkManagerDynamic as LinkManager } from '@/components/dashboard/molecules/LinkManagerDynamic';
   ```

2. **Replace TipJar**:
   ```typescript
   // Before
   import { TipJar } from '@/components/profile/TipJar';
   
   // After
   import { TipJarDynamic as TipJar } from '@/components/profile/TipJarDynamic';
   ```

### Adding New Heavy Dependencies

When adding new heavy libraries (>50KB):

1. **Create a dynamic wrapper**:
   ```typescript
   import dynamic from 'next/dynamic';
   
   const HeavyComponent = dynamic(
     () => import('./HeavyComponent'),
     {
       loading: () => <LoadingSkeleton />,
       ssr: false, // If component doesn't support SSR
     }
   );
   ```

2. **Add to webpack splitting**:
   ```javascript
   // next.config.js
   heavyLib: {
     test: /[\\/]node_modules[\\/]heavy-library[\\/]/,
     name: 'heavy-library',
     chunks: 'all',
     priority: 20,
   }
   ```

3. **Add to package imports**:
   ```javascript
   optimizePackageImports: [
     // ... existing imports
     'heavy-library'
   ]
   ```

## ⚡ Performance Monitoring

### Real User Monitoring (RUM)

The app already includes Vercel Speed Insights:

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';
```

### Core Web Vitals Tracking

Monitor these metrics in production:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Lighthouse Audits

Run regular Lighthouse audits:

```bash
npx lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html
```

## 🚀 Expected Improvements

Based on the implemented optimizations:

- **Initial bundle size**: 40-60% reduction
- **Time to Interactive**: 1-2s improvement
- **First Contentful Paint**: 500ms improvement
- **JavaScript execution time**: 30-50% reduction
- **Lighthouse Performance Score**: > 90

## 🔍 Troubleshooting

### Common Issues

1. **Dynamic Import Errors**:
   - Check that the imported component has a default export
   - Ensure the import path is correct
   - Verify SSR compatibility

2. **Webpack Errors**:
   - Clear `.next` cache: `rm -rf .next`
   - Check for conflicting optimizations
   - Verify chunk splitting configuration

3. **Performance Regressions**:
   - Run bundle analysis before/after changes
   - Monitor Core Web Vitals in production
   - Use Performance tab in DevTools

### Debug Bundle Size

```bash
# Analyze specific page bundles
npx next build --debug

# Check bundle sizes
ls -la .next/static/chunks/

# Inspect specific chunks
npx webpack-bundle-analyzer .next/static/chunks/[chunk-name]
```

## 📝 Next Steps

1. **Add Performance Budgets**: Implement CI checks for bundle size
2. **Service Worker**: Add caching for repeated visits
3. **Resource Hints**: Add preload/prefetch for critical resources
4. **Image Optimization**: Further optimize image loading strategies
5. **Third-party Scripts**: Audit and optimize external scripts

## 📚 Resources

- [Next.js Bundle Analysis](https://nextjs.org/docs/advanced-features/analyzing-bundles)
- [Web.dev Performance](https://web.dev/performance/)
- [Webpack Bundle Splitting](https://webpack.js.org/guides/code-splitting/)
- [Core Web Vitals](https://web.dev/vitals/)