// Export all monitoring utilities
export * from './web-vitals';
export * from './performance';
export * from './database';
export * from './user-journey';
export * from './regression';
export * from './alerts';

// Export API and middleware monitoring with aliases to avoid conflicts
export { withPerformanceMonitoring as withApiPerformanceMonitoring } from './api';
export { withPerformanceMonitoring as withMiddlewarePerformanceMonitoring } from './middleware';

// Re-export types
export type { Metric } from 'web-vitals';
export type { AlertRule, AlertSeverity } from './alerts';

// Export a convenience function to initialize all monitoring
export function initAllMonitoring() {
  if (typeof window !== 'undefined') {
    // Initialize Web Vitals
    const { initWebVitals } = require('./web-vitals');
    initWebVitals();

    // Initialize Performance Tracking
    const { PerformanceTracker } = require('./performance');
    const performanceTracker = new PerformanceTracker();

    // Get the current page name from the URL
    const pageName = window.location.pathname;

    // Track page load performance
    performanceTracker.trackPageLoad(pageName);

    // Track resource loading
    performanceTracker.trackResourceLoad();

    // Initialize Regression Detection
    const { RegressionDetector } = require('./regression');
    const regressionDetector = new RegressionDetector();

    // Initialize Performance Alerts
    const { PerformanceAlerts } = require('./alerts');
    const performanceAlerts = new PerformanceAlerts();

    // Return the initialized trackers for further configuration
    return {
      performanceTracker,
      regressionDetector,
      performanceAlerts,
    };
  }

  return null;
}
