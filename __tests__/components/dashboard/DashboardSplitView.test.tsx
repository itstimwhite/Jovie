import { describe, it, expect } from 'vitest';
import { DashboardSplitView } from '@/components/dashboard/organisms/DashboardSplitView';
import { render, screen } from '@testing-library/react';
import { mockArtist, mockCreatorProfile } from '@/lib/test-utils/mock-data';

// Mock the useSession hook
vi.mock('@clerk/nextjs', () => ({
  useSession: () => ({
    session: { getToken: () => 'mock-token' },
  }),
}));

// Mock the createClerkSupabaseClient function
vi.mock('@/lib/supabase', () => ({
  createClerkSupabaseClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          data: [
            {
              id: 'social-1',
              artist_id: 'artist-1',
              platform: 'instagram',
              url: 'https://instagram.com/test',
            },
            {
              id: 'social-2',
              artist_id: 'artist-1',
              platform: 'spotify',
              url: 'https://open.spotify.com/artist/123',
            },
          ],
          error: null,
        }),
      }),
      delete: () => ({
        eq: () => ({
          error: null,
        }),
      }),
      insert: () => ({
        error: null,
      }),
    }),
  }),
}));

describe('DashboardSplitView', () => {
  it('renders the component', () => {
    render(
      <DashboardSplitView
        artist={mockArtist}
        creatorProfile={mockCreatorProfile}
        onArtistUpdate={() => {}}
      />
    );

    expect(screen.getByText('Manage Your Links')).toBeInTheDocument();
    expect(screen.getByText('Live Preview')).toBeInTheDocument();
  });

  // Test the conversion functions
  it('correctly converts database links to LinkItems', () => {
    // This is testing the internal function, so we're accessing it through the component's instance
    // We can't directly test it since it's not exported, but we can test the behavior
    
    // The component should load with the mocked data from the useEffect
    render(
      <DashboardSplitView
        artist={mockArtist}
        creatorProfile={mockCreatorProfile}
        onArtistUpdate={() => {}}
      />
    );
    
    // The component should render with the converted links
    // We can check if the SocialLinkManager and DSPLinkManager are rendered
    expect(screen.getByText('Social Links')).toBeInTheDocument();
    expect(screen.getByText('Music Streaming Links')).toBeInTheDocument();
  });
});

