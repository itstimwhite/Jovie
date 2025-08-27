/**
 * Stripe Webhooks Handler
 * Handles subscription events and updates user billing status
 * Webhooks are the source of truth for billing status
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/client';
import { updateUserBillingStatus } from '@/lib/stripe/customer-sync';
import { getPlanFromPriceId } from '@/lib/stripe/config';
import { env } from '@/lib/env';
import { revalidatePath } from 'next/cache';

const webhookSecret = env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      console.error('Invalid webhook signature:', error);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('Received webhook event:', {
      type: event.type,
      id: event.id,
    });

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(
          event.data.object as Stripe.Subscription
        );
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log('Unhandled webhook event type:', event.type);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('Processing checkout completion:', {
      sessionId: session.id,
      customerId: session.customer,
      subscriptionId: session.subscription,
    });

    const userId = session.metadata?.clerk_user_id;
    if (!userId) {
      console.error('No user ID in checkout session metadata');
      return;
    }

    // Get subscription details to determine the plan
    if (session.subscription && typeof session.subscription === 'string') {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription
      );
      await processSubscription(subscription, userId);
    }

    // Revalidate dashboard to show updated billing status
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Error handling checkout completion:', error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    console.log('Processing subscription creation:', {
      subscriptionId: subscription.id,
      customerId: subscription.customer,
      status: subscription.status,
    });

    const userId = subscription.metadata?.clerk_user_id;
    if (!userId) {
      console.error('No user ID in subscription metadata');
      return;
    }

    await processSubscription(subscription, userId);
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Error handling subscription creation:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    console.log('Processing subscription update:', {
      subscriptionId: subscription.id,
      customerId: subscription.customer,
      status: subscription.status,
    });

    const userId = subscription.metadata?.clerk_user_id;
    if (!userId) {
      console.error('No user ID in subscription metadata');
      return;
    }

    await processSubscription(subscription, userId);
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    console.log('Processing subscription deletion:', {
      subscriptionId: subscription.id,
      customerId: subscription.customer,
    });

    const userId = subscription.metadata?.clerk_user_id;
    if (!userId) {
      console.error('No user ID in subscription metadata');
      return;
    }

    // User is no longer pro
    const result = await updateUserBillingStatus({
      clerkUserId: userId,
      isPro: false,
      stripeSubscriptionId: null,
    });

    if (result.success) {
      console.log('User downgraded to free plan:', { userId });
    } else {
      console.error('Failed to downgrade user:', result.error);
    }

    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const raw = invoice as unknown as Record<string, unknown>;
    const subField = raw['subscription'];
    const subscriptionId =
      typeof subField === 'string'
        ? subField
        : subField && typeof subField === 'object' && 'id' in subField
          ? (subField as Stripe.Subscription).id
          : null;

    console.log('Processing successful payment:', {
      invoiceId: invoice.id,
      customerId: invoice.customer,
      subscriptionId,
    });

    // If this is for a subscription, ensure the user's status is up to date
    if (subscriptionId && typeof subscriptionId === 'string') {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const userId = subscription.metadata?.clerk_user_id;

      if (userId) {
        await processSubscription(subscription, userId);
        revalidatePath('/dashboard');
      }
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const raw = invoice as unknown as Record<string, unknown>;
    const subField = raw['subscription'];
    const subscriptionId =
      typeof subField === 'string'
        ? subField
        : subField && typeof subField === 'object' && 'id' in subField
          ? (subField as Stripe.Subscription).id
          : null;

    console.log('Processing failed payment:', {
      invoiceId: invoice.id,
      customerId: invoice.customer,
      subscriptionId,
    });

    // Log payment failure for monitoring
    // Could implement retry logic or user notifications here
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function processSubscription(
  subscription: Stripe.Subscription,
  userId: string
) {
  try {
    // Determine if subscription is active
    const isActive =
      subscription.status === 'active' || subscription.status === 'trialing';

    if (!isActive) {
      // Subscription is not active, downgrade user
      const result = await updateUserBillingStatus({
        clerkUserId: userId,
        isPro: false,
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: null,
      });

      if (result.success) {
        console.log('User subscription inactive, downgraded:', {
          userId,
          status: subscription.status,
        });
      }
      return;
    }

    // Get the price ID from the subscription to determine the plan
    const priceId = subscription.items.data[0]?.price.id;
    if (!priceId) {
      console.error('No price ID found in subscription:', subscription.id);
      return;
    }

    const plan = getPlanFromPriceId(priceId);
    if (!plan) {
      console.error('Unknown price ID:', priceId);
      return;
    }

    // Update user's billing status
    const result = await updateUserBillingStatus({
      clerkUserId: userId,
      isPro: true,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
    });

    if (result.success) {
      console.log('User billing status updated:', {
        userId,
        plan,
        subscriptionId: subscription.id,
        status: subscription.status,
      });
    } else {
      console.error('Failed to update user billing status:', result.error);
    }
  } catch (error) {
    console.error('Error processing subscription:', error);
  }
}

// Only allow POST requests (webhooks)
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
