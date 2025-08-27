import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';

// Load environment variables from .env.test if it exists
dotenv.config({ path: '.env.test' });

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    exclude: ['tests/e2e/**', 'tests/performance/**', 'node_modules/**'],
    // Global test timeout (in milliseconds) - increased for database operations
    testTimeout: 30000,
    // Use forks pool to prevent JS heap OOM in worker threads
    pool: 'forks',
    // Coverage optimization
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'tests/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
        '.next/**',
        'dist/**',
      ],
    },
    // Test timeout - increased for database operations
    testTimeout: 30000,
    hookTimeout: 30000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  // Build optimizations
  build: {
    target: 'esnext',
    minify: false,
  },
});
