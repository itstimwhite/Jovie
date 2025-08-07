'use client';

import { useEffect, useState } from 'react';
import { loadStripe, Stripe, PaymentRequest } from '@stripe/stripe-js';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

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
  const [loading, setLoading] = useState<number | null>(null);

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

  const handleTip = async (amount: number) => {
    if (!stripe || !paymentRequest) return;
    setLoading(amount);
    paymentRequest.show();
    try {
      const res = await fetch('/api/create-tip-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, handle }),
      });
      if (!res.ok) throw new Error('Network response was not ok');
      window.alert(`Thanks for the $${amount} tip 🎉`);
    } catch (err) {
      console.error('Tip failed', err);
    } finally {
      setLoading(null);
    }
  };

  if (!supported) {
    return (
      <div className="text-center space-y-4">
        <Image
          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
            typeof window !== 'undefined' ? window.location.href : ''
          )}`}
          alt="Scan to tip"
          className="mx-auto h-48 w-48"
          width={192}
          height={192}
        />
        <p className="text-sm text-gray-600">Scan to tip via Apple Pay</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-3">
      {AMOUNTS.map((amount) => (
        <Button
          key={amount}
          onClick={() => handleTip(amount)}
          className="w-full"
          size="lg"
          disabled={loading !== null}
        >
          {loading === amount ? 'Processing…' : `$${amount} Tip`}
        </Button>
      ))}
      <p className="mt-2 text-center text-xs text-gray-500">
        Tips are non-refundable
      </p>
    </div>
  );
}

export default TipJar;
