# Jovi Feature Spec: Universal Artist Notifications

## Summary

This feature allows visitors to any Jovi artist profile to subscribe for notifications (SMS or Email) when that artist releases new content. After a one-time verification, visitors can follow multiple artists without re-entering their contact details. The system should feel “magical,” frictionless, and fully consistent with Jovi’s clean, conversion-focused design.

---

## Goals

- Enable visitors to opt-in to artist notifications directly from an artist’s Jovi profile.
- Keep profiles visually consistent and conversion-optimized (primary CTA remains **Listen**).
- Provide a “one-tap” subscribe experience after first verification.
- Support both SMS and Email delivery channels.
- Store minimal, secure user data; comply with all relevant laws (TCPA, CAN-SPAM, GDPR).
- Create a global subscription system tied to a pseudonymous browser token, not a full user account.

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
2. Chooses Text or Email → enters contact info.
3. **Verification:**
   - SMS: 6-digit OTP
   - Email: magic link or code
4. On success:
   - Toast: “You’ll get updates from {Artist}.”
   - Drawer now shows subscribed state + per-artist toggle.

### Returning Visitor

- A pseudonymous token (`visitor_token`) stored in `localStorage` links the browser to their verified contact.
- On any artist profile:
  - Bell shows “Following” if subscribed.
  - Drawer pre-fills masked contact with **Turn on notifications** one-tap option.
- If `localStorage` is missing (new device), revert to first-time flow.

---

## Data Model

### ContactMethod

```json
{
  "id": "uuid",
  "type": "sms" | "email",
  "value_hash": "sha256(contact)",
  "verified_at": "timestamp"
}
```
