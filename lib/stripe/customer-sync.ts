/**
 * Customer Sync Functionality
 * Ensures Stripe customers exist for authenticated users and keeps data synchronized
 */

import 'server-only';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase-server';
import { getOrCreateCustomer } from './client';

/**
 * Ensure a Stripe customer exists for the current user
 * This should be called on any authenticated server action that needs billing
 */
export async function ensureStripeCustomer(): Promise<{
  success: boolean;
  customerId?: string;
  error?: string;
}> {
  try {
    // Get the current user from Clerk
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    // Get user details from our database
    const supabase = createServerClient();
    if (!supabase) {
      return { success: false, error: 'Database connection failed' };
    }

    const { data: userData, error: userError } = await supabase
      .from('app_users')
      .select('id, email, stripe_customer_id')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return { success: false, error: 'User not found in database' };
    }

    // If we already have a Stripe customer ID, return it
    if (userData.stripe_customer_id) {
      return { success: true, customerId: userData.stripe_customer_id };
    }

    // Create a new Stripe customer
    const customer = await getOrCreateCustomer(userId, userData.email);

    // Update our database with the new customer ID
    const { error: updateError } = await supabase
      .from('app_users')
      .update({
        stripe_customer_id: customer.id,
        billing_updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error(
        'Failed to update user with Stripe customer ID:',
        updateError
      );
      // Customer was created in Stripe but we couldn't save the ID
      // This is recoverable - we can find the customer later by metadata
      return { success: true, customerId: customer.id };
    }

    return { success: true, customerId: customer.id };
  } catch (error) {
    console.error('Error ensuring Stripe customer:', error);
    return { success: false, error: 'Failed to create or retrieve customer' };
  }
}

/**
 * Get the current user's billing information
 */
export async function getUserBillingInfo(): Promise<{
  success: boolean;
  data?: {
    userId: string;
    email: string;
    isPro: boolean;
    plan: string | null;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
  };
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    const supabase = createServerClient();
    if (!supabase) {
      return { success: false, error: 'Database connection failed' };
    }

    const { data: userData, error: userError } = await supabase
      .from('app_users')
      .select(
        'id, email, is_pro, plan, stripe_customer_id, stripe_subscription_id'
      )
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return { success: false, error: 'User not found' };
    }

    return {
      success: true,
      data: {
        userId: userData.id,
        email: userData.email,
        isPro: userData.is_pro,
        plan: userData.plan,
        stripeCustomerId: userData.stripe_customer_id,
        stripeSubscriptionId: userData.stripe_subscription_id,
      },
    };
  } catch (error) {
    console.error('Error getting user billing info:', error);
    return { success: false, error: 'Failed to retrieve billing information' };
  }
}

/**
 * Update user's billing status in the database
 * Called from webhooks when subscription status changes
 */
export async function updateUserBillingStatus({
  userId,
  isPro,
  plan,
  stripeCustomerId,
  stripeSubscriptionId,
}: {
  userId: string;
  isPro: boolean;
  plan: string | null;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string | null;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerClient();
    if (!supabase) {
      return { success: false, error: 'Database connection failed' };
    }

    const updateData: Record<string, unknown> = {
      is_pro: isPro,
      plan: plan,
      billing_updated_at: new Date().toISOString(),
    };

    if (stripeCustomerId) {
      updateData.stripe_customer_id = stripeCustomerId;
    }

    if (stripeSubscriptionId !== undefined) {
      updateData.stripe_subscription_id = stripeSubscriptionId;
    }

    const { error } = await supabase
      .from('app_users')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.error('Failed to update user billing status:', error);
      return { success: false, error: 'Database update failed' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating user billing status:', error);
    return { success: false, error: 'Failed to update billing status' };
  }
}

/**
 * Check if the current user has pro features
 * Quick utility for server-side feature gates
 */
export async function userHasProFeatures(): Promise<boolean> {
  const billing = await getUserBillingInfo();
  return billing.success && billing.data?.isPro === true;
}

/**
 * Check if the current user has advanced features (full pro plan)
 */
export async function userHasAdvancedFeatures(): Promise<boolean> {
  const billing = await getUserBillingInfo();
  return billing.success && billing.data?.plan === 'pro';
}
