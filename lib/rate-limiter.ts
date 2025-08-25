/**
 * Rate limiting utility for API endpoints
 * 
 * This module provides a production-ready rate limiting solution
 * that can work across multiple server instances by using database storage.
 */

import { createClient } from '@supabase/supabase-js';

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyPrefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  resetAt: Date;
  remaining: number;
}

/**
 * Check if a user has exceeded their rate limit
 * 
 * @param userId The user ID to check
 * @param config The rate limit configuration
 * @returns Promise resolving to rate limit result
 */
export async function checkRateLimit(
  userId: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  // In development or for small scale, fall back to in-memory
  if (process.env.NODE_ENV !== 'production' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return checkRateLimitInMemory(userId, config);
  }

  try {
    return await checkRateLimitDatabase(userId, config);
  } catch (error) {
    console.error('Database rate limit check failed, falling back to in-memory:', error);
    return checkRateLimitInMemory(userId, config);
  }
}

/**
 * In-memory rate limiting (for development or fallback)
 */
const inMemoryStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimitInMemory(
  userId: string,
  config: RateLimitConfig
): RateLimitResult {
  const key = `${config.keyPrefix || 'rate_limit'}:${userId}`;
  const now = Date.now();
  
  const existing = inMemoryStore.get(key) || { 
    count: 0, 
    resetAt: now + config.windowMs 
  };
  
  // Reset if window has expired
  if (existing.resetAt < now) {
    existing.count = 0;
    existing.resetAt = now + config.windowMs;
  }
  
  // Check if allowed
  const allowed = existing.count < config.maxRequests;
  
  // Increment counter if allowed
  if (allowed) {
    existing.count++;
    inMemoryStore.set(key, existing);
  }
  
  return {
    allowed,
    count: existing.count,
    resetAt: new Date(existing.resetAt),
    remaining: Math.max(0, config.maxRequests - existing.count),
  };
}

/**
 * Database-backed rate limiting (for production)
 */
async function checkRateLimitDatabase(
  userId: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const key = `${config.keyPrefix || 'rate_limit'}:${userId}`;
  const now = new Date();
  const resetAt = new Date(now.getTime() + config.windowMs);
  
  // Use upsert to handle both insert and update cases
  const { data, error } = await supabase
    .rpc('check_rate_limit', {
      rate_limit_key: key,
      max_requests: config.maxRequests,
      window_ms: config.windowMs,
      current_time: now.toISOString()
    });
    
  if (error) {
    throw error;
  }
  
  return {
    allowed: data.allowed,
    count: data.count,
    resetAt: new Date(data.reset_at),
    remaining: Math.max(0, config.maxRequests - data.count),
  };
}