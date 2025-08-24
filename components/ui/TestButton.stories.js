// Simple test story in JavaScript to isolate parsing issues
import { Button } from './Button';

export default {
  title: 'Test/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
};

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
