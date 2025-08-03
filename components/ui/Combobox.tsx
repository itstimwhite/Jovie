import * as Headless from '@headlessui/react';
import clsx from 'clsx';
import React, { forwardRef, useState, useMemo, useCallback } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

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
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxDisplayedOptions?: number;
  isLoading?: boolean;
}

export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      options,
      value,
      onChange,
      onInputChange,
      placeholder,
      className,
      disabled,
      maxDisplayedOptions = 8,
      isLoading = false,
    },
    ref
  ) => {
    const [query, setQuery] = useState('');

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

    return (
      <Headless.Combobox
        value={value}
        onChange={handleSelect}
        disabled={disabled}
      >
        <div className={clsx('relative', className)} ref={ref}>
          <div className="relative">
            <Headless.Combobox.Input
              className={clsx(
                'w-full rounded-xl border-0 bg-white/5 px-4 py-3.5 pr-10 text-sm/6 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm/6',
                'backdrop-blur-xl shadow-lg ring-1 ring-white/10',
                isLoading && 'animate-pulse'
              )}
              placeholder={placeholder}
              onChange={(event) => handleInputChange(event.target.value)}
              displayValue={displayValue}
            />
            <Headless.Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white/50" />
              ) : (
                <ChevronDownIcon
                  className="h-4 w-4 text-white/50"
                  aria-hidden="true"
                />
              )}
            </Headless.Combobox.Button>
          </div>

          <Headless.Combobox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white/95 backdrop-blur-xl shadow-xl ring-1 ring-white/20">
            {isLoading && query.length > 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                  <span>Searching...</span>
                </div>
              </div>
            ) : filteredOptions.length === 0 && query !== '' ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                No artists found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <Headless.Combobox.Option
                  key={option.id}
                  className={({ active }) =>
                    clsx(
                      'relative cursor-pointer select-none px-4 py-3 transition-colors',
                      active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                    )
                  }
                  value={option}
                >
                  {({ selected, active }) => (
                    <div className="flex items-center space-x-3">
                      {option.imageUrl ? (
                        <img
                          src={option.imageUrl}
                          alt=""
                          className="h-8 w-8 rounded-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200" />
                      )}
                      <span
                        className={clsx(
                          'truncate text-sm',
                          selected ? 'font-semibold' : 'font-normal'
                        )}
                      >
                        {option.name}
                      </span>
                      {selected && (
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
        </div>
      </Headless.Combobox>
    );
  }
);

Combobox.displayName = 'Combobox';
