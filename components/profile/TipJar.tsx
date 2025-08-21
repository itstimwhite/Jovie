'use client';

import { useEffect, useState } from 'react';
import { loadStripe, Stripe, PaymentRequest } from '@stripe/stripe-js';
import { TipSection } from '@/components/organisms/TipSection';

interface TipJarProps {
  handle: string;
  artistName: string;
}

const AMOUNTS = [2, 5, 10];

export function TipJar({ handle, artistName }: TipJarProps) {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
    null
  );
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    async function init() {
      const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!key) return;
      const s = await loadStripe(key);
      if (!s) return;
      const pr = s.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: { label: artistName, amount: 0 },
        requestPayerEmail: true,
        requestPayerName: true,
        requestPayerPhone: true,
      });
      const result = await pr.canMakePayment();
      if (result) {
        setSupported(true);
        setPaymentRequest(pr);
        setStripe(s);
      }
    }
    init();
  }, [artistName]);

  const handleStripePayment = async (amount: number) => {
    if (!stripe || !paymentRequest) return;

    paymentRequest.show();
    try {
      const res = await fetch('/api/create-tip-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, handle }),
      });
      if (!res.ok) throw new Error('Network response was not ok');
    } catch (err) {
      console.error('Tip failed', err);
      throw err;
    }
  };

  return (
    <TipSection
      handle={handle}
      artistName={artistName}
      amounts={AMOUNTS}
      onStripePayment={supported ? handleStripePayment : undefined}
    />
  );
}

export default TipJar;
