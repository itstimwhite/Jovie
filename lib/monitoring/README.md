# API Monitoring

This module provides functionality to track API metrics and send them to analytics providers.

## Features

- Track API request metrics (path, method, status code, duration)
- Privacy-focused: PII redaction and consent-aware
- Feature-flaggable for emergency disabling
- Works in both client and server contexts
- Integrates with PostHog and other analytics providers
- Includes middleware integration example

## Usage

### Basic Usage

```typescript
import { sendApiMetric } from '@/lib/monitoring/api';

// After processing an API request
sendApiMetric({
  path: '/api/users',
  method: 'GET',
  statusCode: 200,
  duration: 150, // milliseconds
  source: 'server',
});
```

### With Error Handling

```typescript
import { sendApiMetric } from '@/lib/monitoring/api';

try {
  // API logic here
} catch (error) {
  sendApiMetric({
    path: '/api/users',
    method: 'POST',
    statusCode: 500,
    duration: 200,
    error: error.message,
  });
  
  // Re-throw or handle error
}
```

### Middleware Integration

For consistent metrics across all API routes, use the middleware integration:

```typescript
// app/api/example/route.ts
import { NextRequest } from 'next/server';
import { withApiMetrics } from '@/lib/monitoring/middleware-example';

export async function GET(req: NextRequest) {
  return withApiMetrics(req, async () => {
    // Your API logic here
    return NextResponse.json({ success: true });
  });
}
```

## API Reference

### `sendApiMetric(data: ApiMetricData): Promise<void>`

Sends API metrics to configured analytics providers.

#### Parameters

- `data`: An object containing the following properties:
  - `path` (string): The API endpoint path
  - `method` (string): The HTTP method (GET, POST, etc.)
  - `statusCode` (number): The HTTP status code
  - `duration` (number): Request duration in milliseconds
  - `size` (number, optional): Response size in bytes
  - `error` (string, optional): Error message if applicable
  - `cached` (boolean, optional): Whether the response was served from cache
  - `source` ('server' | 'client' | 'middleware', optional): Source of the metric
  - `metadata` (object, optional): Additional metadata (will be filtered for PII)

## Feature Flag

The module respects the `feature_api_metrics` feature flag. When this flag is explicitly set to `false`, metrics collection will be disabled. This provides an emergency kill switch if needed.

## Privacy Considerations

- PII is automatically redacted from paths (e.g., `/users/123` becomes `/users/:id`)
- Sensitive fields are filtered from metadata
- Error messages are generalized to avoid leaking sensitive information
- Respects user consent settings

## Testing

Unit tests are available in the `__tests__` directory. Run them with:

```bash
npm test -- lib/monitoring
```

