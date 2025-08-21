/**
 * Link Wrapping Unit Tests
 */

import { describe, expect, test } from 'vitest';
import { extractDomain, detectBot, generateWrappedUrl } from '@/lib/link-wrapping';

describe('Link Wrapping Utilities', () => {
  describe('extractDomain', () => {
    test('extracts domain from HTTP URL', () => {
      expect(extractDomain('http://example.com/path')).toBe('example.com');
    });

    test('extracts domain from HTTPS URL', () => {
      expect(extractDomain('https://example.com/path')).toBe('example.com');
    });

    test('removes www prefix', () => {
      expect(extractDomain('https://www.example.com/path')).toBe('example.com');
    });

    test('handles URLs with query parameters', () => {
      expect(extractDomain('https://example.com/path?query=value')).toBe('example.com');
    });

    test('handles URLs with ports', () => {
      expect(extractDomain('https://example.com:3000/path')).toBe('example.com');
    });

    test('handles subdomain', () => {
      expect(extractDomain('https://sub.example.com/path')).toBe('sub.example.com');
    });

    test('returns lowercase domain', () => {
      expect(extractDomain('https://EXAMPLE.COM/path')).toBe('example.com');
    });

    test('handles invalid URLs gracefully', () => {
      expect(extractDomain('not-a-url')).toBe('not-a-url');
    });

    test('handles empty strings', () => {
      expect(extractDomain('')).toBe('');
    });
  });

  describe('detectBot', () => {
    test('detects Meta/Facebook crawlers', () => {
      const result = detectBot('Mozilla/5.0 (compatible; facebookexternalhit/1.1)');
      expect(result.isBot).toBe(true);
      expect(result.isMeta).toBe(true);
      expect(result.reason).toContain('facebookexternalhit');
    });

    test('detects Facebot', () => {
      const result = detectBot('facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)');
      expect(result.isBot).toBe(true);
      expect(result.isMeta).toBe(true);
    });

    test('detects Instagram bot', () => {
      const result = detectBot('Instagram 1.0.0.0 (+https://www.instagram.com/)');
      expect(result.isBot).toBe(true);
      expect(result.isMeta).toBe(true);
    });

    test('detects Meta ASNs', () => {
      const result = detectBot('Mozilla/5.0', 'AS32934');
      expect(result.isBot).toBe(true);
      expect(result.isMeta).toBe(true);
      expect(result.reason).toContain('AS32934');
    });

    test('detects general bots', () => {
      const result = detectBot('GoogleBot/2.1');
      expect(result.isBot).toBe(true);
      expect(result.isMeta).toBe(false);
    });

    test('detects crawlers', () => {
      const result = detectBot('Mozilla/5.0 (compatible; crawler/1.0)');
      expect(result.isBot).toBe(true);
      expect(result.isMeta).toBe(false);
    });

    test('detects spiders', () => {
      const result = detectBot('spider/1.0');
      expect(result.isBot).toBe(true);
      expect(result.isMeta).toBe(false);
    });

    test('detects curl', () => {
      const result = detectBot('curl/7.68.0');
      expect(result.isBot).toBe(true);
      expect(result.isMeta).toBe(false);
    });

    test('allows normal browser user agents', () => {
      const result = detectBot('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      expect(result.isBot).toBe(false);
      expect(result.isMeta).toBe(false);
    });

    test('allows mobile user agents', () => {
      const result = detectBot('Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)');
      expect(result.isBot).toBe(false);
      expect(result.isMeta).toBe(false);
    });

    test('handles empty user agent', () => {
      const result = detectBot('');
      expect(result.isBot).toBe(false);
      expect(result.isMeta).toBe(false);
    });
  });

  describe('generateWrappedUrl', () => {
    const originalEnv = process.env.NODE_ENV;
    const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
      process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
    });

    test('generates normal link URL in development', () => {
      process.env.NODE_ENV = 'development';
      const linkId = '123e4567-e89b-12d3-a456-426614174000';
      const url = generateWrappedUrl(linkId, 'normal');
      expect(url).toBe(`http://localhost:3000/go/${linkId}`);
    });

    test('generates sensitive link URL in development', () => {
      process.env.NODE_ENV = 'development';
      const linkId = '123e4567-e89b-12d3-a456-426614174000';
      const url = generateWrappedUrl(linkId, 'sensitive');
      expect(url).toBe(`http://localhost:3000/out/${linkId}`);
    });

    test('generates normal link URL in production with SITE_URL', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
      const linkId = '123e4567-e89b-12d3-a456-426614174000';
      const url = generateWrappedUrl(linkId, 'normal');
      expect(url).toBe(`https://example.com/go/${linkId}`);
    });

    test('generates sensitive link URL in production with SITE_URL', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
      const linkId = '123e4567-e89b-12d3-a456-426614174000';
      const url = generateWrappedUrl(linkId, 'sensitive');
      expect(url).toBe(`https://example.com/out/${linkId}`);
    });

    test('falls back to jovie.app in production without SITE_URL', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.NEXT_PUBLIC_SITE_URL;
      const linkId = '123e4567-e89b-12d3-a456-426614174000';
      const url = generateWrappedUrl(linkId, 'normal');
      expect(url).toBe(`https://jovie.app/go/${linkId}`);
    });
  });
});