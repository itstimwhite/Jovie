# Feature Flag Policy

## Naming Convention

All feature flags in the Jovie project must follow the `feature_<slug>` naming convention, where:

- All flag names are in snake_case (lowercase with underscores)
- All flag names must start with the `feature_` prefix
- The `<slug>` portion should be descriptive but concise, using only lowercase letters and underscores

### Examples

✅ **Correct**:

- `feature_claim_handle`
- `feature_artist_search`
- `feature_tip_promo`
- `feature_pricing_clerk`
- `feature_universal_notifications`
- `feature_click_analytics_rpc`

❌ **Incorrect**:

- `artistSearchEnabled` (camelCase, missing prefix)
- `Feature_Claim_Handle` (contains uppercase)
- `feature-claim-handle` (uses hyphens instead of underscores)
- `claimHandleEnabled` (camelCase, missing prefix)

## Implementation

### Storage Format

- All feature flags must be stored and transmitted in snake_case format
- This applies to:
  - API responses
  - Database storage
  - Configuration files
  - External service integration (e.g., PostHog)

### Internal Usage

For TypeScript ergonomics, we provide a mapping layer that translates between:

- snake_case (storage format)
- camelCase (internal usage format)

This mapping is implemented in `lib/feature-flags.ts` and ensures type safety throughout the application.

### Backward Compatibility

For backward compatibility, the API may provide both formats:

- snake_case (canonical)
- camelCase (legacy, for backward compatibility)

## Adding New Feature Flags

When adding a new feature flag:

1. Define the canonical snake_case name in `lib/feature-flags.ts`
2. Add the mapping to the camelCase version in the same file
3. Update the feature flag API to include the new flag
4. Update tests to cover the new flag

## Migration

Existing code should be gradually migrated to use the new naming convention. During the transition period, both naming conventions will be supported through the mapping layer.
