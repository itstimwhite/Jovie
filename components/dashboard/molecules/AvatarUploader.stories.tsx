import type { Meta, StoryObj } from '@storybook/react';
import AvatarUploader from './AvatarUploader';
import type { UploadResult } from './AvatarUploader';

const meta: Meta<typeof AvatarUploader> = {
  title: 'Dashboard/Molecules/AvatarUploader',
  component: AvatarUploader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    folder: {
      control: 'text',
      description: 'Folder path for uploaded images',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock function for onUploaded
const onUploaded = (result: UploadResult) => {
  console.log('Upload result:', result);
};

export const Default: Story = {
  args: {
    onUploaded,
    folder: 'avatars',
  },
};

export const WithCustomClass: Story = {
  args: {
    onUploaded,
    folder: 'avatars',
    className: 'p-4 border border-gray-200 rounded-lg',
  },
};

// This story simulates the disabled state when feature flag is off
export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'This story simulates the disabled state when the feature_image_cdn_cloudinary flag is off.',
      },
    },
  },
  render: () => {
    // Override the flags.feature_image_cdn_cloudinary value to false for this story
    // This is a mock implementation for Storybook only
    const DisabledAvatarUploader = () => {
      return (
        <div>
          <p className="text-sm text-neutral-500">
            Avatar uploads are currently disabled.
          </p>
        </div>
      );
    };
    
    return <DisabledAvatarUploader />;
  },
};

