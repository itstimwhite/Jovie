# Jovi Feature Spec: Universal Artist Notifications

## Summary

This feature allows visitors to any Jovie profile to subscribe for notifications when a creator releases new content. We start with email-only and no verification for the MVP, then expand to SMS and verified flows. The experience should feel “magical,” frictionless, and fully consistent with Jovie’s clean, conversion-focused design.

---

## Goals

- Enable visitors to opt-in to artist notifications directly from an artist’s Jovi profile.
- Keep profiles visually consistent and conversion-optimized (primary CTA remains **Listen**).
- Provide a “one-tap” subscribe experience.
- Support Email first (MVP), then SMS.
- Store minimal, secure user data; comply with all relevant laws (TCPA, CAN-SPAM, GDPR).
- Create a global subscription system tied to a contact (email/SMS) and optionally to a pseudonymous browser token for UX convenience.

---

## Creator Types and Category Lists

- We support multiple `creator_type` values on `creator_profiles`: `artist`, `podcaster`, `athlete`, `influencer`, etc.
- Every creator type maps to a Jovie category list key for cross-promotion and discovery:
  - artist → `jovie_artist`
  - podcaster → `jovie_podcaster`
  - athlete → `jovie_athlete`
  - influencer → `jovie_influencer`
- When a user subscribes to an individual creator, we also enroll them into the matching Jovie category list (e.g., subscribe to Lady Gaga → also in `jovie_artist`).

---

## UI/UX Overview

### Entry Point

- **Bell icon** on profile header (secondary CTA, outline style).
- Icon sits opposite the Listen button.
- Clicking the bell opens a **bottom sheet / drawer**.

### Drawer Layout

1. **Title:** `Get updates from {Artist}`
2. **Tabs:** `Text` | `Email` (default: Text)
3. **Input Field:**
   - Phone: country picker + phone field
   - Email: email field
   - After capture, display masked: `(***) ***-1234` or `t***@g***.com`
4. **Microcopy:** “You’ll use this for any artist on Jovi. Reply STOP to unsubscribe.”
5. **CTA:** `Turn on notifications` (disabled until valid input)
6. **Legal Subtext:** “By subscribing, you agree to receive automated updates. Msg/data rates may apply. STOP to opt out. Terms • Privacy”

---

## User Flows

### First-Time Subscription

1. User clicks bell → Drawer opens.
2. Enters email.
3. On success:
   - Toast: “You’ll get updates from {Artist}.”
   - Drawer now shows subscribed state + per-artist toggle.

### Returning Visitor (eventual)

- A pseudonymous token (`visitor_token`) stored in `localStorage` links the browser to their verified contact.
- On any artist profile:
  - Bell shows “Following” if subscribed.
  - Drawer pre-fills masked contact with **Turn on notifications** one-tap option.
- If `localStorage` is missing (new device), revert to first-time flow.

---

## Data Model

### MVP (Email-only, No Verification)

- contacts_email
  - id UUID PK
  - email text NOT NULL
  - email_hash text NOT NULL UNIQUE (sha256(lowercase(email)))
  - created_at timestamptz DEFAULT now()

- artist_subscriptions
  - contact_id UUID FK → contacts_email
  - artist_id UUID FK → creator_profiles.id
  - source text (e.g., 'profile_bell' | 'handle_notifications')
  - created_at timestamptz DEFAULT now()
  - PK(contact_id, artist_id)

- category_subscriptions
  - contact_id UUID FK → contacts_email
  - category_key text NOT NULL (e.g., `jovie_artist`)
  - created_at timestamptz DEFAULT now()
  - PK(contact_id, category_key)

- lists (seed)
  - list_key text PK (e.g., `jovie_artist`, `jovie_podcaster`, `jovie_athlete`)
  - display_name text
  - created_at timestamptz DEFAULT now()

### Eventual Model Extensions

- contacts table generalized for multiple channels (email, sms) with `channel` and `verified_at`.
- verification_tokens for double opt-in and secure unsubscribe links.
- contact_consents table for consent versioning and audit (IP, UA, text checksum).

---

## MVP Scope (Build First)

- Email-only, no verification: create rows in `contacts_email`, `artist_subscriptions`, and `category_subscriptions`.
- Idempotent upsert by `email_hash`; append subscriptions per artist.
- Auto-enroll to category list based on `creator_type` (e.g., `jovie_artist`).
- UI entry points:
  - Bell icon on the profile header opens a Drawer/Modal with an email field.
  - `/[handle]/notifications` page provides the same email form.
- Dashboard: Subscribers table for the creator in the dashboard with an Unsubscribe button per row.
- Feature flag: `feature_universal_notifications` (default OFF) gates the UI and routes.
- Analytics events via `@/lib/analytics`: `profile_bell_click`, `notifications_subscribe_submit/success/error`, `dashboard_unsubscribe_click`.

## Eventual Features (Next)

- SMS channel with OTP verification.
- Email verification (double opt-in) using magic link or code.
- Global and per-category unsubscribe management page with signed links.
- Personalization: recommend similar creators (e.g., Lady Gaga fans notified about Katy Perry).
- Rate limiting, abuse prevention, resend throttles.
- Visitor token to prefill and reflect subscribed state across sessions/devices.

---

## Routes

- UI
  - `app/[username]/page.tsx` bell trigger (flagged)
  - `app/[username]/notifications/page.tsx` (flagged)
- API
  - `app/api/notifications/subscribe/route.ts` (POST): email-only subscribe
  - `app/api/notifications/unsubscribe/route.ts` (POST/DELETE): artist-level unsubscribe

---

## Dashboard (MVP)

- `app/(dashboard)/dashboard/subscribers/page.tsx`: server-rendered table joining `artist_subscriptions` → `contacts_email`.
- Columns: email, subscribed_at, source; Row action: Unsubscribe.

```json
{
  "id": "uuid",
  "type": "sms" | "email",
  "value_hash": "sha256(contact)",
  "verified_at": "timestamp"
}
```
