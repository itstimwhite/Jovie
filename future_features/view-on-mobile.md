# Jovi Feature Spec: “View on Mobile” Desktop QR Overlay

## Summary

When a visitor loads any Jovi profile on a non-mobile viewport (≥ 768 px width), display a small, dismissible QR overlay in the bottom-right corner. Scanning the QR opens the same profile URL on mobile, encouraging friction-free actions like Apple-Pay tipping or deep-link listening.

---

## Goals

- Nudge desktop users toward the richer mobile experience (tip jar, Apple Pay, native streaming apps).
- Keep the overlay unobtrusive, brand-consistent, and dismissible.
- Track scans vs. dismissals for optimisation.
- Zero artist configuration—generated automatically for every profile route (`/:handle`, `/:handle/tip`, `/:handle/tour`, etc.).

---

## UI / UX

| Element       | Spec                                                                              |
| ------------- | --------------------------------------------------------------------------------- |
| **Position**  | Bottom-right, `16 px` from edges; z-index above page content.                     |
| **Size**      | `120 × 120 px` QR + 16 px padding container; shrinks to 96 px on narrow desktops. |
| **Copy**      | Caption under QR: “View on mobile” (12 pt, mono-color).                           |
| **Dismiss**   | `×` icon top-right of the container; fade-out animation (200 ms).                 |
| **Reopen**    | Small “phone” icon sticky in same corner after dismiss; click restores QR.        |
| **Entrances** | Fade-in after 1.5 s page idle or on scroll > 50 vh.                               |

---

## Technical Details

1. **Viewport Detection**

   ```js
   const isDesktop = window.matchMedia('(min-width: 768px)').matches;

   2.	QR Generation
   •	Use lightweight library (qrcode-styled-encoder or qrcode.react dynamic import).
   •	Encode window.location.href + ?src=qr_desktop UTM param.
   3.	Lazy Load
   •	Import QR lib only after confirming desktop to keep mobile bundle lean.
   4.	State Management
   •	localStorage('jovie_hide_qr') → hide for 7 days after user dismisses.
   5.	Accessibility
   •	aria-label="Scan to view on mobile" on QR <canvas> / <img> element.
   6.	Styling
   •	Rounded 8 px corners, subtle shadow (rgba(0,0,0,.15)), backdrop-blur-sm for glassy look.
   •	Matches existing Jovi secondary color scheme.
   ```

⸻

Analytics

Event Payload
desktop_qr_shown { profile: handle }
desktop_qr_dismissed { profile: handle, seconds_visible }
desktop_qr_scan_redirected\* { profile: handle, route: pathname }

\*Measured via UTM param hit on mobile load (src=qr_desktop).

⸻

Edge Cases
• Mobile browsers with desktop UA: overlay suppressed if touchstart fires before 1 s.
• Low-powered devices: if requestIdleCallback not supported, fall back to setTimeout.
• SEO crawlers / screenshots: overlay hidden when prefers-reduced-motion or print media query active.

⸻

Implementation Steps 1. Create <DesktopQrOverlay/> component with lazy QR import. 2. Add to ProfileLayout with viewport check. 3. Write dismissal & localStorage logic. 4. Add UTM param helper and scan redirect tracking. 5. Unit-test viewport switches, dismiss persistence, and QR accuracy. 6. Ship behind feature flag next.desktopQr. 7. Monitor analytics → adjust idle timing / size based on scan rate.

⸻

Future Enhancements
• Auto-detect macOS Safari + iPhone handoff: prompt “Open on your iPhone?” via navigator.share.
• Contextual QR colours matching artist palette.
• A/B test different corner positions and copy (“Scan to tip quickly!”).

⸻
