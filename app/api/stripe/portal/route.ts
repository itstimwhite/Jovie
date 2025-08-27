/**
 * Stripe Billing Portal API
 * Creates billing portal sessions for Pro users to manage their subscriptions
 */

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { createBillingPortalSession } from '@/lib/stripe/client';
import { getUserBillingInfo } from '@/lib/stripe/customer-sync';

export async function POST() {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's billing information
    const billingResult = await getUserBillingInfo();
    if (!billingResult.success || !billingResult.data) {
      console.error('Failed to get user billing info:', billingResult.error);
      return NextResponse.json(
        { error: 'Failed to retrieve billing information' },
        { status: 500 }
      );
    }

    const { stripeCustomerId } = billingResult.data;

    // Check if user has a Stripe customer ID
    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: 'No billing account found' },
        { status: 400 }
      );
    }

    // Optionally check if user is Pro (uncomment if you want to restrict access)
    // if (!isPro) {
    //   return NextResponse.json(
    //     { error: 'Pro subscription required' },
    //     { status: 403 }
    //   );
    // }

    // Create return URL
    const baseUrl = env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const returnUrl = `${baseUrl}/dashboard`;

    // Create billing portal session
    const session = await createBillingPortalSession({
      customerId: stripeCustomerId,
      returnUrl,
    });

    // Log portal session creation
    console.log('Billing portal session created:', {
      userId,
      customerId: stripeCustomerId,
      sessionId: session.id,
      url: session.url,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating billing portal session:', error);

    // Return appropriate error based on the error type
    if (error instanceof Error) {
      if (error.message.includes('customer')) {
        return NextResponse.json(
          { error: 'Customer not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to create billing portal session' },
      { status: 500 }
    );
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
