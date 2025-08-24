'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { Input } from './Input';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import {
  validateUsernameFormat,
  generateUsernameSuggestions,
  debounce,
  type ClientValidationResult,
} from '@/lib/validation/client-username';

interface SmartHandleInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (validation: HandleValidationState) => void;
  placeholder?: string;
  prefix?: string;
  showAvailability?: boolean;
  formatHints?: boolean;
  disabled?: boolean;
  artistName?: string;
  className?: string;
}

export interface HandleValidationState {
  available: boolean;
  checking: boolean;
  error: string | null;
  clientValid: boolean;
  suggestions: string[];
}

export function SmartHandleInput({
  value,
  onChange,
  onValidationChange,
  placeholder = 'yourname',
  prefix = 'jovie.link/',
  showAvailability = true,
  formatHints = true,
  disabled = false,
  artistName,
  className = '',
}: SmartHandleInputProps) {
  // Handle validation state
  const [handleValidation, setHandleValidation] =
    useState<HandleValidationState>({
      available: false,
      checking: false,
      error: null,
      clientValid: false,
      suggestions: [],
    });

  // Abort controller for canceling in-flight requests
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastValidatedRef = useRef<{
    handle: string;
    available: boolean;
  } | null>(null);

  // Instant client-side validation (optimized for <50ms response time)
  const validateClientSide = useCallback(
    (handleValue: string): ClientValidationResult => {
      return validateUsernameFormat(handleValue);
    },
    []
  );

  // Memoized client validation result
  const clientValidation = useMemo(
    () => validateClientSide(value),
    [value, validateClientSide]
  );

  // Memoized username suggestions
  const usernameSuggestions = useMemo(() => {
    if (clientValidation.valid || !value) return [];
    return generateUsernameSuggestions(value, artistName);
  }, [value, artistName, clientValidation.valid]);

  // Debounced API validation with reduced delay for better UX
  const debouncedApiValidation = useMemo(
    () =>
      debounce(async (handleValue: string) => {
        if (!clientValidation.valid) return;

        // Check cache first
        if (lastValidatedRef.current?.handle === handleValue) {
          const { available } = lastValidatedRef.current;
          const newValidation = {
            ...handleValidation,
            available,
            checking: false,
            error: available ? null : 'Handle already taken',
          };
          setHandleValidation(newValidation);
          onValidationChange?.(newValidation);
          return;
        }

        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        // Add small delay to prevent flickering for very fast responses
        const checkingTimeout = setTimeout(() => {
          const newValidation = {
            ...handleValidation,
            checking: true,
            error: null,
          };
          setHandleValidation(newValidation);
          onValidationChange?.(newValidation);
        }, 200); // 200ms delay

        try {
          // Add timeout to prevent infinite loading
          const timeoutId = setTimeout(() => {
            abortController.abort();
          }, 5000); // 5 second timeout

          const response = await fetch(
            `/api/handle/check?handle=${encodeURIComponent(handleValue.toLowerCase())}`,
            {
              signal: abortController.signal,
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            }
          );

          clearTimeout(timeoutId);
          clearTimeout(checkingTimeout);

          if (abortController.signal.aborted) return;

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const result = await response.json();
          const available = !!result.available;

          const finalValidation = {
            ...handleValidation,
            available,
            checking: false,
            error: available ? null : result.error || 'Handle already taken',
          };

          setHandleValidation(finalValidation);
          onValidationChange?.(finalValidation);
          lastValidatedRef.current = { handle: handleValue, available };
        } catch (error) {
          clearTimeout(checkingTimeout);

          if (error instanceof Error && error.name === 'AbortError') {
            // Handle timeout specifically
            const timeoutValidation = {
              ...handleValidation,
              available: false,
              checking: false,
              error: 'Check timed out - please try again',
            };
            setHandleValidation(timeoutValidation);
            onValidationChange?.(timeoutValidation);
            return;
          }

          console.error('Handle validation error:', error);

          // Provide more specific error messages
          let errorMessage = 'Network error';
          if (error instanceof TypeError && error.message.includes('fetch')) {
            errorMessage = 'Connection failed - check your internet';
          } else if (error instanceof Error) {
            errorMessage = error.message.includes('HTTP')
              ? 'Server error - please try again'
              : 'Network error';
          }

          const errorValidation = {
            ...handleValidation,
            available: false,
            checking: false,
            error: errorMessage,
          };
          setHandleValidation(errorValidation);
          onValidationChange?.(errorValidation);
          lastValidatedRef.current = { handle: handleValue, available: false };
        }
      }, 500), // Reduced debounce from 1000ms to 500ms for better UX
    [clientValidation.valid, handleValidation, onValidationChange]
  );

  // Update validation state when handle or client validation changes
  useEffect(() => {
    // Update client validation state immediately
    const newValidation = {
      ...handleValidation,
      clientValid: clientValidation.valid,
      error: clientValidation.error,
      suggestions: usernameSuggestions,
      available: clientValidation.valid ? handleValidation.available : false,
    };

    setHandleValidation(newValidation);
    onValidationChange?.(newValidation);

    // Only trigger API validation for format-valid handles
    if (clientValidation.valid && value.length >= 3) {
      debouncedApiValidation(value);
    }
  }, [
    value,
    clientValidation,
    usernameSuggestions,
    debouncedApiValidation,
    onValidationChange,
    handleValidation,
  ]);

  const getValidationIcon = () => {
    if (handleValidation.checking) {
      return <LoadingSpinner size="sm" />;
    }
    if (
      handleValidation.available &&
      !handleValidation.checking &&
      clientValidation.valid
    ) {
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
    }
    if (handleValidation.error || !clientValidation.valid) {
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
    }
    return null;
  };

  const getStatusMessage = () => {
    if (handleValidation.checking) {
      return 'Checking availability...';
    }
    if (handleValidation.available && clientValidation.valid) {
      return `@${value} is available!`;
    }
    if (handleValidation.error) {
      return handleValidation.error;
    }
    if (clientValidation.error) {
      return clientValidation.error;
    }
    return null;
  };

  const statusMessage = getStatusMessage();

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Input with prefix and validation icon */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm font-mono z-10">
          {prefix}
        </div>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="font-mono pl-20"
          inputClassName="font-mono"
          validationState={
            !value
              ? null
              : handleValidation.error || clientValidation.error
                ? 'invalid'
                : handleValidation.available && clientValidation.valid
                  ? 'valid'
                  : handleValidation.checking
                    ? 'pending'
                    : null
          }
          statusIcon={showAvailability ? getValidationIcon() : undefined}
          aria-describedby="handle-status handle-preview"
          aria-label="Enter your desired handle"
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
          inputMode="text"
          id="handle-input"
        />
      </div>

      {/* Live preview */}
      <div
        className="text-xs text-gray-500 dark:text-gray-400"
        id="handle-preview"
      >
        Your profile will be live at{' '}
        <span className="font-mono text-gray-700 dark:text-gray-300">
          {prefix}
          {value || placeholder}
        </span>
      </div>

      {/* Status message - always reserve space to prevent layout shift */}
      <div
        className={`text-xs min-h-[1.25rem] transition-all duration-300 ${
          statusMessage
            ? handleValidation.available && clientValidation.valid
              ? 'text-green-600 dark:text-green-400 opacity-100'
              : 'text-red-600 dark:text-red-400 opacity-100'
            : 'opacity-0'
        }`}
        id="handle-status"
        role="status"
        aria-live="polite"
      >
        {statusMessage || '\u00A0'}{' '}
        {/* Non-breaking space to maintain height */}
      </div>

      {/* Username suggestions */}
      {formatHints && handleValidation.suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Try these instead:
          </p>
          <div className="flex flex-wrap gap-2">
            {handleValidation.suggestions.slice(0, 3).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onChange(suggestion)}
                className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors duration-150 font-mono"
                disabled={disabled}
              >
                @{suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Format hints */}
      {formatHints && !value && (
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>Great handles are:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li>Short and memorable (3-15 characters)</li>
            <li>Easy to type and share</li>
            <li>Consistent with your brand</li>
          </ul>
        </div>
      )}
    </div>
  );
}
