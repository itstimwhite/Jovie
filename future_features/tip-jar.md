# Jovi Feature Spec: Tip Jar Route (`/:handle/tip`)

## Summary

A specialised URL (`/<artist>/tip`) that swaps the default **Listen** CTA for three one-tap tip buttons ($2, $5, $10). Payments fire Apple Pay/Google Pay in-page, thank the fan, and then invite them to turn on notifications with their newly captured contact info.

---

## Goals

- Monetise spontaneous goodwill (busking QR, live-stream overlays, social links).
- Keep the primary profile (`/<artist>`) visually unchanged and conversion-optimised.
- Zero-friction mobile flow: tap → Face ID → done → opt-in prompt.
- Collect verified email/phone to seed Fan CRM Lite.

---

## Route & URL Pattern

| Route          | Mode     | CTA Row                                 |
| -------------- | -------- | --------------------------------------- |
| `/:handle`     | Default  | **Listen** button                       |
| `/:handle/tip` | Tip Mode | `$2 Tip` · `$5 Tip` · `$10 Tip` buttons |

Shallow route via Next.js (`router.push('/[handle]/tip', undefined, { shallow:true })`) keeps the same page shell and SEO.

---

## UI / UX

1. **CTA Swap** – Three stacked buttons (large, brand-accent).
2. Tap a button → trigger **PaymentRequest API**.
3. Apple Pay / Google Pay sheet shows amount + artist name.
4. On success:
   - Toast: “Thanks for the $5 tip 🎉” (sub-second).
   - CTA row fades back to **Listen**.
   - Auto-open **Turn on notifications** drawer with phone/email pre-filled from payment payload.
5. If user cancels → no state change, stay on tip mode.

Desktop fallback: show QR code to the same `/tip` URL plus an instruction (“Scan to tip via Apple Pay”).

---

## Payment Flow (Stripe)

```mermaid
sequenceDiagram
Browser->>Stripe: PaymentRequest (amount, artistID)
Stripe-->>Browser: Apple Pay sheet
Browser->>Stripe: Token (on Face ID)
Stripe->>Serverless `/capture-tip`: event.webhook
Serverless-->>DB: record tip, extract email/phone
Serverless-->>Stripe: confirm payment
Browser->>Browser: show toast + open notifications drawer

	•	Products: three Stripe Prices ($2, $5, $10) per currency.
	•	Metadata: { artist_id, amount }.
	•	Webhook stores contact_info, issues tip_success event.

⸻

Data Model Additions

{
  "Tip": {
    "id": "uuid",
    "artist_id": "spotify_id",
    "contact_id": "uuid (nullable)",
    "amount_cents": 500,
    "currency": "USD",
    "payment_intent": "pi_...",
    "created_at": "timestamp"
  }
}

If the Apple Pay payload includes email/phone, attempt to match & link to existing ContactMethod; otherwise create new on first notification opt-in.

⸻

Security & Compliance
	•	Stripe handles PCI; server receives only tokenised card info.
	•	Store amount and masked contact only.
	•	Add “Tips are non-refundable” text below buttons (8 pt).
	•	Same TCPA/CAN-SPAM obligations apply when re-using contact for notifications.

⸻

Analytics

Event	Notes
tip_opened	/tip page view
tip_amount_click	value chosen
tip_payment_success	includes amount
notif_drawer_auto_open	after successful tip
notif_opt_in_post_tip	conversion metric


⸻

Edge Cases
	1.	Unsupported PaymentRequest – fallback to Stripe Checkout redirect.
	2.	Payment fail – show inline error, no CTA swap.
	3.	Incognito / blocked storage – notifications drawer shows empty fields; user can still opt-in manually.

⸻

Implementation Steps (Sprint ≃ 1 week)
	1.	Add shallow /tip route & CTA swap component.
	2.	Integrate Stripe PaymentRequest (+ fallback).
	3.	Webhook → Tip table insert → contact capture.
	4.	Auto-open notification drawer with pre-filled mask.
	5.	Generate QR creator in artist dashboard.
	6.	Unit test: mobile Safari, Chrome Android, desktop fallback.
	7.	Instrument analytics.
	8.	Legal text & privacy-policy update.

⸻

Future Enhancements
	•	Custom amounts for superfans (dropdown “Other”).
	•	Dynamic amounts based on follower milestones (e.g., $7 for 7 M streams).
	•	Display running total (“Fans have tipped $3 421 to Pink”) for social proof.
	•	Optional “Tip + Message” that sends note to artist inbox.

```
