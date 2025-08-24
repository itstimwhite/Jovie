/**
 * Server-side analytics implementation
 * This module provides server-side analytics tracking capabilities
 */

import { ANALYTICS } from '@/constants/app';

/**
 * Track a server-side event
 * @param event The event name to track
 * @param properties Optional properties to include with the event
 */
export async function trackServerEvent(
  event: string,
  properties?: Record<string, unknown>
) {
  try {
    // Determine environment
    const env = process.env.NODE_ENV || 'development';
    const isProduction = env === 'production';
    const isPreview = env === 'preview';
    const isDevelopment = env === 'development';

    // Add environment tag to properties
    const envTag = isProduction ? 'prod' : isPreview ? 'preview' : 'dev';
    const eventProperties = {
      ...(properties || {}),
      env: envTag,
      server_side: true,
    };

    // Log in development for debugging
    if (isDevelopment) {
      console.log(`[Server Analytics] ${event}`, eventProperties);
    }

    // If PostHog key is available, send the event
    if (ANALYTICS.posthogKey) {
      // In a real implementation, we would use the PostHog Node.js client
      // For now, we'll use a simple fetch to the PostHog API
      const response = await fetch('https://app.posthog.com/capture/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: ANALYTICS.posthogKey,
          event,
          properties: eventProperties,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        console.error(
          `[Server Analytics] Failed to send event ${event}:`,
          await response.text()
        );
      }
    }

    // In a production environment, you might want to:
    // 1. Use a proper PostHog Node.js client
    // 2. Implement retry logic for failed events
    // 3. Use a queue system for high-volume events
    // 4. Add more robust error handling
  } catch (error) {
    // Log error but don't throw - analytics should never break the application
    console.error('[Server Analytics] Error tracking event:', error);
  }
}
