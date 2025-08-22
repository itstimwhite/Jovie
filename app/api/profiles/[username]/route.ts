/**
 * Optimized profile API with multi-level caching
 * Serves profile data with Redis and edge caching
 */

import { NextRequest, NextResponse } from 'next/server';
import { profileCache, cacheMonitoring, CACHE_TTL } from '@/lib/cache';
import { getProfileOptimized } from '@/lib/supabase/optimized';
import { convertCreatorProfileToArtist } from '@/types/db';

interface RouteParams {
  params: {
    username: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { username } = await params;
  const cleanUsername = username.toLowerCase();

  try {
    // Check Redis cache first
    const cached = await profileCache.getProfile(cleanUsername);
    if (cached) {
      cacheMonitoring.trackCacheHit('redis', `profile:${cleanUsername}`);
      
      const artist = convertCreatorProfileToArtist(cached);
      return NextResponse.json(
        { profile: artist, cached: true },
        { 
          status: 200,
          headers: {
            'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
            'X-Cache': 'HIT',
          }
        }
      );
    }

    cacheMonitoring.trackCacheMiss('redis', `profile:${cleanUsername}`);

    // Fetch from optimized database query
    const profile = await getProfileOptimized(cleanUsername);
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { 
          status: 404,
          headers: {
            'Cache-Control': 'public, max-age=60, s-maxage=60',
          }
        }
      );
    }

    // Cache in Redis for future requests
    await profileCache.setProfile(cleanUsername, profile, CACHE_TTL.PROFILE);
    
    const artist = convertCreatorProfileToArtist(profile);
    
    return NextResponse.json(
      { profile: artist, cached: false },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
          'X-Cache': 'MISS',
        }
      }
    );

  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { username } = await params;
  
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CACHE_INVALIDATION_SECRET || 'dev-secret';
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Invalidate cache
    await profileCache.invalidateProfile(username);
    
    return NextResponse.json({ 
      invalidated: true,
      username,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Cache invalidation error:', error);
    return NextResponse.json(
      { error: 'Failed to invalidate cache' },
      { status: 500 }
    );
  }
}

// Enable edge runtime for better performance
export const runtime = 'edge';