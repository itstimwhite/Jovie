import type { Meta, StoryObj } from '@storybook/react';
import { ArtistSelectionForm } from './ArtistSelectionForm';
import { ThemeProvider } from 'next-themes';
import { vi } from 'vitest';

// Mock the hooks and modules
import * as NextNavigation from 'next/navigation';
import * as ArtistSearchHook from '@/lib/hooks/useArtistSearch';

// Define a minimal router type for mocking
interface MockRouter {
  push: (url: string) => void;
  back: () => void;
  forward: () => void;
  refresh: () => void;
  replace: (url: string) => void;
  prefetch: (url: string) => void;
}

// Sample artist data for mocking
const sampleArtists = [
  {
    id: '1Xyo4u8uXC1ZmMpatF05PJ',
    name: 'The Weeknd',
    imageUrl:
      'https://i.scdn.co/image/ab6761610000e5eb94fbdb362091111a47db337d',
    popularity: 92,
    followers: 45687321,
    spotifyUrl: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ',
  },
  {
    id: '06HL4z0CvFAxyc27GXpf02',
    name: 'Taylor Swift',
    imageUrl:
      'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0',
    popularity: 96,
    followers: 72541896,
    spotifyUrl: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02',
  },
  {
    id: '3TVXtAsR1Inumwj472S9r4',
    name: 'Drake',
    imageUrl:
      'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9',
    popularity: 94,
    followers: 65874123,
    spotifyUrl: 'https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4',
  },
  {
    id: '0Y5tJX1MQlPlqiwlOH1tJY',
    name: 'Travis Scott',
    imageUrl:
      'https://i.scdn.co/image/ab6761610000e5eb59ba2594b5aa3e3e3cfcce8c',
    popularity: 90,
    followers: 25478963,
    spotifyUrl: 'https://open.spotify.com/artist/0Y5tJX1MQlPlqiwlOH1tJY',
  },
  {
    id: '6eUKZXaKkcviH0Ku9w2n3V',
    name: 'Ed Sheeran',
    imageUrl:
      'https://i.scdn.co/image/ab6761610000e5eb3bcef85e105dfc42399ef0ba',
    popularity: 93,
    followers: 98745632,
    spotifyUrl: 'https://open.spotify.com/artist/6eUKZXaKkcviH0Ku9w2n3V',
  },
];

// Mock sessionStorage
const mockSessionStorage = () => {
  let store: Record<string, string> = {};

  // Save the original sessionStorage
  const originalSessionStorage = window.sessionStorage;

  // Replace with mock implementation
  Object.defineProperty(window, 'sessionStorage', {
    value: {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    },
    writable: true,
  });

  // Return a function to reset the mock and restore original
  return {
    reset: () => {
      store = {};
    },
    restore: () => {
      Object.defineProperty(window, 'sessionStorage', {
        value: originalSessionStorage,
        writable: true,
      });
    },
  };
};

const meta: Meta<typeof ArtistSelectionForm> = {
  title: 'Dashboard/Organisms/ArtistSelectionForm',
  component: ArtistSelectionForm,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ArtistSelectionForm>;

// Base story with default state
export const Default: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      // Set up mocks
      const storage = mockSessionStorage();
      storage.reset();

      // Mock the router
      const pushMock = vi.fn();
      vi.spyOn(NextNavigation, 'useRouter').mockImplementation(
        (): MockRouter => ({
          push: pushMock,
          back: vi.fn(),
          forward: vi.fn(),
          refresh: vi.fn(),
          replace: vi.fn(),
          prefetch: vi.fn(),
        })
      );

      // Mock the artist search hook with default state
      vi.spyOn(ArtistSearchHook, 'useArtistSearch').mockImplementation(() => ({
        searchResults: [],
        isLoading: false,
        error: null,
        searchArtists: vi.fn(),
        clearResults: vi.fn(),
      }));

      return <Story />;
    },
  ],
};

// Story with search results
export const WithSearchResults: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      // Set up mocks
      const storage = mockSessionStorage();
      storage.reset();

      // Mock the router
      const pushMock = vi.fn();
      vi.spyOn(NextNavigation, 'useRouter').mockImplementation(
        (): MockRouter => ({
          push: pushMock,
          back: vi.fn(),
          forward: vi.fn(),
          refresh: vi.fn(),
          replace: vi.fn(),
          prefetch: vi.fn(),
        })
      );

      // Mock the artist search hook with search results
      const searchArtistsMock = vi.fn();
      vi.spyOn(ArtistSearchHook, 'useArtistSearch').mockImplementation(() => ({
        searchResults: sampleArtists,
        isLoading: false,
        error: null,
        searchArtists: searchArtistsMock,
        clearResults: vi.fn(),
      }));

      return <Story />;
    },
  ],
};

