/**
 * Test for handle availability check API endpoint
 * Ensures consistency between availability check and actual profile creation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/handle/check/route';

// Mock the supabase client
vi.mock('@/lib/supabase/server', () => ({
  createServerSupabase: vi.fn(),
}));

describe('Handle Check API', () => {
  const mockCreateServerSupabase = vi.mocked(
    () => import('@/lib/supabase/server').then(m => m.createServerSupabase)
  );

  it('should use creator_profiles table and username field', async () => {
    // Mock supabase client
    const mockEq = vi.fn().mockResolvedValue({
      data: [],
      error: null,
    });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
    const mockSupabase = { from: mockFrom };

    // Mock the server supabase function
    const { createServerSupabase } = await import('@/lib/supabase/server');
    vi.mocked(createServerSupabase).mockReturnValue(mockSupabase as any);

    const request = new NextRequest(
      'http://localhost:3000/api/handle/check?handle=testhandle'
    );

    // Act
    const response = await GET(request);
    const result = await response.json();

    // Assert
    expect(mockFrom).toHaveBeenCalledWith('creator_profiles');
    expect(mockSelect).toHaveBeenCalledWith('username');
    expect(mockEq).toHaveBeenCalledWith('username', 'testhandle');
    expect(result.available).toBe(true);
  });

  it('should return false when handle exists', async () => {
    // Mock supabase client with existing data
    const mockEq = vi.fn().mockResolvedValue({
      data: [{ username: 'existinghandle' }],
      error: null,
    });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
    const mockSupabase = { from: mockFrom };

    const { createServerSupabase } = await import('@/lib/supabase/server');
    vi.mocked(createServerSupabase).mockReturnValue(mockSupabase as any);

    const request = new NextRequest(
      'http://localhost:3000/api/handle/check?handle=existinghandle'
    );

    // Act
    const response = await GET(request);
    const result = await response.json();

    // Assert
    expect(result.available).toBe(false);
  });

  it('should require handle parameter', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/handle/check'
    );

    // Act
    const response = await GET(request);
    const result = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(result.available).toBe(false);
    expect(result.error).toBe('Handle is required');
  });
});