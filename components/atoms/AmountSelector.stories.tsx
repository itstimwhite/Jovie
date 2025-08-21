import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { AmountSelector } from './AmountSelector';

const meta: Meta<typeof AmountSelector> = {
  title: 'Atoms/AmountSelector',
  component: AmountSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    amount: {
      control: { type: 'number', min: 1, max: 100 },
    },
    isSelected: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    amount: 5,
    isSelected: false,
    onClick: () => {},
  },
};

export const Selected: Story = {
  args: {
    amount: 10,
    isSelected: true,
    onClick: () => {},
  },
};

export const SmallAmount: Story = {
  args: {
    amount: 3,
    isSelected: false,
    onClick: () => {},
  },
};

export const LargeAmount: Story = {
  args: {
    amount: 25,
    isSelected: false,
    onClick: () => {},
  },
};

export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = useState(5);
    const amounts = [3, 5, 10];

    return (
      <div className="grid grid-cols-3 gap-3 w-64">
        {amounts.map((amount) => (
          <AmountSelector
            key={amount}
            amount={amount}
            isSelected={selected === amount}
            onClick={() => setSelected(amount)}
          />
        ))}
      </div>
    );
  },
};

export const InDarkMode: Story = {
  args: {
    amount: 7,
    isSelected: true,
    onClick: () => {},
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};