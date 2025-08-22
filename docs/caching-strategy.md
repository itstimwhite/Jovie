# Jovie Caching Strategy

This document outlines the multi-level caching architecture implemented in the Jovie application to optimize performance, reduce database load, and improve user experience.

## Caching Architecture Overview

```
User Request → Edge Cache → Application Cache → Database
     ↓              ↓              ↓             ↓
   Vercel Edge   Next.js ISR    Redis Cache   Supabase
   (30s-5min)    (30min)        (1hr)         (source)
```

## 1. Edge Caching Layer

The edge caching layer is the first line of defense against excessive database queries and provides the fastest response times for users worldwide.

### Implementation Details

- **Technology**: Vercel Edge Functions / Cloudflare Edge
- **Location**: Closest to the user (global edge network)
- **TTL**: 5 minutes (configurable per route)
- **Files**:
  - `app/[username]/page.tsx` - Edge runtime enabled
  - `next.config.js` - Cache-Control headers
  - `middleware.ts` - Edge middleware

### Key Features

- **Edge Runtime**: Profile pages run at the edge for faster global performance
- **Cache-Control Headers**: Optimized for different content types
- **Stale-While-Revalidate**: Serve stale content while fetching fresh data

## 2. Application Caching Layer

The application caching layer sits between the edge and the database, providing a consistent caching layer for server-side operations.

### Implementation Details

- **Technology**: Next.js ISR + Redis
- **Location**: Vercel serverless functions / server
- **TTL**: 30 minutes (ISR) / 1 hour (Redis)
- **Files**:
  - `lib/cache/redis.ts` - Redis client
  - `lib/cache/index.ts` - Cache interface
  - `app/[username]/page.tsx` - ISR implementation

### Key Features

- **Incremental Static Regeneration**: Cache pages for 30 minutes
- **Redis Cache**: Store frequently accessed data
- **Cache Invalidation**: Smart invalidation on data changes

## 3. Database Optimization Layer

The database optimization layer reduces the load on the database and improves query performance.

### Implementation Details

- **Technology**: Supabase / PostgreSQL
- **Location**: Database server
- **Features**: Connection pooling, materialized views
- **Files**:
  - `lib/supabase/client.ts` - Connection pooling
  - `supabase/migrations/20250822_profile_summary_view.sql` - Materialized view

### Key Features

- **Connection Pooling**: Reuse database connections
- **Materialized Views**: Pre-compute frequently accessed data
- **Query Optimization**: Efficient database queries

## 4. Client-Side Caching Layer

The client-side caching layer improves performance for returning users and reduces network requests.

### Implementation Details

- **Technology**: Service Worker + Browser Cache
- **Location**: User's browser
- **TTL**: Varies by content type (5 minutes - 1 year)
- **Files**:
  - `public/sw.js` - Service worker
  - `components/profile/ProfileLink.tsx` - Prefetching

### Key Features

- **Service Worker**: Cache assets and API responses
- **Prefetching**: Load data before the user navigates
- **Cache Warming**: Pre-warm cache for popular profiles

## Cache Invalidation Strategy

The cache invalidation strategy ensures that users always see the most up-to-date content while maintaining performance benefits.

### Implementation Details

- **Technology**: Redis + Next.js revalidation
- **Files**:
  - `lib/cache/invalidation.ts` - Cache invalidation
  - `app/api/revalidate/route.ts` - Revalidation API

### Key Features

- **Multi-Layer Invalidation**: Invalidate all cache layers
- **Targeted Invalidation**: Only invalidate affected data
- **Automatic Invalidation**: Trigger on data changes

## Monitoring and Analytics

The monitoring and analytics system tracks cache performance and helps identify optimization opportunities.

### Implementation Details

- **Technology**: Redis + Analytics
- **Files**:
  - `lib/monitoring/cache.ts` - Cache monitoring

### Key Features

- **Cache Hit/Miss Tracking**: Monitor cache performance
- **Performance Metrics**: Track response times
- **Analytics Integration**: Send data to analytics platform

## Configuration

### Environment Variables

```
# Redis Cache (Upstash)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Revalidation
REVALIDATE_TOKEN=your-revalidation-token

# Vercel (for CDN purging)
VERCEL_PROJECT_ID=your-project-id
VERCEL_DOMAIN=your-domain.com
VERCEL_PURGE_TOKEN=your-purge-token
```

### Cache TTLs

| Content Type  | Edge Cache | App Cache (ISR) | Redis Cache | Browser Cache |
| ------------- | ---------- | --------------- | ----------- | ------------- |
| Profile Pages | 5 minutes  | 30 minutes      | 1 hour      | 5 minutes     |
| Static Assets | 1 year     | N/A             | N/A         | 1 year        |
| API Responses | 5 minutes  | N/A             | 5 minutes   | 5 minutes     |
| Health Check  | 1 minute   | N/A             | N/A         | 1 minute      |

## Performance Impact

The implemented caching strategy is expected to have the following performance impact:

- **Cache Hit Rate**: 85-95% for popular profiles
- **Response Time**: 200-500ms → 50-100ms
- **Database Load**: 60-80% reduction
- **Global Load Times**: 30-50% improvement

## Maintenance and Best Practices

1. **Monitor Cache Hit Rates**: Regularly check cache performance
2. **Adjust TTLs**: Fine-tune cache durations based on data volatility
3. **Warm Cache**: Pre-warm cache for popular content
4. **Test Invalidation**: Ensure cache invalidation works correctly
5. **Update Documentation**: Keep this document up to date

## Troubleshooting

### Common Issues

1. **Stale Data**: If users see stale data, check cache invalidation
2. **High Database Load**: If database load is high, check cache hit rates
3. **Slow Response Times**: If response times are slow, check edge caching
4. **Memory Usage**: If Redis memory usage is high, adjust TTLs or clean up

### Debugging Tools

1. **Redis CLI**: Monitor Redis cache
2. **Vercel Analytics**: Check edge cache performance
3. **Supabase Dashboard**: Monitor database performance
4. **Browser DevTools**: Check client-side caching
