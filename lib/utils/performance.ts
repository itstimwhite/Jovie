// Simple performance monitoring utility
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  startTimer(operation: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      if (!this.metrics.has(operation)) {
        this.metrics.set(operation, []);
      }
      this.metrics.get(operation)!.push(duration);

      // Keep only last 100 measurements
      const measurements = this.metrics.get(operation)!;
      if (measurements.length > 100) {
        this.metrics.set(operation, measurements.slice(-100));
      }
    };
  }

  getAverageTime(operation: string): number {
    const measurements = this.metrics.get(operation);
    if (!measurements || measurements.length === 0) {
      return 0;
    }
    return (
      measurements.reduce((sum, time) => sum + time, 0) / measurements.length
    );
  }

  getMetrics(): Record<string, { avg: number; count: number }> {
    const result: Record<string, { avg: number; count: number }> = {};
    for (const [operation, measurements] of this.metrics.entries()) {
      result[operation] = {
        avg: this.getAverageTime(operation),
        count: measurements.length,
      };
    }
    return result;
  }

  clear(): void {
    this.metrics.clear();
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Utility function to measure async operations
export async function measureAsync<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const endTimer = performanceMonitor.startTimer(operation);
  try {
    const result = await fn();
    return result;
  } finally {
    endTimer();
  }
}

// Utility function to measure sync operations
export function measureSync<T>(operation: string, fn: () => T): T {
  const endTimer = performanceMonitor.startTimer(operation);
  try {
    const result = fn();
    return result;
  } finally {
    endTimer();
  }
}
