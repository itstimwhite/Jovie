/**
 * Instagram Avatar Import API
 * 
 * This API endpoint fetches an Instagram profile image, processes it,
 * uploads it to Cloudinary, and returns the URL.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase-server';
import { fetchInstagramProfileImage } from '@/lib/instagram-image-fetcher';
import { processRemoteImage } from '@/lib/remote-image-processor';
import { validateInstagramHandle, normalizeInstagramHandle } from '@/lib/instagram-utils';
import { env, flags } from '@/lib/env';
import { logInstagramAvatarImport } from '@/lib/logging';

// Rate limiting to prevent abuse
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: NextRequest) {
  // Check if features are enabled
  if (!flags.feature_image_cdn_cloudinary || !flags.feature_instagram_avatar_import) {
    return NextResponse.json(
      { error: 'Feature not enabled' },
      { status: 404 }
    );
  }
  
  // Authenticate user
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Rate limiting
  const now = Date.now();
  const userRateLimit = rateLimitMap.get(userId) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  
  // Reset rate limit if window has expired
  if (userRateLimit.resetAt < now) {
    userRateLimit.count = 0;
    userRateLimit.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  
  // Check if user has exceeded rate limit
  if (userRateLimit.count >= MAX_REQUESTS_PER_WINDOW) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        resetAt: new Date(userRateLimit.resetAt).toISOString(),
      },
      { status: 429 }
    );
  }
  
  // Increment rate limit counter
  userRateLimit.count++;
  rateLimitMap.set(userId, userRateLimit);
  
  try {
    // Parse request body
    const body = await req.json();
    const { instagramHandle } = body;
    
    if (!instagramHandle) {
      return NextResponse.json(
        { error: 'Instagram handle is required' },
        { status: 400 }
      );
    }
    
    // Validate Instagram handle
    const validation = validateInstagramHandle(instagramHandle);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    
    // Normalize Instagram handle
    const normalizedHandle = normalizeInstagramHandle(instagramHandle);
    
    // Log the start of the import process
    logInstagramAvatarImport(
      'instagram_avatar_import_start',
      `Starting Instagram avatar import for user ${userId}`,
      { instagramHandle, normalizedHandle },
      userId
    );
    
    // Fetch Instagram profile image
    logInstagramAvatarImport(
      'instagram_avatar_fetch_start',
      `Fetching Instagram profile image for handle ${normalizedHandle}`,
      { normalizedHandle },
      userId
    );
    
    const fetchResult = await fetchInstagramProfileImage(normalizedHandle);
    
    if (!fetchResult.success || !fetchResult.imageUrl) {
      // Log the failure
      logInstagramAvatarImport(
        'instagram_avatar_fetch_failure',
        `Failed to fetch Instagram profile image for handle ${normalizedHandle}`,
        { 
          normalizedHandle,
          error: fetchResult.error,
          source: fetchResult.source
        },
        userId,
        'error'
      );
      
      return NextResponse.json(
        { error: fetchResult.error || 'Failed to fetch Instagram profile image' },
        { status: 404 }
      );
    }
    
    // Log the successful fetch
    logInstagramAvatarImport(
      'instagram_avatar_fetch_success',
      `Successfully fetched Instagram profile image for handle ${normalizedHandle}`,
      { 
        normalizedHandle,
        imageUrl: fetchResult.imageUrl,
        source: fetchResult.source
      },
      userId
    );
    
    // Process and upload the image
    logInstagramAvatarImport(
      'instagram_avatar_process_start',
      `Processing and uploading Instagram profile image for user ${userId}`,
      { sourceUrl: fetchResult.imageUrl },
      userId
    );
    
    const processResult = await processRemoteImage({
      userId,
      sourceUrl: fetchResult.imageUrl,
      folder: 'avatars',
      generateSizes: [1024, 256],
    });
    
    if (!processResult.success || !processResult.imageUrl) {
      // Log the failure
      logInstagramAvatarImport(
        'instagram_avatar_process_failure',
        `Failed to process Instagram profile image for user ${userId}`,
        { 
          error: processResult.error,
          sourceUrl: fetchResult.imageUrl
        },
        userId,
        'error'
      );
      
      return NextResponse.json(
        { error: processResult.error || 'Failed to process Instagram profile image' },
        { status: 500 }
      );
    }
    
    // Log the successful processing
    logInstagramAvatarImport(
      'instagram_avatar_process_success',
      `Successfully processed Instagram profile image for user ${userId}`,
      { 
        imageUrl: processResult.imageUrl,
        thumbnailUrl: processResult.thumbnailUrl,
        publicId: processResult.publicId
      },
      userId
    );
    
    // Get Supabase client
    const supabase = createServerClient();
    
    // Update creator_profiles table with Instagram handle and avatar URL
    const { data, error } = await supabase
      .from('creator_profiles')
      .update({
        instagram_handle: instagramHandle,
        avatar_url: processResult.imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select('id, username, avatar_url, instagram_handle')
      .single();
    
    if (error) {
      // Log the failure
      logInstagramAvatarImport(
        'instagram_avatar_import_failure',
        `Failed to update profile with Instagram avatar for user ${userId}`,
        { error },
        userId,
        'error'
      );
      
      console.error('Error updating profile:', error);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }
    
    // Log the successful import
    logInstagramAvatarImport(
      'instagram_avatar_import_success',
      `Successfully imported Instagram avatar for user ${userId}`,
      { 
        avatarUrl: processResult.imageUrl,
        thumbnailUrl: processResult.thumbnailUrl,
        instagramHandle: data.instagram_handle
      },
      userId
    );
    
    // Return success response
    return NextResponse.json({
      success: true,
      avatarUrl: processResult.imageUrl,
      thumbnailUrl: processResult.thumbnailUrl,
      instagramHandle: data.instagram_handle,
    });
  } catch (error) {
    console.error('Instagram avatar import error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
