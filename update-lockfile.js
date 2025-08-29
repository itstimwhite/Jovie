#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');

console.log('Updating pnpm lockfile...');

// Remove the lockfile to force regeneration
if (fs.existsSync('pnpm-lock.yaml')) {
  fs.unlinkSync('pnpm-lock.yaml');
  console.log('Removed existing lockfile');
}

// Regenerate lockfile
try {
  execSync('pnpm install --lockfile-only', { stdio: 'inherit' });
  console.log('Successfully regenerated pnpm-lock.yaml');
} catch (error) {
  console.error('Failed to regenerate lockfile:', error.message);
  process.exit(1);
}