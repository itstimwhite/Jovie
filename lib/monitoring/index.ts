/**
 * API Monitoring Module
 * 
 * This module provides functionality to track API metrics and send them to analytics providers.
 */

// Export the main API
export * from './api';

// Export middleware helpers
export { withApiMetrics } from './middleware-example';

// Example usage:
// 
// import { sendApiMetric } from '@/lib/monitoring';
// 
// sendApiMetric({
//   path: '/api/users',
//   method: 'GET',
//   statusCode: 200,
//   duration: 150,
//   source: 'server',
// });

