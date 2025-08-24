# Toast Component

A customizable toast notification system with support for different variants, durations, stacking, and reduced-motion preferences.

## Features

- **Multiple Variants**: Info, Success, Warning, Error with appropriate styling and icons
- **Customizable Durations**: Default durations based on toast type with automatic adjustment for message length
- **Stacking Behavior**: Proper stacking with configurable maximum number of visible toasts
- **Reduced-Motion Support**: Respects user's prefers-reduced-motion setting
- **Sound Effects**: Optional subtle sound effects with system mute respect
- **Positioning**: Configurable toast container position
- **Accessibility**: ARIA attributes, keyboard navigation, and focus management
- **Dark Mode Support**: Automatically adapts to light/dark mode

## Usage

### Basic Usage

```tsx
import { useToast } from '@/components/ui/ToastContainer';

function MyComponent() {
  const { showToast } = useToast();

  const handleClick = () => {
    showToast({
      message: 'Action completed successfully!',
      type: 'success',
    });
  };

  return <button onClick={handleClick}>Show Toast</button>;
}
```

### With Action Button

```tsx
showToast({
  message: 'Item deleted',
  type: 'info',
  action: {
    label: 'Undo',
    onClick: () => handleUndoDelete(),
  },
});
```

### With Custom Duration

```tsx
showToast({
  message: 'An error occurred while saving',
  type: 'error',
  duration: 10000, // 10 seconds
});
```

### With Sound Effect

```tsx
showToast({
  message: 'New message received',
  type: 'info',
  playSound: true,
});
```

### Grouping Similar Toasts

```tsx
showToast({
  message: 'File uploaded: document.pdf',
  type: 'success',
  groupSimilar: true,
});
```

## Provider Configuration

Wrap your application with the `ToastProvider` component:

```tsx
// app/layout.tsx
import { ToastProvider } from '@/components/providers/ToastProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider
          maxToasts={5}
          position="bottom-right"
          playSounds={false}
        >
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
```

### Provider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxToasts` | `number` | `5` | Maximum number of toasts to show at once |
| `position` | `string` | `'bottom-right'` | Position of the toast container |
| `playSounds` | `boolean` | `false` | Whether to play sounds for toasts by default |

## Toast Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `message` | `string` | (required) | The message to display |
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | The type of toast |
| `duration` | `number` | (varies by type) | Duration in milliseconds |
| `action` | `{ label: string, onClick: () => void }` | `undefined` | Action button configuration |
| `playSound` | `boolean` | `false` | Whether to play a sound when the toast appears |
| `groupSimilar` | `boolean` | `false` | Group similar toasts (same type and similar message) |

## Default Durations

- **Info**: 5000ms (5 seconds)
- **Success**: 3000ms (3 seconds)
- **Warning**: 6000ms (6 seconds)
- **Error**: 8000ms (8 seconds)

Duration is automatically adjusted based on message length to ensure readability.

## Accessibility

- Uses appropriate ARIA attributes (`role="alert"`, `aria-live="assertive"` for errors)
- Respects user's reduced-motion preferences
- Provides sufficient contrast for all toast variants
- Includes a close button for manual dismissal
- Ensures minimum display duration for readability

## Customization

The toast system is built with Tailwind CSS and can be customized by modifying the component styles or extending the theme.

