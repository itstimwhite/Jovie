/**
 * Billing Status API
 * Returns the current user's billing information
 */

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getUserBillingInfo } from '@/lib/stripe/customer-sync';

export async function GET() {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's billing information
    const billingResult = await getUserBillingInfo();
    if (!billingResult.success || !billingResult.data) {
      // User not found in database - they might need onboarding
      return NextResponse.json({
        isPro: false,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
      });
    }

    const { isPro, stripeCustomerId, stripeSubscriptionId } =
      billingResult.data;

    return NextResponse.json({
      isPro,
      stripeCustomerId,
      stripeSubscriptionId,
    });
  } catch (error) {
    console.error('Error getting billing status:', error);
    return NextResponse.json(
      { error: 'Failed to get billing status' },
      { status: 500 }
    );
  }
}
