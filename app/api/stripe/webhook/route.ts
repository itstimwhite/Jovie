import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClerkClient } from '@clerk/nextjs/server';
import { env } from '@/lib/env';

export async function POST(request: NextRequest) {
  try {
    if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(env.STRIPE_SECRET_KEY);
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const clerkClient = createClerkClient({
      secretKey: env.CLERK_SECRET_KEY,
    });

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.metadata?.clerk_user_id) {
          // Update user's plan to Pro in Clerk
          try {
            await clerkClient.users.updateUserMetadata(
              session.metadata.clerk_user_id,
              {
                publicMetadata: {
                  plan: 'pro',
                  stripe_customer_id: session.customer,
                  stripe_subscription_id: session.subscription,
                },
              }
            );

            console.log(
              `Updated user ${session.metadata.clerk_user_id} to Pro plan`
            );
          } catch (error) {
            console.error('Failed to update user metadata:', error);
          }
        }
        break;

      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;

        // Find user by subscription ID and downgrade to free
        try {
          const users = await clerkClient.users.getUserList({
            limit: 500, // Adjust as needed
          });

          const user = users.data.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (u: any) =>
              u.publicMetadata?.stripe_subscription_id === subscription.id
          );

          if (user) {
            await clerkClient.users.updateUserMetadata(user.id, {
              publicMetadata: {
                plan: 'free',
                stripe_customer_id: null,
                stripe_subscription_id: null,
              },
            });

            console.log(`Downgraded user ${user.id} to free plan`);
          }
        } catch (error) {
          console.error('Failed to downgrade user:', error);
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
