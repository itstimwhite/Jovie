#!/usr/bin/env node

/**
 * CI Check for PostHog Environment Variables
 * Ensures required PostHog environment variables are configured for deployment
 */

const requiredEnvVars = ['POSTHOG_API_KEY', 'NEXT_PUBLIC_POSTHOG_PUBLIC_KEY'];

const optionalEnvVars = ['POSTHOG_HOST', 'NEXT_PUBLIC_POSTHOG_PROXY_PATH'];

console.log('🔍 Checking PostHog Environment Variables...\n');

let hasErrors = false;

// Check required variables
console.log('📋 Required Variables:');
requiredEnvVars.forEach((envVar) => {
  const value = process.env[envVar];
  if (value && value.length > 0) {
    console.log(`✅ ${envVar}: ${value.substring(0, 8)}...`);
  } else {
    console.log(`❌ ${envVar}: Missing or empty`);
    hasErrors = true;
  }
});

// Check optional variables
console.log('\n📋 Optional Variables (using defaults if not set):');
optionalEnvVars.forEach((envVar) => {
  const value = process.env[envVar];
  if (value && value.length > 0) {
    console.log(`✅ ${envVar}: ${value}`);
  } else {
    console.log(`⚠️  ${envVar}: Using default`);
  }
});

if (hasErrors) {
  console.log('\n❌ PostHog environment check failed!');
  console.log('\nRequired environment variables are missing.');
  console.log(
    'Please ensure the following are set in your deployment environment:'
  );
  console.log(
    '- POSTHOG_API_KEY: Your PostHog API key (from PostHog dashboard)'
  );
  console.log('- NEXT_PUBLIC_POSTHOG_PUBLIC_KEY: Your PostHog public key');
  console.log('\nOptional variables (will use defaults):');
  console.log(
    '- POSTHOG_HOST: PostHog instance URL (default: https://us.i.posthog.com)'
  );
  console.log('- NEXT_PUBLIC_POSTHOG_PROXY_PATH: Proxy path (default: /phx)');

  process.exit(1);
} else {
  console.log('\n✅ PostHog environment check passed!');
  process.exit(0);
}
