// Statsig configuration for Jovie
// This file helps configure Statsig for Vercel deployment

module.exports = {
  // Statsig project configuration
  project: {
    name: 'jovie',
    environment: process.env.NODE_ENV || 'development',
  },

  // Feature flags configuration
  featureFlags: {
    // Waitlist feature
    waitlist_enabled: {
      name: 'Waitlist Enabled',
      description: 'Controls whether the waitlist feature is enabled',
      defaultValue: false,
    },

    // Artist search feature
    artist_search_enabled: {
      name: 'Artist Search Enabled',
      description: 'Controls whether the artist search feature is enabled',
      defaultValue: true,
    },

    // Debug banner feature
    debug_banner_enabled: {
      name: 'Debug Banner Enabled',
      description: 'Controls whether the debug banner is shown',
      defaultValue: false,
    },

    // Tip promotion feature
    tip_promo_enabled: {
      name: 'Tip Promotion Enabled',
      description: 'Controls whether tip promotion features are enabled',
      defaultValue: true,
    },
  },

  // Vercel integration settings
  vercel: {
    // Use Vercel Edge Config for feature flags
    useEdgeConfig: true,

    // Environment variables
    envVars: {
      NEXT_PUBLIC_STATSIG_CLIENT_KEY:
        process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY,
      STATSIG_SERVER_API_KEY: process.env.STATSIG_SERVER_API_KEY,
    },
  },
};
