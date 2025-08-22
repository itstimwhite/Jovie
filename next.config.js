/** @type {import('next').NextConfig} */
// Import performance budgets
const performanceBudgets = require('./performance-budgets.config');

const nextConfig = {
  turbopack: {},
  typescript: {
    ignoreBuildErrors: false,
  },
  output: 'standalone',
  // Disable static generation to prevent Clerk context issues during build
  trailingSlash: false,
  // Build optimizations
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [64, 96, 128, 256, 384, 400],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year for better caching
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Enable blur placeholders for better UX
    unoptimized: false,
    // CDN optimization
    loader: 'default',
    path: '/_next/image',
  },
  async headers() {
    const securityHeaders = [
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'origin-when-cross-origin',
      },
    ];
    return [
      {
        // Static assets - long-term caching with immutable
        source: '/(.*)\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|avif)$',
        headers: [
          ...securityHeaders,
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year
          },
        ],
      },
      {
        // API routes with shorter cache for dynamic content
        source: '/api/health',
        headers: [
          ...securityHeaders,
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=60', // 1 minute
          },
        ],
      },
      {
        // Profile API routes - medium caching
        source: '/api/profiles/(.*)',
        headers: [
          ...securityHeaders,
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300, stale-while-revalidate=600', // 5 minutes + SWR
          },
        ],
      },
      {
        // Ensure internal flags endpoint is never cached
        source: '/api/feature-flags',
        headers: [
          ...securityHeaders,
          {
            key: 'Cache-Control',
            value: 'no-store',
          },
        ],
      },
      {
        // Other API routes - default caching
        source: '/api/(.*)',
        headers: [
          ...securityHeaders,
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300', // 5 minutes
          },
        ],
      },
      {
        // Profile pages - edge cache with stale-while-revalidate
        source: '/([^/]+)$',
        headers: [
          ...securityHeaders,
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300, stale-while-revalidate=1800', // 5 min + 30 min SWR
          },
        ],
      },
      {
        // Exclude Vercel Flags discovery endpoint from global cache headers
        source: '/((?!\\.well-known/vercel/flags).*)',
        headers: [
          ...securityHeaders,
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
  experimental: {
    // Disable optimizeCss to avoid critters dependency issues
    // optimizeCss: true,
    optimizePackageImports: ['@headlessui/react', '@heroicons/react'],
    // Build optimizations
    // Turbopack: remove unsupported option
    // forceSwcTransforms: true,
    swcTraceProfiling: false,
    // Performance budgets (using the imported config)
    webVitalsAttribution: ['web-vital', 'element', 'largest-contentful-paint', 'layout-shift'],
    // Apply performance budgets from the imported config
    performanceBudget: performanceBudgets.budgets,
    // Enable edge runtime support
    useSwcLoader: true,
    // Cache optimization
    cacheHandlers: {
      // Enable edge caching
      edge: true,
    },
  },
  compiler: {
    // Keep console logs in Vercel Preview builds for debugging
    removeConsole:
      process.env.NODE_ENV === 'production' &&
      process.env.VERCEL_ENV !== 'preview',
  },
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Optimize bundle size
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }

    // Exclude Storybook files from production builds
    if (!dev) {
      config.module.rules.push({
        test: /\.stories\.(js|jsx|ts|tsx|mdx)$/,
        use: 'ignore-loader',
      });
    }

    return config;
  },
};

// Enable Vercel Toolbar in Next.js (local/dev)
const withVercelToolbar = require('@vercel/toolbar/plugins/next')();

module.exports = withVercelToolbar(nextConfig);
