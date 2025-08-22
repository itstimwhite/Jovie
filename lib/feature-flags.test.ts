import { describe, it, expect, beforeEach } from 'vitest';
import {
  FEATURE_FLAGS,
  FeatureFlags,
  getFeatureFlagByKey,
  getKeyForFeatureFlag,
} from './feature-flags';

describe('Feature Flags', () => {
  describe('FEATURE_FLAGS constants', () => {
    it('should define all feature flags with the correct prefix', () => {
      Object.values(FEATURE_FLAGS).forEach((flagKey) => {
        expect(flagKey).toMatch(/^feature_[a-z_]+$/);
      });
    });
  });

  describe('getFeatureFlagByKey', () => {
    let mockFlags: FeatureFlags;

    beforeEach(() => {
      mockFlags = {
        artistSearchEnabled: true,
        debugBannerEnabled: false,
        tipPromoEnabled: true,
        pricingUseClerk: false,
        universalNotificationsEnabled: true,
        featureClickAnalyticsRpc: false,
        claimHandleEnabled: true,
      };
    });

    it('should return the correct flag value for each key', () => {
      expect(getFeatureFlagByKey(mockFlags, FEATURE_FLAGS.ARTIST_SEARCH)).toBe(true);
      expect(getFeatureFlagByKey(mockFlags, FEATURE_FLAGS.DEBUG_BANNER)).toBe(false);
      expect(getFeatureFlagByKey(mockFlags, FEATURE_FLAGS.TIP_PROMO)).toBe(true);
      expect(getFeatureFlagByKey(mockFlags, FEATURE_FLAGS.PRICING_CLERK)).toBe(false);
      expect(getFeatureFlagByKey(mockFlags, FEATURE_FLAGS.UNIVERSAL_NOTIFICATIONS)).toBe(true);
      expect(getFeatureFlagByKey(mockFlags, FEATURE_FLAGS.CLICK_ANALYTICS_RPC)).toBe(false);
      expect(getFeatureFlagByKey(mockFlags, FEATURE_FLAGS.CLAIM_HANDLE)).toBe(true);
    });
  });

  describe('getKeyForFeatureFlag', () => {
    it('should return the correct snake_case key for each camelCase property', () => {
      expect(getKeyForFeatureFlag('artistSearchEnabled')).toBe(FEATURE_FLAGS.ARTIST_SEARCH);
      expect(getKeyForFeatureFlag('debugBannerEnabled')).toBe(FEATURE_FLAGS.DEBUG_BANNER);
      expect(getKeyForFeatureFlag('tipPromoEnabled')).toBe(FEATURE_FLAGS.TIP_PROMO);
      expect(getKeyForFeatureFlag('pricingUseClerk')).toBe(FEATURE_FLAGS.PRICING_CLERK);
      expect(getKeyForFeatureFlag('universalNotificationsEnabled')).toBe(FEATURE_FLAGS.UNIVERSAL_NOTIFICATIONS);
      expect(getKeyForFeatureFlag('featureClickAnalyticsRpc')).toBe(FEATURE_FLAGS.CLICK_ANALYTICS_RPC);
      expect(getKeyForFeatureFlag('claimHandleEnabled')).toBe(FEATURE_FLAGS.CLAIM_HANDLE);
    });
  });
});

