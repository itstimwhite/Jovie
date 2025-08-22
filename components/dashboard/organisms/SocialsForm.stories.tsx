import type { Meta, StoryObj } from '@storybook/react';
import { SocialsForm } from './SocialsForm';
import { userEvent, within } from '@storybook/testing-library';

// Mock the Supabase hook
jest.mock('@/lib/supabase', () => ({
  useAuthenticatedSupabase: () => ({
    getAuthenticatedClient: () => {
      const mockClient = {
        from: () => ({
          select: () => ({
            eq: () => Promise.resolve({
              data: [
                { id: 'link1', platform: 'instagram', url: 'https://instagram.com/testartist' },
                { id: 'link2', platform: 'twitter', url: 'https://twitter.com/testartist' },
              ],
              error: null,
            }),
          }),
          delete: () => ({
            eq: () => Promise.resolve({ error: null }),
          }),
          insert: () => Promise.resolve({ error: null }),
        }),
      };
      return mockClient;
    },
  }),
}));

const mockArtist = {
  id: 'artist123',
  name: 'Test Artist',
};

const meta: Meta<typeof SocialsForm> = {
  title: 'Dashboard/Organisms/SocialsForm',
  component: SocialsForm,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <Story />
      </div>
    ),
  ],
  args: {
    artist: mockArtist,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// With existing social links
export const WithExistingLinks: Story = {
  parameters: {
    // This will use the default mock which returns two social links
  },
};

// Empty state (no social links)
export const EmptyState: Story = {
  parameters: {
    mockData: {
      socialLinks: [],
    },
  },
  decorators: [
    (Story) => {
      // Override the mock to return empty data
      const originalFrom = jest.requireMock('@/lib/supabase').useAuthenticatedSupabase().getAuthenticatedClient().from;
      jest.requireMock('@/lib/supabase').useAuthenticatedSupabase().getAuthenticatedClient().from = (table: string) => {
        if (table === 'social_links') {
          return {
            select: () => ({
              eq: () => Promise.resolve({
                data: [],
                error: null,
              }),
            }),
            delete: () => ({
              eq: () => Promise.resolve({ error: null }),
            }),
            insert: () => Promise.resolve({ error: null }),
          };
        }
        return originalFrom(table);
      };
      
      return (
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Story />
        </div>
      );
    },
  ],
};

// Adding a new social link
export const AddingNewLink: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Wait for the component to load
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Click the "Add Link" button
    const addButton = canvas.getByRole('button', { name: /add link/i });
    await userEvent.click(addButton);
    
    // Wait for the new link form to appear
    await new Promise((resolve) => setTimeout(resolve, 300));
  },
};

// Removing a social link
export const RemovingLink: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Wait for the component to load
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Find and click the first "Remove" button
    const removeButtons = canvas.getAllByRole('button', { name: /remove/i });
    if (removeButtons.length > 0) {
      await userEvent.click(removeButtons[0]);
    }
    
    // Wait for the link to be removed
    await new Promise((resolve) => setTimeout(resolve, 300));
  },
};

// Submitting the form
export const Submitting: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Wait for the component to load
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Submit the form
    const submitButton = canvas.getByRole('button', { name: /save social links/i });
    await userEvent.click(submitButton);
    
    // Wait for the submission to complete
    await new Promise((resolve) => setTimeout(resolve, 300));
  },
};

// Success state
export const SuccessState: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Wait for the component to load
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Submit the form
    const submitButton = canvas.getByRole('button', { name: /save social links/i });
    await userEvent.click(submitButton);
    
    // Wait for success message
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
};

// Mobile view
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Dark mode
export const DarkMode: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto p-6 bg-gray-800 text-white rounded-lg shadow">
        <Story />
      </div>
    ),
  ],
};

