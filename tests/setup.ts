import '../styles/globals.css';
import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { vi } from 'vitest';
import React from 'react';

expect.extend(matchers);

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
};

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
    className,
    ...props
  }: React.ComponentProps<'img'>) => {
    return React.createElement('img', {
      src,
      alt,
      width,
      height,
      className,
      'data-testid': 'next-image',
      ...props,
    });
  },
}));

// Mock OptimizedImage component
vi.mock('@/components/ui/OptimizedImage', () => ({
  OptimizedImage: ({
    src,
    alt,
    width,
    height,
    className,
    ...props
  }: React.ComponentProps<'img'>) => {
    // If src is null or empty, render a placeholder div
    if (!src) {
      return React.createElement('div', {
        className: `bg-gray-200 animate-pulse ${className || ''}`,
        style: { width, height },
        'data-testid': 'placeholder-image',
        ...props,
      });
    }

    // For valid images, render the image directly
    return React.createElement('img', {
      src,
      alt,
      width,
      height,
      className: `${className || ''} opacity-100`,
      'data-testid': 'optimized-image',
      ...props,
    });
  },
}));

// Mock PlaceholderImage component
vi.mock('@/components/ui/PlaceholderImage', () => ({
  PlaceholderImage: ({ className, ...props }: React.ComponentProps<'div'>) => {
    return React.createElement('div', {
      className: `bg-gray-200 animate-pulse ${className || ''}`,
      'data-testid': 'placeholder-image',
      ...props,
    });
  },
}));

// Mock @headlessui/react properly
// Add display names to the mocked components
const MockedComponents = {
  Input: React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
    (props, ref) => {
      const input = React.createElement('input', {
        ...props,
        ref,
        role: 'textbox',
      });

      return input;
    }
  ),
  Select: React.forwardRef<HTMLSelectElement, React.ComponentProps<'select'>>(
    (props, ref) => {
      const select = React.createElement(
        'select',
        {
          ...props,
          ref,
          role: 'combobox',
        },
        props.children
      );

      return select;
    }
  ),
  Textarea: React.forwardRef<
    HTMLTextAreaElement,
    React.ComponentProps<'textarea'>
  >((props, ref) => {
    const textarea = React.createElement('textarea', {
      ...props,
      ref,
      role: 'textbox',
    });

    return textarea;
  }),
};

MockedComponents.Input.displayName = 'MockedInput';
MockedComponents.Select.displayName = 'MockedSelect';
MockedComponents.Textarea.displayName = 'MockedTextarea';

vi.mock('@headlessui/react', () => MockedComponents);
