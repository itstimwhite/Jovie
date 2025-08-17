import posthog from 'posthog-js';

const apiHost = process.env.NEXT_PUBLIC_POSTHOG_PROXY_PATH || '/phx';
const key = process.env.NEXT_PUBLIC_POSTHOG_PUBLIC_KEY!;

export function initPosthog(bootstrap?: Record<string, boolean | string>) {
  if (
    typeof window === 'undefined' ||
    (posthog as unknown as { __initialized?: boolean }).__initialized
  )
    return;

  posthog.init(key, {
    api_host: apiHost,
    loaded: (ph) => {
      (ph as unknown as { __initialized: boolean }).__initialized = true;
    },
    autocapture: false,
    capture_pageview: false,
    disable_session_recording: true,
    bootstrap: bootstrap ? { featureFlags: bootstrap } : undefined,
  });

  return posthog;
}

export function getClientFlag(key: string): boolean | string | undefined {
  if (typeof window === 'undefined') return undefined;
  return posthog.isFeatureEnabled(key);
}

export function identifyClientUser(
  distinctId: string,
  props: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;
  posthog.identify(distinctId, props);
}

export { posthog };
