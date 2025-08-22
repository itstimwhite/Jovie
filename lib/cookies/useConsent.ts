'use client';

import { useEffect, useState } from 'react';
import type { Consent } from './consent';

export function useConsent(): {
  consent: Consent | null;
  loading: boolean;
  hasAnalyticsConsent: boolean;
} {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize consent listener
    if (typeof window !== 'undefined' && window.JVConsent) {
      const unsubscribe = window.JVConsent.onChange((value) => {
        if (value && typeof value === 'object') {
          setConsent(value as Consent);
          setLoading(false);
        }
      });

      // Check for existing consent in localStorage (client-side cache)
      try {
        const storedConsent = localStorage.getItem('jv_cc_client');
        if (storedConsent) {
          const parsed = JSON.parse(storedConsent) as Consent;
          setConsent(parsed);
        }
      } catch {
        // Ignore parsing errors
      }

      // Fetch consent from server
      fetch('/api/consent')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setConsent(data);
            // Cache consent in localStorage for faster access on subsequent page loads
            try {
              localStorage.setItem('jv_cc_client', JSON.stringify(data));
            } catch {
              // Ignore storage errors
            }
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });

      return unsubscribe;
    }

    // If JVConsent is not available, mark as not loading
    setLoading(false);
    return undefined;
  }, []);

  // Helper to check if analytics consent is granted
  const hasAnalyticsConsent = Boolean(consent?.analytics);

  return { consent, loading, hasAnalyticsConsent };
}
