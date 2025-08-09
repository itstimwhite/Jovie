// Feature flags declarations using the flags SDK v4
import { flag } from 'flags/next';

// Debug banner flag
export const debugBannerEnabled = flag<boolean>({
  key: 'debugBannerEnabled',
  description: 'Show debug banner in the UI',
  defaultValue: true,
  options: [
    { label: 'On', value: true },
    { label: 'Off', value: false },
  ],
  decide() {
    // Show on all environments by default
    return true;
  },
});

// Artist search flag
export const artistSearchEnabled = flag<boolean>({
  key: 'artistSearchEnabled',
  description: 'Enable artist search UI (replaced by claim flow)',
  defaultValue: true,
  options: [
    { label: 'Enabled', value: true },
    { label: 'Disabled', value: false },
  ],
  decide() {
    return true;
  },
});

// Tip promo flag
export const tipPromoEnabled = flag<boolean>({
  key: 'tipPromoEnabled',
  description: 'Enable tip promotion features',
  defaultValue: true,
  options: [
    { label: 'Enabled', value: true },
    { label: 'Disabled', value: false },
  ],
  decide() {
    return true;
  },
});

// Waitlist flag
export const waitlistEnabled = flag<boolean>({
  key: 'waitlistEnabled',
  description: 'Controls waitlist flow visibility',
  defaultValue: false,
  options: [
    { label: 'Enabled', value: true },
    { label: 'Disabled', value: false },
  ],
  decide() {
    return false;
  },
});
