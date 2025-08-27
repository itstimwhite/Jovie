/**
 * Hook to get user's billing status on the client side
 */

import { useEffect, useState } from 'react';

interface BillingStatus {
  isPro: boolean;
  plan: string | null;
  hasStripeCustomer: boolean;
  loading: boolean;
  error: string | null;
}

export function useBillingStatus(): BillingStatus {
  const [status, setStatus] = useState<BillingStatus>({
    isPro: false,
    plan: null,
    hasStripeCustomer: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchBillingStatus() {
      try {
        const response = await fetch('/api/billing/status');

        if (!response.ok) {
          throw new Error('Failed to fetch billing status');
        }

        const data = await response.json();

        setStatus({
          isPro: data.isPro || false,
          plan: data.plan || null,
          hasStripeCustomer: !!data.stripeCustomerId,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching billing status:', error);
        setStatus({
          isPro: false,
          plan: null,
          hasStripeCustomer: false,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    fetchBillingStatus();
  }, []);

  return status;
}
