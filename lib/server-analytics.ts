/**
 * Server-side analytics implementation
 * This module provides server-side analytics tracking capabilities using PostHog Node.js SDK
 */

import { PostHog } from 'posthog-node';
import { ANALYTICS } from '@/constants/app';

// Initialize PostHog client (singleton)
let posthogClient: PostHog | null = null;

function getPostHogClient(): PostHog | null {
  if (!ANALYTICS.posthogKey) {
    return null;
  }

  if (!posthogClient) {
    posthogClient = new PostHog(ANALYTICS.posthogKey, {
      host: ANALYTICS.posthogHost || 'https://us.posthog.com',
      flushAt: 1, // Send events immediately in development
      flushInterval: 1000, // Flush every 1 second
    });
  }

  return posthogClient;
}

/**
 * Track a server-side event
 * @param event The event name to track
 * @param properties Optional properties to include with the event
 * @param distinctId Optional distinct ID for the user
 */
export async function trackServerEvent(
  event: string,
  properties?: Record<string, unknown>,
  distinctId?: string
) {
  try {
    // Determine environment
    const env = process.env.NODE_ENV || 'development';
    const isProduction = env === 'production';
    const isDevelopment = env === 'development';
    // Preview is a custom environment not in the standard NODE_ENV values
    const isPreview =
      env !== 'production' && env !== 'development' && env !== 'test';

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

    // Track with PostHog Node.js SDK
    const client = getPostHogClient();
    if (client) {
      await client.capture({
        distinctId: distinctId || 'anonymous',
        event,
        properties: eventProperties,
      });
    }
  } catch (error) {
    // Log error but don't throw - analytics should never break the application
    console.error('[Server Analytics] Error tracking event:', error);
  }
}

/**
 * Identify a user on the server-side
 * @param distinctId The user ID
 * @param properties Optional user properties
 */
export async function identifyServerUser(
  distinctId: string,
  properties?: Record<string, unknown>
) {
  try {
    const client = getPostHogClient();
    if (client) {
      await client.identify({
        distinctId,
        properties: {
          ...(properties || {}),
          server_side: true,
        },
      });
    }
  } catch (error) {
    console.error('[Server Analytics] Error identifying user:', error);
  }
}

/**
 * Flush any pending events (call this during graceful shutdown)
 */
export async function flushServerAnalytics() {
  try {
    const client = getPostHogClient();
    if (client) {
      await client.flush();
    }
  } catch (error) {
    console.error('[Server Analytics] Error flushing events:', error);
  }
}

/**
 * Shutdown the PostHog client (call this during graceful shutdown)
 */
export async function shutdownServerAnalytics() {
  try {
    const client = getPostHogClient();
    if (client) {
      await client.shutdown();
      posthogClient = null;
    }
  } catch (error) {
    console.error('[Server Analytics] Error shutting down client:', error);
  }
}
