import { PostHog } from 'posthog-node';

const key = process.env.POSTHOG_API_KEY!;
const host = process.env.POSTHOG_HOST || 'https://us.i.posthog.com';

export const posthogServer = new PostHog(key, {
  host,
  // keep server fast & resilient
  flushAt: 20,
  flushInterval: 500,
  requestTimeout: 1500,
  featureFlagsPollingInterval: 30000,
});

export async function getServerFlag<T = boolean | string | object>(
  key: string,
  distinctId: string,
  props?: Record<string, unknown>
): Promise<T | undefined> {
  try {
    if (props) await posthogServer.identify({ distinctId, properties: props });
    const value = await posthogServer.getFeatureFlag(key, distinctId, props);
    return value as T | undefined;
  } catch {
    return undefined;
  }
}

export async function getAllServerFlags(
  distinctId: string,
  props?: Record<string, unknown>
): Promise<Record<string, boolean | string | object>> {
  try {
    if (props) await posthogServer.identify({ distinctId, properties: props });
    const flags = await posthogServer.getAllFlags(distinctId, props);
    return flags || {};
  } catch {
    return {};
  }
}

export async function identifyServerUser(
  distinctId: string,
  props: Record<string, unknown>
): Promise<void> {
  try {
    await posthogServer.identify({ distinctId, properties: props });
  } catch {
    // ignore errors in identification
  }
}
