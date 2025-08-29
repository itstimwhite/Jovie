/**
 * Dashboard Card System Tokens
 *
 * This file defines the standardized tokens for dashboard card components
 * across the application. These tokens ensure consistent styling for
 * surfaces, borders, radii, shadows, and padding.
 */

export const cardTokens = {
  // Base card styles applied to all card variants
  base: 'bg-surface-1 border border-subtle rounded-xl shadow-sm transition-all duration-300',

  // Padding variations
  padding: {
    default: 'p-6',
    large: 'p-8',
    compact: 'p-4',
  },

  // Border radius variations
  radius: {
    default: 'rounded-xl',
    small: 'rounded-lg',
    large: 'rounded-2xl',
  },

  // Shadow variations
  shadow: {
    default: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg',
    hover: 'hover:shadow-lg hover:shadow-accent/5',
  },

  // Border variations
  border: {
    default: 'border border-subtle',
    accent: 'border border-accent/20',
    hover: 'hover:border-accent/20',
  },

  // Interactive state variations
  interactive: {
    hover:
      'hover:bg-surface-2 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/10 hover:ring-1 ring-accent transform hover:-translate-y-1',
    active: 'active:bg-surface-3 active:shadow-inner',
    focus:
      'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1',
  },

  // Variant compositions (combining tokens for specific use cases)
  variants: {
    default:
      'bg-surface-1 border border-subtle rounded-xl p-6 shadow-sm hover:shadow-md hover:border-accent/10 transition-all duration-300',
    interactive:
      'bg-surface-1 backdrop-blur-sm rounded-xl border border-subtle p-6 text-left hover:shadow-xl hover:shadow-accent/10 hover:ring-1 ring-accent hover:border-accent/30 hover:bg-surface-2 transition-all duration-300 group transform hover:-translate-y-1 cursor-pointer',
    settings:
      'bg-surface-1 rounded-xl border border-subtle p-6 shadow-sm hover:shadow-md hover:border-accent/10 transition-all duration-300',
    analytics:
      'bg-surface-1 border border-subtle rounded-xl p-6 hover:shadow-lg hover:shadow-accent/5 hover:border-accent/20 transition-all duration-300 group',
    'empty-state':
      'bg-surface-1 border border-subtle rounded-xl p-8 text-center relative overflow-hidden',
  },
};
