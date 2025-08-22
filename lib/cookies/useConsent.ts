'use client';

import { useEffect, useState } from 'react';
import type { Consent } from './consent';

/**
 * Hook to access and subscribe to cookie consent changes
 * @returns Current consent state or null if not set
 */
export function useConsent(): Consent | null {
  const [consent, setConsent] = useState<Consent | null>(null);

  useEffect(() => {
    // Try to read consent from localStorage first (client-side cache)
    try {
      const stored = localStorage.getItem('jv_cc_client');
      if (stored) {
        setConsent(JSON.parse(stored));
      }
    } catch {
      // Ignore errors reading from localStorage
    }

    // Subscribe to consent changes via the global JVConsent object
    if (typeof window !== 'undefined' && window.JVConsent) {
      const unsubscribe = window.JVConsent.onChange((value) => {
        if (value && typeof value === 'object') {
          const newConsent = value as Consent;
          setConsent(newConsent);

          // Cache in localStorage for faster access on subsequent page loads
          try {
            localStorage.setItem('jv_cc_client', JSON.stringify(newConsent));
          } catch {
            // Ignore localStorage errors
          }
        }
      });

      return unsubscribe;
    }
  }, []);

  return consent;
}

// Add global type definition for the JVConsent object
declare global {
  interface Window {
    JVConsent?: {
      onChange: (cb: (v: unknown) => void) => () => void;
      _emit: (v: unknown) => void;
    };
  }
}
