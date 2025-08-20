/**
 * Stripe Pricing Options API
 * Returns available pricing options for the frontend
 */

import { NextResponse } from 'next/server';
import { getAvailablePricing } from '@/lib/stripe/config';

export async function GET() {
  try {
    const options = getAvailablePricing();

    return NextResponse.json({
      options: options.map((option) => ({
        priceId: option.priceId,
        amount: option.amount,
        currency: option.currency,
        interval: option.interval,
        description: option.description,
        isIntroductory: option.isIntroductory,
      })),
    });
  } catch (error) {
    console.error('Error getting pricing options:', error);
    return NextResponse.json(
      { error: 'Failed to get pricing options' },
      { status: 500 }
    );
  }
}
