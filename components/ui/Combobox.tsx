import * as Headless from '@headlessui/react';
import clsx from 'clsx';
import React, {
  forwardRef,
  useState,
  useMemo,
  useCallback,
  useId,
} from 'react';
import Image from 'next/image';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid';
import { LoadingSpinner } from './LoadingSpinner';

interface ComboboxOption {
  id: string;
  name: string;
  imageUrl?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: ComboboxOption | null;
  onChange: (option: ComboboxOption | null) => void;
  onInputChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  maxDisplayedOptions?: number;
  isLoading?: boolean;
  error?: string | null;
  ctaText?: string;
  showCta?: boolean;
}

export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      options,
      value,
      onChange,
      onInputChange,
      onSubmit,
      placeholder = 'Search for an artist...',
      label = 'Search for an artist',
      className,
      disabled,
      maxDisplayedOptions = 8,
      isLoading = false,
      error = null,
      ctaText = 'Claim Profile',
      showCta = true,
    },
    ref
  ) => {
    const [query, setQuery] = useState('');
    const inputId = useId();
    const listboxId = useId();
    const errorId = useId();

    // Memoize filtered options for better performance
    const filteredOptions = useMemo(() => {
      if (query === '') {
        return options.slice(0, maxDisplayedOptions);
      }

      const lowerQuery = query.toLowerCase();
      return options
        .filter((option) => option.name.toLowerCase().includes(lowerQuery))
        .slice(0, maxDisplayedOptions);
    }, [options, query, maxDisplayedOptions]);

    // Memoize the input change handler
    const handleInputChange = useCallback(
      (newQuery: string) => {
        setQuery(newQuery);
        onInputChange(newQuery);
      },
      [onInputChange]
    );

    // Memoize the select handler
    const handleSelect = useCallback(
      (option: ComboboxOption) => {
        onChange(option);
        setQuery('');
      },
      [onChange]
    );

    // Memoize the display value function
    const displayValue = useCallback((item: ComboboxOption | null) => {
      return item?.name || '';
    }, []);

    const handleSubmit = useCallback(() => {
      if (onSubmit && value) {
        onSubmit();
      }
    }, [onSubmit, value]);

    const hasResults = filteredOptions.length > 0;
    const showNoResults = query.length > 0 && !hasResults && !isLoading;
    const isValidSelection = value !== null;

    return (
      <div className={clsx('relative w-full', className)} ref={ref}>
        {/* Hidden label for screen readers */}
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>

        <Headless.Combobox
          value={value}
          onChange={handleSelect}
          disabled={disabled}
        >
          {({ open }) => (
            <>
              {/* Single container with unified styling */}
              <div
                className={clsx(
                  // Base container styles
                  'relative flex w-full overflow-hidden',
                  // Single border/ring system
                  'rounded-xl bg-white/5 backdrop-blur-xl shadow-lg ring-1 ring-white/10',
                  // Focus-within state for container
                  'focus-within:ring-2 focus-within:ring-white/20',
                  // Mobile stacking
                  'flex-col sm:flex-row',
                  // Error state
                  error && 'ring-red-500/50 focus-within:ring-red-500/50',
                  // Disabled state
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {/* Input section */}
                <div className="relative flex-1">
                  <Headless.Combobox.Input
                    id={inputId}
                    role="combobox"
                    aria-controls={listboxId}
                    aria-expanded={open}
                    aria-describedby={error ? errorId : undefined}
                    className={clsx(
                      // Remove native border and focus styles
                      'w-full border-0 bg-transparent outline-none ring-0 focus:ring-0',
                      // Typography and spacing
                      'px-4 py-3.5 text-sm/6 text-white placeholder-white/70',
                      // Height matching (44px minimum for mobile)
                      'h-12 sm:h-11',
                      // Rounded corners (left only on desktop)
                      'rounded-xl sm:rounded-l-xl sm:rounded-r-none',
                      // Focus-visible for accessibility
                      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50',
                      // Disabled state
                      disabled && 'cursor-not-allowed'
                    )}
                    placeholder={placeholder}
                    onChange={(event) => handleInputChange(event.target.value)}
                    displayValue={displayValue}
                    disabled={disabled}
                  />

                  {/* Dropdown button */}
                  <Headless.Combobox.Button
                    className={clsx(
                      'absolute inset-y-0 right-0 flex items-center justify-center w-10',
                      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50',
                      disabled && 'cursor-not-allowed'
                    )}
                    disabled={disabled}
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" className="text-white/50" />
                    ) : (
                      <ChevronDownIcon
                        className={clsx(
                          'h-4 w-4 text-white/50 transition-transform',
                          open && 'rotate-180'
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </Headless.Combobox.Button>
                </div>

                {/* Separator line */}
                {showCta && (
                  <div className="hidden sm:block w-px bg-white/10" />
                )}

                {/* CTA Button */}
                {showCta && (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={disabled || !isValidSelection}
                    className={clsx(
                      // Remove default button styles and match container
                      'border-0 shadow-none ring-0',
                      // Height and radius matching
                      'h-12 sm:h-11 rounded-xl sm:rounded-l-none sm:rounded-r-xl',
                      // Spacing
                      'px-4 sm:px-6 flex items-center justify-center',
                      // Typography
                      'text-sm font-medium',
                      // Colors
                      'bg-white text-gray-900 hover:bg-white/90 transition-colors',
                      // Disabled state
                      'disabled:bg-white/50 disabled:text-gray-500 disabled:cursor-not-allowed',
                      // Focus state
                      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
                    )}
                  >
                    <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                    {ctaText}
                  </button>
                )}
              </div>

              {/* Error message */}
              {error && (
                <p id={errorId} className="mt-2 text-sm text-red-400">
                  {error}
                </p>
              )}

              {/* Dropdown options */}
              <Headless.Combobox.Options
                id={listboxId}
                className={clsx(
                  'absolute z-50 mt-2 max-h-60 w-full overflow-auto',
                  'rounded-xl bg-white/95 backdrop-blur-xl shadow-xl ring-1 ring-white/20',
                  'focus:outline-none'
                )}
              >
                {isLoading && query.length > 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <LoadingSpinner size="sm" className="text-gray-500" />
                      <span>Searching artists...</span>
                    </div>
                  </div>
                ) : showNoResults ? (
                  <div className="px-4 py-4 text-sm text-gray-500">
                    <p className="mb-2">
                      No artists found for &quot;{query}&quot;
                    </p>
                    <p className="text-xs text-gray-400">
                      Can&apos;t find your artist?{' '}
                      <a
                        href="https://artists.spotify.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-500 underline"
                      >
                        Verify your Spotify artist profile
                      </a>
                    </p>
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <Headless.Combobox.Option
                      key={option.id}
                      role="option"
                      className={({ active }) =>
                        clsx(
                          'relative cursor-pointer select-none px-4 py-3 transition-colors',
                          'focus:outline-none',
                          active
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-900 hover:bg-gray-50'
                        )
                      }
                      value={option}
                    >
                      {({ active }) => (
                        <div className="flex items-center space-x-3">
                          {option.imageUrl ? (
                            <Image
                              src={option.imageUrl}
                              alt={`${option.name} profile picture`}
                              width={32}
                              height={32}
                              className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0" />
                          )}
                          <span
                            className={clsx(
                              'truncate text-sm',
                              active ? 'font-semibold' : 'font-normal'
                            )}
                          >
                            {option.name}
                          </span>
                          {active && (
                            <span
                              className={clsx(
                                'absolute inset-y-0 right-0 flex items-center pr-4',
                                active ? 'text-white' : 'text-indigo-600'
                              )}
                            >
                              <svg
                                className="h-4 w-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          )}
                        </div>
                      )}
                    </Headless.Combobox.Option>
                  ))
                )}
              </Headless.Combobox.Options>
            </>
          )}
        </Headless.Combobox>
      </div>
    );
  }
);

Combobox.displayName = 'Combobox';
