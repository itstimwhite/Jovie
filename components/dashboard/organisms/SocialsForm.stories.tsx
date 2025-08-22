import type { Meta, StoryObj } from '@storybook/react';
import { SocialsForm } from './SocialsForm';
import * as React from 'react';

// Create a mock implementation of the SocialsForm component for Storybook
function MockedSocialsForm({
  initialLinks = [
    { id: '1', platform: 'instagram', url: 'https://instagram.com/artist' },
    { id: '2', platform: 'twitter', url: 'https://twitter.com/artist' },
  ],
  showError = false,
  showSuccess = false,
  isLoading = false,
  isEmpty = false,
}) {
  const [loading, setLoading] = React.useState(isLoading);
  const [error, setError] = React.useState(
    showError ? 'Failed to update social links' : undefined
  );
  const [success, setSuccess] = React.useState(showSuccess);
  const [socialLinks, setSocialLinks] = React.useState(
    isEmpty ? [] : initialLinks
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    setSuccess(false);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (showError) {
        setError('Failed to update social links');
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    }, 1000);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const updateSocialLink = (
    index: number,
    field: 'platform' | 'url',
    value: string
  ) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setSocialLinks(updatedLinks);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Social Media Links
        </h3>
        <button
          type="button"
          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() =>
            setSocialLinks([
              ...socialLinks,
              { id: Date.now().toString(), platform: 'instagram', url: '' },
            ])
          }
        >
          Add Link
        </button>
      </div>

      {socialLinks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No social media links added yet.
          </p>
          <button
            type="button"
            className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() =>
              setSocialLinks([
                { id: Date.now().toString(), platform: 'instagram', url: '' },
              ])
            }
          >
            Add Your First Link
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {socialLinks.map((link, index) => (
            <div
              key={link.id || index}
              className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Platform
                </label>
                <select
                  value={link.platform}
                  onChange={(e) =>
                    updateSocialLink(index, 'platform', e.target.value)
                  }
                  className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="website">Website</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) =>
                    updateSocialLink(index, 'url', e.target.value)
                  }
                  placeholder="https://..."
                  className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <button
                type="button"
                onClick={() => removeSocialLink(index)}
                className="mt-6 inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Saving...' : 'Save Social Links'}
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <p className="text-sm text-green-600 dark:text-green-400">
            Social links saved successfully!
          </p>
        </div>
      )}
    </div>
  );
}

const meta: Meta<typeof SocialsForm> = {
  title: 'Dashboard/Organisms/SocialsForm',
  component: SocialsForm,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-3xl mx-auto p-6">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    artist: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<typeof SocialsForm>;

// Use our mocked component for stories
export const Default: Story = {
  render: () => <MockedSocialsForm />,
};

export const WithValidationError: Story = {
  render: () => <MockedSocialsForm showError={true} />,
};

export const WithSuccessMessage: Story = {
  render: () => <MockedSocialsForm showSuccess={true} />,
};

export const EmptyState: Story = {
  render: () => <MockedSocialsForm isEmpty={true} />,
};

export const Loading: Story = {
  render: () => <MockedSocialsForm isLoading={true} />,
};

export const DarkMode: Story = {
  render: () => (
    <div className="dark max-w-3xl mx-auto p-6 bg-gray-900 text-white">
      <MockedSocialsForm />
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const MobileView: Story = {
  render: () => (
    <div className="max-w-full mx-auto p-4">
      <MockedSocialsForm />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
