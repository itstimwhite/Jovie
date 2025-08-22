import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendApiMetric, ApiMetricData } from '../api';
import posthog from 'posthog-js';

// Mock PostHog
vi.mock('posthog-js', () => ({
  default: {
    capture: vi.fn(),
    isFeatureEnabled: vi.fn(),
  },
}));

// Mock constants
vi.mock('@/constants/app', () => ({
  ANALYTICS: {
    posthogKey: 'test-key',
  },
}));

describe('API Monitoring', () => {
  // Save original console methods
  const originalConsoleDebug = console.debug;
  const originalConsoleWarn = console.warn;
  
  beforeEach(() => {
    // Mock console methods
    console.debug = vi.fn();
    console.warn = vi.fn();
    
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock window for client-side tests
    Object.defineProperty(global, 'window', {
      value: {},
      writable: true,
    });
  });
  
  afterEach(() => {
    // Restore console methods
    console.debug = originalConsoleDebug;
    console.warn = originalConsoleWarn;
    
    // Reset window mock
    Object.defineProperty(global, 'window', {
      value: undefined,
      writable: true,
    });
  });
  
  it('should send metrics to PostHog when enabled', async () => {
    // Setup
    const mockData: ApiMetricData = {
      path: '/api/test',
      method: 'GET',
      statusCode: 200,
      duration: 150,
      source: 'client',
    };
    
    // Mock feature flag check to return true (enabled)
    (posthog.isFeatureEnabled as any).mockReturnValue(true);
    
    // Execute
    await sendApiMetric(mockData);
    
    // Verify
    expect(posthog.capture).toHaveBeenCalledWith('api_request', expect.objectContaining({
      path: '/api/test',
      method: 'GET',
      status_code: 200,
      duration_ms: 150,
      source: 'client',
    }));
  });
  
  it('should sanitize paths with potential PII', async () => {
    // Setup
    const mockData: ApiMetricData = {
      path: '/api/users/12345/profile',
      method: 'GET',
      statusCode: 200,
      duration: 150,
    };
    
    // Mock feature flag check to return true (enabled)
    (posthog.isFeatureEnabled as any).mockReturnValue(true);
    
    // Execute
    await sendApiMetric(mockData);
    
    // Verify
    expect(posthog.capture).toHaveBeenCalledWith('api_request', expect.objectContaining({
      path: '/api/users/:id/profile',
    }));
  });
  
  it('should not send metrics when feature flag disables it', async () => {
    // Setup
    const mockData: ApiMetricData = {
      path: '/api/test',
      method: 'GET',
      statusCode: 200,
      duration: 150,
    };
    
    // Mock feature flag check to return false (disabled)
    (posthog.isFeatureEnabled as any).mockReturnValue(false);
    
    // Execute
    await sendApiMetric(mockData);
    
    // Verify
    expect(posthog.capture).not.toHaveBeenCalled();
  });
  
  it('should handle errors gracefully', async () => {
    // Setup
    const mockData: ApiMetricData = {
      path: '/api/test',
      method: 'GET',
      statusCode: 500,
      duration: 150,
      error: 'Internal Server Error: Database connection failed',
    };
    
    // Mock feature flag check to return true (enabled)
    (posthog.isFeatureEnabled as any).mockReturnValue(true);
    
    // Mock PostHog to throw an error
    (posthog.capture as any).mockImplementation(() => {
      throw new Error('PostHog error');
    });
    
    // Execute
    await sendApiMetric(mockData);
    
    // Verify
    expect(console.warn).toHaveBeenCalledWith(
      '[API Metrics] Failed to send metric:',
      expect.any(Error)
    );
  });
  
  it('should filter out sensitive metadata', async () => {
    // Setup
    const mockData: ApiMetricData = {
      path: '/api/test',
      method: 'POST',
      statusCode: 201,
      duration: 150,
      metadata: {
        contentType: 'application/json',
        requestSize: 1024,
        authToken: 'secret-token', // Should be filtered out
        userEmail: 'test@example.com', // Should be filtered out
        cacheHit: false,
      },
    };
    
    // Mock feature flag check to return true (enabled)
    (posthog.isFeatureEnabled as any).mockReturnValue(true);
    
    // Execute
    await sendApiMetric(mockData);
    
    // Verify
    expect(posthog.capture).toHaveBeenCalledWith('api_request', expect.objectContaining({
      metadata: expect.objectContaining({
        contentType: 'application/json',
        requestSize: 1024,
        cacheHit: false,
      }),
    }));
    
    // Verify sensitive fields are not included
    const captureCall = (posthog.capture as any).mock.calls[0][1];
    expect(captureCall.metadata).not.toHaveProperty('authToken');
    expect(captureCall.metadata).not.toHaveProperty('userEmail');
  });
});

