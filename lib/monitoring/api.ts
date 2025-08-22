/**
 * API Monitoring Module
 * 
 * This module provides functionality to track API metrics and send them to analytics providers.
 * It respects privacy settings and can be feature-flagged for emergency disabling.
 */

import posthog from 'posthog-js';
import { ANALYTICS } from '@/constants/app';

// Type definition for API metrics data
export interface ApiMetricData {
  // Required fields
  path: string;
  method: string;
  statusCode: number;
  duration: number; // in milliseconds
  
  // Optional fields
  size?: number;
  error?: string;
  cached?: boolean;
  source?: 'server' | 'client' | 'middleware';
  
  // Additional metadata (must not contain PII)
  metadata?: Record<string, unknown>;
}

// Feature flag to control API metrics collection
const API_METRICS_FLAG = 'feature_api_metrics';

/**
 * Sends API metrics to the configured analytics provider(s)
 * 
 * @param data The API metric data to send
 * @returns A promise that resolves when the metric has been sent
 */
export async function sendApiMetric(data: ApiMetricData): Promise<void> {
  try {
    // Check if API metrics are enabled via feature flag
    if (!isApiMetricsEnabled()) {
      return;
    }

    // Sanitize data to ensure no PII is included
    const sanitizedData = sanitizeMetricData(data);

    // Send to PostHog if configured
    if (typeof window !== 'undefined' && ANALYTICS.posthogKey) {
      posthog.capture('api_request', sanitizedData);
    }

    // Server-side analytics via fetch to ingestion endpoint
    // This allows metrics to be collected even when client-side analytics are blocked
    if (typeof window === 'undefined') {
      await sendServerSideMetric(sanitizedData);
    }

    // Log metrics in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.debug('[API Metrics]', sanitizedData);
    }
  } catch (error) {
    // Silent fail - metrics collection should never break the application
    console.warn('[API Metrics] Failed to send metric:', error);
  }
}

/**
 * Checks if API metrics collection is enabled
 */
function isApiMetricsEnabled(): boolean {
  // Check for feature flag if in browser context
  if (typeof window !== 'undefined' && ANALYTICS.posthogKey) {
    try {
      // Check if explicitly disabled via feature flag
      const isDisabled = posthog.isFeatureEnabled && 
        posthog.isFeatureEnabled(API_METRICS_FLAG) === false;
      
      return !isDisabled;
    } catch {
      // Default to enabled if feature flag check fails
      return true;
    }
  }
  
  // Default to enabled for server-side
  return true;
}

/**
 * Sanitizes metric data to ensure no PII is included
 */
function sanitizeMetricData(data: ApiMetricData): Record<string, unknown> {
  // Create a clean copy of the data
  const sanitized: Record<string, unknown> = {
    path: sanitizePath(data.path),
    method: data.method,
    status_code: data.statusCode,
    duration_ms: data.duration,
    source: data.source || 'server',
  };

  // Add optional fields if present
  if (data.size !== undefined) sanitized.size_bytes = data.size;
  if (data.cached !== undefined) sanitized.cached = data.cached;
  
  // Add error information without sensitive details
  if (data.error) {
    sanitized.error = true;
    sanitized.error_type = getErrorType(data.error);
  }

  // Add sanitized metadata if present
  if (data.metadata && typeof data.metadata === 'object') {
    // Filter out any potentially sensitive fields
    const safeMetadata = Object.entries(data.metadata)
      .filter(([key]) => !isSensitiveField(key))
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {} as Record<string, unknown>);
    
    sanitized.metadata = safeMetadata;
  }

  return sanitized;
}

/**
 * Sanitizes a path to remove potential PII
 */
function sanitizePath(path: string): string {
  // Replace potential PII in URL paths with placeholders
  // Example: /api/users/123 -> /api/users/:id
  return path.replace(/\/[a-f0-9]{8,}(?=\/|$)/gi, '/:id')
    .replace(/\/\d+(?=\/|$)/g, '/:id')
    .replace(/\/[^\/]+@[^\/]+(?=\/|$)/g, '/:email');
}

/**
 * Extracts a generic error type from an error message
 */
function getErrorType(error: string): string {
  // Extract the error type without specific details
  if (error.includes('Unauthorized')) return 'auth_error';
  if (error.includes('Not Found')) return 'not_found';
  if (error.includes('Validation')) return 'validation_error';
  if (error.includes('Timeout')) return 'timeout';
  if (error.includes('Rate Limit')) return 'rate_limit';
  return 'unknown_error';
}

/**
 * Checks if a field name might contain sensitive information
 */
function isSensitiveField(field: string): boolean {
  const sensitivePatterns = [
    'token', 'key', 'secret', 'password', 'auth', 
    'credential', 'private', 'ssn', 'email', 'phone',
    'address', 'name', 'user', 'account', 'session'
  ];
  
  return sensitivePatterns.some(pattern => 
    field.toLowerCase().includes(pattern)
  );
}

/**
 * Sends metrics to a server-side endpoint
 */
async function sendServerSideMetric(sanitizedData: Record<string, unknown>): Promise<void> {
  // Implementation would depend on your server-side analytics setup
  // This could be a direct call to PostHog server SDK, a custom endpoint, etc.
  
  // Example implementation (commented out as it depends on your specific setup):
  /*
  try {
    await fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitizedData),
    });
  } catch (error) {
    // Silent fail
    console.warn('[API Metrics] Failed to send server-side metric:', error);
  }
  */
}

