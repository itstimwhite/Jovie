# Cookie Consent

Jovie uses a lightweight cookie consent system to comply with regional privacy laws.

## Regions

The banner is shown only for visitors detected in:

- European Union, EEA and United Kingdom
- California, Colorado, Virginia, Connecticut and Utah (USA)
- Quebec, Canada

## How it works

1. **Edge middleware** detects the visitor's country and injects an `x-show-cookie-banner` header when consent is required.
2. **CookieBanner** and **CookieModal** render on the client when this header is present and store preferences in a signed `jv_cc` cookie.
3. Preferences last for 365 days and can be read with helpers in `lib/cookies/consent.ts`.

## Helpers

```ts
import { readConsent, saveConsent } from '@/lib/cookies/consent';
```

- `readConsent()` – server function returning saved consent or `null`.
- `saveConsent(consent)` – server action to persist consent.

## Legal

- [GDPR](https://gdpr.eu/)
- [CPRA](https://oag.ca.gov/privacy/ccpa)
- [Law 25 Quebec](https://www.cai.gouv.qc.ca/)
