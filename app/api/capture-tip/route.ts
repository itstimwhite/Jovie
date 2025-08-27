import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    if (
      !process.env.STRIPE_SECRET_KEY ||
      !process.env.STRIPE_TIP_WEBHOOK_SECRET
    ) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_TIP_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Invalid signature', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object as Stripe.PaymentIntent;
      const charge = (
        pi as Stripe.PaymentIntent & { charges?: { data: Stripe.Charge[] } }
      ).charges?.data?.[0];

      // TODO: Create tips table in Drizzle schema and insert tip record
      // For now, log the successful tip
      console.log('Tip received:', {
        artist_id: pi.metadata.handle,
        amount_cents: pi.amount_received,
        currency: pi.currency?.toUpperCase(),
        payment_intent: pi.id,
        contact_email: charge?.billing_details?.email,
        contact_phone: charge?.billing_details?.phone,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Tip webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
