import { describe, it, expect } from 'vitest';
import { GET } from '@/app/.well-known/vercel/flags/route';

describe('Vercel Flags Discovery Endpoint', () => {
  // Test the acceptance criteria: Call /.well-known/vercel/flags and verify version info is returned
  it('should return version info from discovery endpoint', async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');

    const data = await response.json();

    // Verify required version field
    expect(data).toHaveProperty('version');
    expect(typeof data.version).toBe('number');
    expect(data.version).toBe(4); // Should be version 4 for Vercel Flags SDK compatibility

    // Verify flags object exists
    expect(data).toHaveProperty('flags');
    expect(typeof data.flags).toBe('object');

    // Verify metadata exists
    expect(data).toHaveProperty('metadata');
    expect(typeof data.metadata).toBe('object');
    expect(data.metadata).toHaveProperty('app');
    expect(data.metadata).toHaveProperty('framework');
    expect(data.metadata).toHaveProperty('source');
  });

  it('should have properly formatted flag definitions', async () => {
    const response = await GET();
    const data = await response.json();

    // Verify each flag has required properties
    type FlagDef = {
      type: 'boolean' | 'string' | 'number';
      default: unknown;
      description: string;
    };
    (Object.entries(data.flags) as Array<[string, FlagDef]>).forEach(
      ([flagName, flag]) => {
        // consume flagName to satisfy no-unused-vars and assert format
        expect(typeof flagName).toBe('string');
        expect(flag).toHaveProperty('type');
        expect(flag).toHaveProperty('default');
        expect(flag).toHaveProperty('description');

        // Verify type is a valid flag type
        expect(['boolean', 'string', 'number']).toContain(flag.type);

        // Verify description is a string
        expect(typeof flag.description).toBe('string');
        expect(flag.description.length).toBeGreaterThan(0);
      }
    );
  });

  it('should return Cache-Control header to prevent caching', async () => {
    const response = await GET();

    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('should include expected feature flags', async () => {
    const response = await GET();
    const data = await response.json();

    // Verify expected flags are present
    const expectedFlags = [
      'waitlistEnabled',
      'artistSearchEnabled',
      'debugBannerEnabled',
      'tipPromoEnabled',
    ];

    expectedFlags.forEach((flagName) => {
      expect(data.flags).toHaveProperty(flagName);
    });
  });
});
