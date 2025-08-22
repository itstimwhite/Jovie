import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

// Wrapper to ensure next-themes works in Storybook
const ThemeWrapper = ({ children, initialTheme }: { children: React.ReactNode; initialTheme?: string }) => {
  const { setTheme } = useTheme();
  
  useEffect(() => {
    if (initialTheme) {
      setTheme(initialTheme);
    }
  }, [initialTheme, setTheme]);
  
  return <>{children}</>;
};

const meta: Meta<typeof ThemeToggle> = {
  title: 'Molecules/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A world-class dark mode toggle with light/dark/system themes, premium animations, and full accessibility support.',
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1f2937' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'subtle', 'bold'],
      description: 'Visual variant of the toggle',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
    },
    showLabels: {
      control: 'boolean',
      description: 'Whether to show theme labels',
    },
    dropdown: {
      control: 'boolean',
      description: 'Whether to use dropdown style instead of cycling',
    },
    reducedMotion: {
      control: 'boolean',
      description: 'Whether to use reduced motion',
    },
    onThemeChange: {
      action: 'theme-changed',
      description: 'Callback when theme changes',
    },
  },
  decorators: [
    (Story, context) => (
      <ThemeWrapper initialTheme={context.parameters?.theme}>
        <Story />
      </ThemeWrapper>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    showLabels: false,
    dropdown: false,
  },
};

export const WithLabels: Story = {
  args: {
    variant: 'default',
    size: 'md',
    showLabels: true,
    dropdown: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Toggle with visible theme labels for better clarity.',
      },
    },
  },
};

export const Dropdown: Story = {
  args: {
    variant: 'default',
    size: 'md',
    showLabels: false,
    dropdown: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dropdown style toggle allowing direct theme selection.',
      },
    },
  },
};

export const DropdownWithLabels: Story = {
  args: {
    variant: 'default',
    size: 'md',
    showLabels: true,
    dropdown: true,
  },
};

export const Subtle: Story = {
  args: {
    variant: 'subtle',
    size: 'md',
    showLabels: false,
    dropdown: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Subtle variant with border styling.',
      },
    },
  },
};

export const Bold: Story = {
  args: {
    variant: 'bold',
    size: 'md',
    showLabels: false,
    dropdown: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Bold variant with gradient background.',
      },
    },
  },
};

export const Small: Story = {
  args: {
    variant: 'default',
    size: 'sm',
    showLabels: false,
    dropdown: false,
  },
};

export const Large: Story = {
  args: {
    variant: 'default',
    size: 'lg',
    showLabels: true,
    dropdown: false,
  },
};

export const ReducedMotion: Story = {
  args: {
    variant: 'default',
    size: 'md',
    showLabels: false,
    dropdown: false,
    reducedMotion: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Toggle with reduced motion for accessibility preferences.',
      },
    },
  },
};

export const LightTheme: Story = {
  args: {
    variant: 'default',
    size: 'md',
    showLabels: true,
    dropdown: false,
  },
  parameters: {
    theme: 'light',
    backgrounds: { default: 'light' },
    docs: {
      description: {
        story: 'Toggle displayed in light theme.',
      },
    },
  },
};

export const DarkTheme: Story = {
  args: {
    variant: 'default',
    size: 'md',
    showLabels: true,
    dropdown: false,
  },
  parameters: {
    theme: 'dark',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Toggle displayed in dark theme.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-4 text-gray-700 dark:text-gray-300">Cycling Toggles</h3>
        <div className="flex gap-4 items-center flex-wrap">
          <ThemeToggle variant="default" size="sm" />
          <ThemeToggle variant="default" size="md" />
          <ThemeToggle variant="default" size="lg" />
          <ThemeToggle variant="subtle" size="md" />
          <ThemeToggle variant="bold" size="md" />
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-4 text-gray-700 dark:text-gray-300">With Labels</h3>
        <div className="flex gap-4 items-center flex-wrap">
          <ThemeToggle variant="default" size="md" showLabels />
          <ThemeToggle variant="subtle" size="md" showLabels />
          <ThemeToggle variant="bold" size="md" showLabels />
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-4 text-gray-700 dark:text-gray-300">Dropdown Style</h3>
        <div className="flex gap-4 items-center flex-wrap">
          <ThemeToggle variant="default" size="md" dropdown />
          <ThemeToggle variant="default" size="md" dropdown showLabels />
          <ThemeToggle variant="subtle" size="md" dropdown />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive showcase of all toggle variants and styles.',
      },
    },
  },
};

export const FocusStates: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Use Tab key to navigate between toggles and test focus states:
      </p>
      <div className="flex gap-4 items-center">
        <ThemeToggle variant="default" size="md" />
        <ThemeToggle variant="subtle" size="md" />
        <ThemeToggle variant="bold" size="md" />
        <ThemeToggle variant="default" size="md" dropdown />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates focus states and keyboard navigation.',
      },
    },
  },
};

export const ResponsiveDemo: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-4 text-gray-700 dark:text-gray-300">Mobile (Small)</h3>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm">Theme</span>
            <ThemeToggle size="sm" />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-4 text-gray-700 dark:text-gray-300">Desktop (Large)</h3>
        <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-base">Theme Preference</span>
            <ThemeToggle size="lg" showLabels dropdown />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates responsive usage patterns for mobile and desktop.',
      },
    },
  },
};