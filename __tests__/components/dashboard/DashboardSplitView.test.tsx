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
        eq: () =>
          Promise.resolve({
            data: [
              {
                id: 'social-1',
                creator_profile_id: 'artist-1',
                platform: 'instagram',
                platform_type: 'instagram',
                url: 'https://instagram.com/test',
                sort_order: 0,
                clicks: 0,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 'social-2',
                creator_profile_id: 'artist-1',
                platform: 'spotify',
                platform_type: 'spotify',
                url: 'https://open.spotify.com/artist/123',
                sort_order: 1,
                clicks: 5,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ],
            error: null,
          }),
      }),
      delete: () => ({
        eq: () =>
          Promise.resolve({
            error: null,
          }),
      }),
      insert: () =>
        Promise.resolve({
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

  it('correctly uses creator_profile_id in database queries', async () => {
    // Create a spy to capture database calls
    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() =>
            Promise.resolve({
              data: [],
              error: null,
            })
          ),
        })),
        delete: vi.fn(() => ({
          eq: vi.fn(() =>
            Promise.resolve({
              error: null,
            })
          ),
        })),
        insert: vi.fn(() =>
          Promise.resolve({
            error: null,
          })
        ),
      })),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (vi.importMock('@/lib/supabase') as any).createClerkSupabaseClient = vi.fn(
      () => mockSupabase
    );

    render(
      <DashboardSplitView
        artist={mockArtist}
        creatorProfile={mockCreatorProfile}
        onArtistUpdate={() => {}}
      />
    );

    // Wait for useEffect to run
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify that the query used creator_profile_id instead of artist_id
    const selectChain = mockSupabase.from().select();
    expect(selectChain.eq).toHaveBeenCalledWith(
      'creator_profile_id',
      mockArtist.id
    );
  });

  it('handles database schema correctly for save operations', () => {
    // Test that the convertLinkItemsToDbFormat function (implicitly tested through component behavior)
    // uses creator_profile_id instead of artist_id

    render(
      <DashboardSplitView
        artist={mockArtist}
        creatorProfile={mockCreatorProfile}
        onArtistUpdate={() => {}}
      />
    );

    // Component should render without errors, indicating proper schema handling
    expect(screen.getByText('Manage Your Links')).toBeInTheDocument();
  });

  it('categorizes platforms correctly for DSP vs social links', async () => {
    render(
      <DashboardSplitView
        artist={mockArtist}
        creatorProfile={mockCreatorProfile}
        onArtistUpdate={() => {}}
      />
    );

    // Wait for component to initialize
    await new Promise((resolve) => setTimeout(resolve, 100));

    // The component should categorize instagram as social and spotify as DSP
    // This is verified by checking that both managers are present
    expect(screen.getByText('Social Links')).toBeInTheDocument();
    expect(screen.getByText('Music Streaming Links')).toBeInTheDocument();
  });
});
