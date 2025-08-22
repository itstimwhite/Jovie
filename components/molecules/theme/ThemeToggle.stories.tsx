import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from 'next-themes';

// Wrapper component to provide theme context
const ThemeToggleWithProvider = (
  args: React.ComponentProps<typeof ThemeToggle>
) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem={true}
    storageKey="storybook-theme"
  >
    <div className="p-4 flex items-center justify-center">
      <ThemeToggle {...args} />
    </div>
  </ThemeProvider>
);

const meta: Meta<typeof ThemeToggle> = {
  title: 'Molecules/Theme/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A toggle component for switching between light, dark, and system themes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['button', 'menu'],
      description: 'The variant of the toggle',
    },
    themeOrder: {
      control: 'object',
      description: 'The order of themes to cycle through (for button variant)',
    },
    solid: {
      control: { type: 'boolean' },
      description: 'Whether to use solid icons instead of outline',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the toggle',
    },
    announceChanges: {
      control: { type: 'boolean' },
      description: 'Whether to announce theme changes to screen readers',
    },
  },
  decorators: [
    (Story) => (
      <div className="p-8 flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
  render: (args) => <ThemeToggleWithProvider {...args} />,
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const ButtonVariant: Story = {
  args: {
    variant: 'button',
    themeOrder: ['light', 'dark', 'system'],
    solid: false,
    size: 'sm',
    announceChanges: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Button variant that cycles through themes when clicked.',
      },
    },
  },
};

export const MenuVariant: Story = {
  args: {
    variant: 'menu',
    solid: false,
    size: 'sm',
    announceChanges: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu variant that shows a dropdown with all theme options.',
      },
    },
  },
};

export const SolidIcons: Story = {
  args: {
    variant: 'button',
    themeOrder: ['light', 'dark', 'system'],
    solid: true,
    size: 'sm',
    announceChanges: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Button variant with solid icons.',
      },
    },
  },
};

export const MediumSize: Story = {
  args: {
    variant: 'button',
    themeOrder: ['light', 'dark', 'system'],
    solid: false,
    size: 'md',
    announceChanges: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium-sized button variant.',
      },
    },
  },
};

export const LargeSize: Story = {
  args: {
    variant: 'button',
    themeOrder: ['light', 'dark', 'system'],
    solid: false,
    size: 'lg',
    announceChanges: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Large-sized button variant.',
      },
    },
  },
};

export const CustomOrder: Story = {
  args: {
    variant: 'button',
    themeOrder: ['dark', 'light', 'system'],
    solid: false,
    size: 'sm',
    announceChanges: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Button variant with custom theme order.',
      },
    },
  },
};

export const MenuLarge: Story = {
  args: {
    variant: 'menu',
    solid: false,
    size: 'lg',
    announceChanges: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Large-sized menu variant.',
      },
    },
  },
};
