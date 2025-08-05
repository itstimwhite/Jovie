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

// Mock @headlessui/react properly with all components
const MockedComponents = {
  // Dialog components
  Dialog: React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
    (props, ref) => {
      return React.createElement('div', { ...props, ref, role: 'dialog' });
    }
  ),
  DialogPanel: React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
    (props, ref) => {
      return React.createElement('div', { ...props, ref });
    }
  ),
  DialogTitle: React.forwardRef<HTMLHeadingElement, React.ComponentProps<'h2'>>(
    (props, ref) => {
      return React.createElement('h2', { ...props, ref });
    }
  ),
  DialogDescription: React.forwardRef<
    HTMLParagraphElement,
    React.ComponentProps<'p'>
  >((props, ref) => {
    return React.createElement('p', { ...props, ref });
  }),
  DialogBackdrop: React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
    (props, ref) => {
      return React.createElement('div', { ...props, ref });
    }
  ),

  // Combobox components
  Combobox: React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
    (props, ref) => {
      return React.createElement('div', { ...props, ref });
    }
  ),
  ComboboxInput: React.forwardRef<
    HTMLInputElement,
    React.ComponentProps<'input'>
  >((props, ref) => {
    return React.createElement('input', { ...props, ref, role: 'textbox' });
  }),
  ComboboxButton: React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<'button'>
  >((props, ref) => {
    return React.createElement('button', { ...props, ref });
  }),
  ComboboxOptions: React.forwardRef<
    HTMLUListElement,
    React.ComponentProps<'ul'>
  >((props, ref) => {
    return React.createElement('ul', { ...props, ref, role: 'listbox' });
  }),
  ComboboxOption: React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
    (props, ref) => {
      return React.createElement('li', { ...props, ref, role: 'option' });
    }
  ),

  // Listbox components
  Listbox: React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
    (props, ref) => {
      return React.createElement('div', { ...props, ref });
    }
  ),
  ListboxButton: React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<'button'>
  >((props, ref) => {
    return React.createElement('button', { ...props, ref });
  }),
  ListboxOptions: React.forwardRef<
    HTMLUListElement,
    React.ComponentProps<'ul'>
  >((props, ref) => {
    return React.createElement('ul', { ...props, ref, role: 'listbox' });
  }),
  ListboxOption: React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
    (props, ref) => {
      return React.createElement('li', { ...props, ref, role: 'option' });
    }
  ),

  // Menu components
  Menu: React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
    (props, ref) => {
      return React.createElement('div', { ...props, ref });
    }
  ),
  MenuButton: React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<'button'>
  >((props, ref) => {
    return React.createElement('button', { ...props, ref });
  }),
  MenuItems: React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
    (props, ref) => {
      return React.createElement('div', { ...props, ref, role: 'menu' });
    }
  ),
  MenuItem: React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
    (props, ref) => {
      return React.createElement('div', { ...props, ref, role: 'menuitem' });
    }
  ),

  // Popover components
  Popover: React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
    (props, ref) => {
      return React.createElement('div', { ...props, ref });
    }
  ),
  PopoverButton: React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<'button'>
  >((props, ref) => {
    return React.createElement('button', { ...props, ref });
  }),
  PopoverPanel: React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
    (props, ref) => {
      return React.createElement('div', { ...props, ref });
    }
  ),

  // RadioGroup components
  RadioGroup: React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
    (props, ref) => {
      return React.createElement('div', { ...props, ref, role: 'radiogroup' });
    }
  ),
  RadioGroupOption: React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<'div'>
  >((props, ref) => {
    return React.createElement('div', { ...props, ref, role: 'radio' });
  }),

  // Switch components
  Switch: React.forwardRef<HTMLButtonElement, React.ComponentProps<'button'>>(
    (props, ref) => {
      return React.createElement('button', { ...props, ref, role: 'switch' });
    }
  ),

  // Tab components
  Tab: React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
    (props, ref) => {
      return React.createElement('div', { ...props, ref, role: 'tab' });
    }
  ),
  TabGroup: React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
    (props, ref) => {
      return React.createElement('div', { ...props, ref, role: 'tablist' });
    }
  ),
  TabList: React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
    (props, ref) => {
      return React.createElement('div', { ...props, ref });
    }
  ),
  TabPanels: React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
    (props, ref) => {
      return React.createElement('div', { ...props, ref });
    }
  ),
  TabPanel: React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
    (props, ref) => {
      return React.createElement('div', { ...props, ref, role: 'tabpanel' });
    }
  ),

  // Transition components
  Transition: React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
    (props, ref) => {
      return React.createElement('div', { ...props, ref });
    }
  ),
  TransitionChild: React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<'div'>
  >((props, ref) => {
    return React.createElement('div', { ...props, ref });
  }),

  // Description component
  Description: React.forwardRef<
    HTMLParagraphElement,
    React.ComponentProps<'p'>
  >((props, ref) => {
    return React.createElement('p', { ...props, ref });
  }),
};

// Add display names to all mocked components
MockedComponents.Dialog.displayName = 'MockedDialog';
MockedComponents.DialogPanel.displayName = 'MockedDialogPanel';
MockedComponents.DialogTitle.displayName = 'MockedDialogTitle';
MockedComponents.DialogDescription.displayName = 'MockedDialogDescription';
MockedComponents.DialogBackdrop.displayName = 'MockedDialogBackdrop';

MockedComponents.Combobox.displayName = 'MockedCombobox';
MockedComponents.ComboboxInput.displayName = 'MockedComboboxInput';
MockedComponents.ComboboxButton.displayName = 'MockedComboboxButton';
MockedComponents.ComboboxOptions.displayName = 'MockedComboboxOptions';
MockedComponents.ComboboxOption.displayName = 'MockedComboboxOption';

MockedComponents.Listbox.displayName = 'MockedListbox';
MockedComponents.ListboxButton.displayName = 'MockedListboxButton';
MockedComponents.ListboxOptions.displayName = 'MockedListboxOptions';
MockedComponents.ListboxOption.displayName = 'MockedListboxOption';

MockedComponents.Menu.displayName = 'MockedMenu';
MockedComponents.MenuButton.displayName = 'MockedMenuButton';
MockedComponents.MenuItems.displayName = 'MockedMenuItems';
MockedComponents.MenuItem.displayName = 'MockedMenuItem';

MockedComponents.Popover.displayName = 'MockedPopover';
MockedComponents.PopoverButton.displayName = 'MockedPopoverButton';
MockedComponents.PopoverPanel.displayName = 'MockedPopoverPanel';

MockedComponents.RadioGroup.displayName = 'MockedRadioGroup';
MockedComponents.RadioGroupOption.displayName = 'MockedRadioGroupOption';

MockedComponents.Switch.displayName = 'MockedSwitch';

MockedComponents.Tab.displayName = 'MockedTab';
MockedComponents.TabGroup.displayName = 'MockedTabGroup';
MockedComponents.TabList.displayName = 'MockedTabList';
MockedComponents.TabPanels.displayName = 'MockedTabPanels';
MockedComponents.TabPanel.displayName = 'MockedTabPanel';

MockedComponents.Transition.displayName = 'MockedTransition';
MockedComponents.TransitionChild.displayName = 'MockedTransitionChild';

MockedComponents.Description.displayName = 'MockedDescription';

vi.mock('@headlessui/react', () => MockedComponents);
