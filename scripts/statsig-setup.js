#!/usr/bin/env node

/**
 * Statsig Setup Script for Jovie
 * This script helps set up and manage Statsig feature flags
 */

const { execSync } = require('child_process');

console.log('🚀 Statsig Setup for Jovie');
console.log('===========================\n');

// Check if Statsig CLI is available
try {
  execSync('npx @statsig/siggy --version', { stdio: 'pipe' });
  console.log('✅ Statsig CLI is available');
} catch {
  console.log('❌ Statsig CLI not found. Installing...');
  try {
    execSync('npm install -g @statsig/siggy', { stdio: 'inherit' });
    console.log('✅ Statsig CLI installed');
  } catch {
    console.log('❌ Failed to install Statsig CLI');
    console.log('You can install it manually: npm install -g @statsig/siggy');
  }
}

// Check environment variables
console.log('\n📋 Environment Variables Check:');
const requiredEnvVars = [
  'NEXT_PUBLIC_STATSIG_CLIENT_KEY',
  'STATSIG_SERVER_API_KEY',
];

requiredEnvVars.forEach((envVar) => {
  const value = process.env[envVar];
  if (value) {
    console.log(`✅ ${envVar}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${envVar}: Not set`);
  }
});

// Feature flags configuration
const featureFlags = {
  waitlist_enabled: {
    name: 'Waitlist Enabled',
    description: 'Controls whether the waitlist feature is enabled',
    defaultValue: false,
  },
  artist_search_enabled: {
    name: 'Artist Search Enabled',
    description: 'Controls whether the artist search feature is enabled',
    defaultValue: true,
  },
  debug_banner_enabled: {
    name: 'Debug Banner Enabled',
    description: 'Controls whether the debug banner is shown',
    defaultValue: false,
  },
  tip_promo_enabled: {
    name: 'Tip Promotion Enabled',
    description: 'Controls whether tip promotion features are enabled',
    defaultValue: true,
  },
};

console.log('\n🎛️  Feature Flags Configuration:');
Object.entries(featureFlags).forEach(([key, config]) => {
  console.log(`  • ${key}: ${config.name} (default: ${config.defaultValue})`);
});

console.log('\n📝 Next Steps:');
console.log('1. Set up your Statsig project at https://console.statsig.com');
console.log(
  '2. Create the feature flags listed above in your Statsig dashboard'
);
console.log('3. Update your environment variables with the correct API keys');
console.log('4. Test the feature flags in your application');

console.log('\n🔧 Available Commands:');
console.log('  • npx @statsig/siggy --help');
console.log('  • npm run dev (to test locally)');
console.log('  • npm run build (to build for production)');

console.log('\n✨ Statsig setup complete!');