// Story with loading state
export const Loading: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      // Set up mocks
      const storage = mockSessionStorage();
      storage.reset();

      // Mock the router
      const pushMock = vi.fn();
      vi.spyOn(NextNavigation, 'useRouter').mockImplementation(
        (): MockRouter => ({
          push: pushMock,
          back: vi.fn(),
          forward: vi.fn(),
          refresh: vi.fn(),
          replace: vi.fn(),
          prefetch: vi.fn(),
        })
      );

      // Mock the artist search hook with loading state
      vi.spyOn(ArtistSearchHook, 'useArtistSearch').mockImplementation(() => ({
        searchResults: [],
        isLoading: true,
        error: null,
        searchArtists: vi.fn(),
        clearResults: vi.fn(),
      }));

      return <Story />;
    },
  ],
};

// Story with error state
export const WithError: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      // Set up mocks
      const storage = mockSessionStorage();
      storage.reset();

      // Mock the router
      const pushMock = vi.fn();
      vi.spyOn(NextNavigation, 'useRouter').mockImplementation(
        (): MockRouter => ({
          push: pushMock,
          back: vi.fn(),
          forward: vi.fn(),
          refresh: vi.fn(),
          replace: vi.fn(),
          prefetch: vi.fn(),
        })
      );

      // Mock the artist search hook with error state
      vi.spyOn(ArtistSearchHook, 'useArtistSearch').mockImplementation(() => ({
        searchResults: [],
        isLoading: false,
        error: 'Failed to search artists',
        searchArtists: vi.fn(),
        clearResults: vi.fn(),
      }));

      return <Story />;
    },
  ],
};

// Story with pending claim
export const WithPendingClaim: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      // Set up mocks
      const storage = mockSessionStorage();
      storage.reset();

      // Set up pending claim in session storage
      const pendingClaim = {
        spotifyId: '1Xyo4u8uXC1ZmMpatF05PJ',
        artistName: 'The Weeknd',
        timestamp: Date.now(),
      };
      window.sessionStorage.setItem(
        'pendingClaim',
        JSON.stringify(pendingClaim)
      );

      // Mock the router
      const pushMock = vi.fn();
      vi.spyOn(NextNavigation, 'useRouter').mockImplementation(
        (): MockRouter => ({
          push: pushMock,
          back: vi.fn(),
          forward: vi.fn(),
          refresh: vi.fn(),
          replace: vi.fn(),
          prefetch: vi.fn(),
        })
      );

      // Mock the artist search hook with matching artist
      vi.spyOn(ArtistSearchHook, 'useArtistSearch').mockImplementation(() => ({
        searchResults: [sampleArtists[0]], // The Weeknd
        isLoading: false,
        error: null,
        searchArtists: vi.fn(),
        clearResults: vi.fn(),
      }));

      return <Story />;
    },
  ],
};

// Story with dark theme
export const DarkTheme: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    backgrounds: {
      default: 'dark',
    },
  },
  decorators: [
    (Story) => {
      // Set up mocks
      const storage = mockSessionStorage();
      storage.reset();

      // Mock the router
      const pushMock = vi.fn();
      vi.spyOn(NextNavigation, 'useRouter').mockImplementation(
        (): MockRouter => ({
          push: pushMock,
          back: vi.fn(),
          forward: vi.fn(),
          refresh: vi.fn(),
          replace: vi.fn(),
          prefetch: vi.fn(),
        })
      );

      // Mock the artist search hook
      vi.spyOn(ArtistSearchHook, 'useArtistSearch').mockImplementation(() => ({
        searchResults: sampleArtists,
        isLoading: false,
        error: null,
        searchArtists: vi.fn(),
        clearResults: vi.fn(),
      }));

      return (
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <Story />
        </ThemeProvider>
      );
    },
  ],
};

// Story with mobile viewport
export const Mobile: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => {
      // Set up mocks
      const storage = mockSessionStorage();
      storage.reset();

      // Mock the router
      const pushMock = vi.fn();
      vi.spyOn(NextNavigation, 'useRouter').mockImplementation(
        (): MockRouter => ({
          push: pushMock,
          back: vi.fn(),
          forward: vi.fn(),
          refresh: vi.fn(),
          replace: vi.fn(),
          prefetch: vi.fn(),
        })
      );

      // Mock the artist search hook
      vi.spyOn(ArtistSearchHook, 'useArtistSearch').mockImplementation(() => ({
        searchResults: sampleArtists,
        isLoading: false,
        error: null,
        searchArtists: vi.fn(),
        clearResults: vi.fn(),
      }));

      return <Story />;
    },
  ],
};
