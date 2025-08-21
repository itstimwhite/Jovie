import type { Meta, StoryObj } from '@storybook/react';
import { UniversalLinkInput } from './UniversalLinkInput';

const meta: Meta<typeof UniversalLinkInput> = {
  title: 'Dashboard/Atoms/UniversalLinkInput',
  component: UniversalLinkInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onAdd: () => {},
  },
};

export const Disabled: Story = {
  args: {
    onAdd: () => {},
    disabled: true,
  },
};

export const CustomPlaceholder: Story = {
  args: {
    onAdd: () => {},
    placeholder: 'Paste your link here',
  },
};
