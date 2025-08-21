/** @type {import('next').NextConfig} */
const nextConfig = require('./next.config.js');

// Bundle analyzer configuration
const withBundleAnalyzer = (() => {
  try {
    return require('@next/bundle-analyzer')({
      enabled: process.env.ANALYZE === 'true',
      openAnalyzer: false, // Don't auto-open browser
      analyzerMode: 'static', // Generate static HTML files
      reportFilename: '../bundle-analysis.html', // Save in root directory
    });
  } catch (error) {
    console.warn('⚠️  Bundle analyzer not installed. Install with: npm install --save-dev @next/bundle-analyzer');
    return (config) => config; // Return identity function if package not found
  }
})();

module.exports = withBundleAnalyzer(nextConfig);