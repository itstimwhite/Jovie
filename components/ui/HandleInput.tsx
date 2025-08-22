'use client';

import { forwardRef, useMemo } from 'react';
import { Input } from './Input';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

interface HandleInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidate?: (handle: string) => {
    valid: boolean;
    suggestions: string[];
    message: string | null;
  };
  prefix?: string;
  showAvailability?: boolean;
  showLivePreview?: boolean;
  formatHints?: boolean;
  suggestions?: string[];
  isChecking?: boolean;
  isAvailable?: boolean;
  error?: string | null;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export const HandleInput = forwardRef<HTMLInputElement, HandleInputProps>(
  (
    {
      value,
      onChange,
      onValidate,
      prefix = 'jovie.link/',
      showAvailability = true,
      showLivePreview = true,
      formatHints = true,
      suggestions = [],
      isChecking = false,
      isAvailable = false,
      error = null,
      disabled = false,
      className = '',
      placeholder = 'your-handle',
      ...props
    },
    ref
  ) => {
    const validationStatus = useMemo(() => {
      if (!value) return null;
      if (error) return 'error';
      if (isChecking) return 'checking';
      if (isAvailable) return 'available';
      return 'unavailable';
    }, [value, error, isChecking, isAvailable]);

    const statusIcon = useMemo(() => {
      switch (validationStatus) {
        case 'checking':
          return <LoadingSpinner size="sm" />;
        case 'available':
          return (
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-2.5 h-2.5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          );
        case 'unavailable':
          return (
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <svg
                className="w-2.5 h-2.5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          );
        default:
          return null;
      }
    }, [validationStatus]);

    const availabilityMessage = useMemo(() => {
      if (!showAvailability || !value) return null;
      
      switch (validationStatus) {
        case 'checking':
          return (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Checking availability...
            </p>
          );
        case 'available':
          return (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              ✓ @{value} is available!
            </p>
          );
        case 'unavailable':
          return (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              × @{value} is already taken
            </p>
          );
        case 'error':
          return error ? (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {error}
            </p>
          ) : null;
        default:
          return null;
      }
    }, [showAvailability, value, validationStatus, error]);

    const formatHintsText = useMemo(() => {
      if (!formatHints) return null;
      return (
        <div className="mt-2 space-y-1">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Tips for a great handle:
          </p>
          <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-0.5 ml-2">
            <li>• Keep it short and memorable</li>
            <li>• Use letters, numbers, and hyphens only</li>
            <li>• No spaces or special characters</li>
          </ul>
        </div>
      );
    }, [formatHints]);

    return (
      <div className="space-y-2">
        {/* Main Input */}
        <div className="relative">
          <Input
            ref={ref}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`font-mono pr-8 ${className}`}
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            inputMode="text"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={showLivePreview ? 'handle-preview' : undefined}
            {...props}
          />
          
          {/* Status Icon */}
          {statusIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
              {statusIcon}
            </div>
          )}
        </div>

        {/* Live Preview */}
        {showLivePreview && (
          <p
            className="text-xs text-gray-500 dark:text-gray-400"
            id="handle-preview"
          >
            Your link: {prefix}
            <span className={value ? 'text-gray-900 dark:text-white font-medium' : ''}>
              {value || placeholder}
            </span>
          </p>
        )}

        {/* Availability Message */}
        {availabilityMessage}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Try these instead:
            </p>
            <div className="flex flex-wrap gap-1">
              {suggestions.slice(0, 3).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onChange(suggestion)}
                  disabled={disabled}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Format Hints */}
        {formatHintsText}
      </div>
    );
  }
);

HandleInput.displayName = 'HandleInput';