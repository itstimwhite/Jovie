// Simple test story in JavaScript to isolate parsing issues
import { Button } from './Button';

const meta = {
  title: 'Test/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Primary = {
  args: {
    children: 'Test Button',
    variant: 'primary',
  },
};

export const Secondary = {
  args: {
    children: 'Test Button',
    variant: 'secondary',
  },
};
