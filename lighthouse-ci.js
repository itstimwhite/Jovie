module.exports = {
  ci: {
    collect: {
      // Collect Lighthouse reports for these URLs
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/tim',
        'http://localhost:3000/ladygaga',
      ],
      // Use desktop and mobile configurations
      settings: {
        preset: 'desktop',
      },
      // Number of runs per URL
      numberOfRuns: 3,
    },
    upload: {
      // Upload reports to temporary storage
      target: 'temporary-public-storage',
    },
    assert: {
      // Performance budgets and assertions
      assertions: {
        // Performance metrics
        'first-contentful-paint': ['error', { maxNumericValue: 1000 }], // 1s
        'largest-contentful-paint': ['error', { maxNumericValue: 1200 }], // 1.2s
        'speed-index': ['error', { maxNumericValue: 1300 }], // 1.3s
        interactive: ['error', { maxNumericValue: 1500 }], // 1.5s
        'total-blocking-time': ['error', { maxNumericValue: 200 }], // 200ms

        // Cache metrics
        'uses-long-cache-ttl': ['warn', { minScore: 0.8 }], // 80% of static assets should have long cache

        // Other important metrics
        'server-response-time': ['error', { maxNumericValue: 200 }], // 200ms TTFB
        'render-blocking-resources': ['warn', { maxLength: 2 }], // Max 2 render-blocking resources
        'unminified-javascript': ['error', { minScore: 1 }], // All JS should be minified
        'unused-javascript': ['warn', { minScore: 0.8 }], // 80% of JS should be used

        // Accessibility and best practices
        accessibility: ['warn', { minScore: 0.9 }], // 90% accessibility score
        'best-practices': ['warn', { minScore: 0.9 }], // 90% best practices score
        seo: ['warn', { minScore: 0.9 }], // 90% SEO score
      },
    },
  },
};
