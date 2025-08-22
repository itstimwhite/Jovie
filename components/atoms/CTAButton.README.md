# CTAButton Component

A high-quality Call-to-Action button component with Apple-level UX inspired by Stripe Checkout.

## Features

- **Themes:** Supports light, dark, and system theme (via `prefers-color-scheme`).
- **States:** Handles idle, hover, focus, loading, disabled, and success states.
- **Animations:** Smooth, polished micro-interactions:
  - Loading → spinner fades in, label fades out.
  - Success → checkmark icon with bounce/fade animation.
  - Transition speeds: 150–200 ms loading, 300 ms success.
- **Icons:** Uses Heroicons v2 for consistency.
- **Design:** High-contrast black/white aesthetic with rounded corners, responsive sizing, Apple-like subtle shadows/glow.
- **Accessibility:** Full ARIA support (aria-busy, aria-live, role=button), visible focus states, keyboard navigation, reduced-motion support.

## Usage

```tsx
import { CTAButton } from '@/components/atoms/CTAButton';

// Basic usage
<CTAButton href="/dashboard">
  Get Started
</CTAButton>

// With loading state
<CTAButton href="/dashboard" isLoading>
  Processing...
</CTAButton>

// With success state
<CTAButton href="/dashboard" isSuccess>
  Complete
</CTAButton>

// With icon
import { ArrowRightIcon } from '@heroicons/react/24/solid';

<CTAButton href="/dashboard" icon={<ArrowRightIcon className="h-5 w-5" />}>
  Continue
</CTAButton>

// As a button with onClick handler
<CTAButton onClick={handleSubmit}>
  Submit
</CTAButton>

// Different variants
<CTAButton variant="primary">Primary</CTAButton>
<CTAButton variant="secondary">Secondary</CTAButton>
<CTAButton variant="outline">Outline</CTAButton>

// Different sizes
<CTAButton size="sm">Small</CTAButton>
<CTAButton size="md">Medium</CTAButton>
<CTAButton size="lg">Large</CTAButton>

// Disabled state
<CTAButton disabled>Disabled</CTAButton>

// External link
<CTAButton href="https://example.com" external>
  External Link
</CTAButton>

// With reduced motion
<CTAButton reducedMotion>
  Reduced Motion
</CTAButton>
```

## Props

| Prop            | Type                                    | Default     | Description                                  |
| --------------- | --------------------------------------- | ----------- | -------------------------------------------- |
| `href`          | `string`                                | `undefined` | The URL the button should navigate to        |
| `children`      | `React.ReactNode`                       | (required)  | Button content                               |
| `variant`       | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | Visual style variant                         |
| `size`          | `'sm' \| 'md' \| 'lg'`                  | `'md'`      | Size variant                                 |
| `className`     | `string`                                | `''`        | Additional CSS classes                       |
| `external`      | `boolean`                               | `false`     | Whether the link should open in a new tab    |
| `isLoading`     | `boolean`                               | `false`     | Whether the button is in a loading state     |
| `isSuccess`     | `boolean`                               | `false`     | Whether the button is in a success state     |
| `disabled`      | `boolean`                               | `false`     | Whether the button is disabled               |
| `icon`          | `React.ReactNode`                       | `undefined` | Optional icon to display before text         |
| `onClick`       | `(e: React.MouseEvent) => void`         | `undefined` | Optional click handler (for button mode)     |
| `ariaLabel`     | `string`                                | `undefined` | Optional aria-label for better accessibility |
| `reducedMotion` | `boolean`                               | `false`     | Whether to use reduced motion                |
| `type`          | `'button' \| 'submit' \| 'reset'`       | `'button'`  | Type attribute for button mode               |

## Accessibility

The CTAButton component includes the following accessibility features:

- Proper ARIA attributes for all states (`aria-busy`, `aria-disabled`, `aria-live`)
- Visible focus states that meet WCAG contrast requirements
- Support for keyboard navigation
- Support for reduced motion preferences
- Screen reader announcements for state transitions

## Theming

The CTAButton automatically adapts to the current theme (light, dark, or system) using the `next-themes` package. The colors are designed to maintain high contrast in all themes.

## Animation

The component uses Framer Motion for smooth animations between states:

- Loading state: Content fades out, spinner fades in (150-200ms)
- Success state: Checkmark icon appears with a bounce animation (300ms)
- All animations respect the user's reduced motion preferences

## Testing

The CTAButton component includes:

- Unit tests with Vitest
- E2E tests with Playwright
- Visual regression tests
- Accessibility tests

## Storybook

The component includes comprehensive Storybook stories for all states, variants, sizes, and themes.
