# Advanced Caching Setup Guide

This implementation provides a comprehensive multi-level caching strategy for the Jovie application.

## Architecture Overview

```
User Request → Edge Cache → Application Cache → Redis Cache → Database
     ↓              ↓              ↓             ↓             ↓
   Vercel Edge   Next.js ISR    Redis Cache   Supabase    Original Data
   (5 minutes)    (5 minutes)    (1 hour)      (source)    (fallback)
```

## Prerequisites

### 1. Install Dependencies

Add to your `package.json`:

```bash
npm install @upstash/redis
```

### 2. Environment Variables

Add these to your `.env.local`:

```bash
# Redis/Upstash Configuration (required)
UPSTASH_REDIS_REST_URL=https://your-region.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here

# Cache Management Secrets
REVALIDATE_SECRET=your-revalidate-secret-here
CACHE_INVALIDATION_SECRET=your-cache-secret-here

# CDN Configuration (optional)
CDN_PURGE_ENDPOINT=https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache
CDN_API_KEY=your-cdn-api-key-here
```

### 3. Upstash Redis Setup

1. Sign up at [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database
3. Copy the REST URL and Token to your environment variables

## Features Implemented

### ✅ Multi-Level Caching
- **Edge Cache**: 5-minute cache at Vercel Edge locations
- **Application Cache**: React `cache()` with 5-minute ISR
- **Redis Cache**: 1-hour persistent cache with Upstash
- **Database Optimization**: Connection pooling and query optimization

### ✅ HTTP Caching Headers
- Static assets: 1-year immutable cache
- Profile pages: 5-minute cache with 30-minute stale-while-revalidate
- API routes: 5-minute cache with background revalidation

### ✅ Smart Cache Invalidation
- Multi-layer invalidation system
- API endpoints for manual cache clearing
- Coordinated invalidation across Redis, Next.js, and CDN

### ✅ Performance Monitoring
- Cache hit/miss tracking
- Real-time performance metrics
- Analytics integration (PostHog)
- Performance alerting

### ✅ Edge Runtime
- Profile pages run on Vercel Edge
- Faster cold starts and global distribution
- Reduced database load

## API Endpoints

### Cache Monitoring
```
GET /api/monitoring/cache
```
Returns cache performance metrics and hit rates.

### Profile API (Cached)
```
GET /api/profiles/[username]
```
Serves profile data with multi-level caching.

### Cache Invalidation
```
DELETE /api/profiles/[username]
POST /api/revalidate
```
Manually invalidate caches for specific profiles.

## Performance Targets

- **Cache Hit Rate**: 85-95% for popular profiles
- **Response Time**: 50-100ms for cached responses
- **Database Load**: 60-80% reduction
- **Global Load Times**: 30-50% improvement

## Monitoring

### Cache Performance
```typescript
import { cacheMonitoring } from '@/lib/cache';

// Get cache metrics
const metrics = await cacheMonitoring.getCacheMetrics();

// Check performance targets
const meetsTargets = await cacheMonitoring.checkPerformanceTargets();
```

### Performance Alerts
The system automatically alerts when cache hit rates drop below 85%.

## Cache Warming

Popular profiles can be pre-cached using:

```typescript
import { profileCache } from '@/lib/cache';

// Warm popular profiles
await profileCache.warmPopularProfiles([
  { username: 'ladygaga', profile: ladygagaProfile },
  { username: 'taylorswift', profile: taylorswiftProfile },
]);
```

## Database Optimization

### Connection Pooling
- Pool size: 10 connections
- Connection timeout: 2 seconds
- Idle timeout: 30 seconds

### Query Optimization
- Single queries instead of N+1 patterns
- Batch queries for multiple profiles
- Materialized views for analytics (future)

## Testing

### Cache Performance
```bash
# Test cache hit rates
curl -H "Cache-Control: no-cache" https://your-domain.com/api/profiles/ladygaga
curl https://your-domain.com/api/profiles/ladygaga  # Should be cached
```

### Monitoring
```bash
# Check cache metrics
curl https://your-domain.com/api/monitoring/cache
```

## Troubleshooting

### Common Issues

1. **Redis Connection Errors**
   - Verify UPSTASH environment variables
   - Check Redis dashboard for connection limits

2. **Cache Misses**
   - Monitor cache hit rates via `/api/monitoring/cache`
   - Check if profiles are being invalidated too frequently

3. **Edge Runtime Issues**
   - Ensure all dependencies are edge-compatible
   - Check for Node.js-specific APIs

### Debug Mode

Set `NODE_ENV=development` to enable:
- Cache debug headers
- Performance logging
- Detailed error messages

## Future Enhancements

1. **Service Worker Caching**: Client-side cache for offline support
2. **GraphQL Caching**: Request-level caching for GraphQL queries
3. **Prefetching**: Intelligent prefetching based on user behavior
4. **CDN Integration**: Full CDN purging and optimization