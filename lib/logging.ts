/**
 * Logging utilities for the application
 * 
 * This module provides structured logging functions for different parts of the application.
 */

// Log levels
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Log event types
export type LogEventType = 
  | 'instagram_avatar_import_start'
  | 'instagram_avatar_import_success'
  | 'instagram_avatar_import_failure'
  | 'instagram_avatar_fetch_start'
  | 'instagram_avatar_fetch_success'
  | 'instagram_avatar_fetch_failure'
  | 'instagram_avatar_process_start'
  | 'instagram_avatar_process_success'
  | 'instagram_avatar_process_failure';

// Log event data
export interface LogEvent {
  type: LogEventType;
  level: LogLevel;
  message: string;
  data?: Record<string, any>;
  timestamp?: string;
  userId?: string;
}

/**
 * Log an event to the console and any configured logging services
 * 
 * @param event The event to log
 */
export function logEvent(event: LogEvent): void {
  const timestamp = event.timestamp || new Date().toISOString();
  const userId = event.userId || 'anonymous';
  
  // Add timestamp and userId to data
  const data = {
    ...event.data,
    timestamp,
    userId,
  };
  
  // Log to console in development
  if (process.env.NODE_ENV !== 'production') {
    const logFn = console[event.level] || console.log;
    logFn(`[${timestamp}] [${event.level.toUpperCase()}] [${userId}] ${event.type}: ${event.message}`, data);
  }
  
  // In production, we would send this to a logging service like Datadog, Sentry, etc.
  // This is a placeholder for future implementation
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to logging service
  }
}

/**
 * Log an Instagram avatar import event
 * 
 * @param type The event type
 * @param message The event message
 * @param data Additional event data
 * @param userId The user ID
 * @param level The log level
 */
export function logInstagramAvatarImport(
  type: LogEventType,
  message: string,
  data?: Record<string, any>,
  userId?: string,
  level: LogLevel = 'info'
): void {
  logEvent({
    type,
    level,
    message,
    data,
    userId,
  });
}

