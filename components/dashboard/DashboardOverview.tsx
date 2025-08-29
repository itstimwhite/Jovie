'use client';

import { useState } from 'react';
import { DashboardSplitView } from '@/components/dashboard/organisms/DashboardSplitView';
import { AnalyticsCards } from '@/components/dashboard/molecules/AnalyticsCards';
import { Artist, convertDrizzleCreatorProfileToArtist } from '@/types/db';
import type { CreatorProfile } from '@/lib/db/schema';
import type { DashboardData } from '@/app/dashboard/actions';

interface DashboardOverviewProps {
  initialData: DashboardData;
}

export function DashboardOverview({ initialData }: DashboardOverviewProps) {
  const [artist, setArtist] = useState<Artist | null>(
    initialData.selectedProfile
      ? convertDrizzleCreatorProfileToArtist(initialData.selectedProfile)
      : null
  );
  const [creatorProfiles] = useState<CreatorProfile[]>(
    initialData.creatorProfiles
  );
  // Note: These handlers are currently unused but kept for future functionality
  // const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
  //   initialData.selectedProfile?.id || null
  // );

  // const handleArtistUpdated = (updatedArtist: Artist) => {
  //   setArtist(updatedArtist);
  // };

  // // Handle profile selection when user has multiple creator profiles
  // const handleProfileSelection = (profileId: string) => {
  //   const selectedProfile = creatorProfiles.find(p => p.id === profileId);
  //   if (selectedProfile) {
  //     setSelectedProfileId(profileId);
  //     const artistData = convertDrizzleCreatorProfileToArtist(selectedProfile);
  //     setArtist(artistData);
  //   }
  // };

  if (!artist) {
    return null; // This shouldn't happen given the server-side logic
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-token">
          Dashboard
        </h1>
        <p className="text-secondary-token mt-1">
          Welcome back, {artist.name || 'Artist'}
        </p>
      </div>

      {/* Main content */}
      <div className="space-y-6">
        {/* Profile preview */}
        <DashboardSplitView
          artist={artist}
          onArtistUpdate={handleArtistUpdated}
        />

        {/* Analytics cards */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-primary-token mb-4">
            Quick Stats
          </h2>
          <AnalyticsCards />
        </div>

        {/* Recent activity */}
        <div className="bg-surface-1 backdrop-blur-sm rounded-lg border border-subtle p-6 hover:shadow-lg hover:border-accent/10 transition-all duration-300 relative z-10">
          <h3 className="text-lg font-medium text-primary-token mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <span className="text-lg">👀</span>
              </div>
              <div>
                <p className="text-sm font-medium text-primary-token">
                  5 new profile views
                </p>
                <p className="text-xs text-secondary-token">
                  Today at 2:34 PM
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <span className="text-lg">🔗</span>
              </div>
              <div>
                <p className="text-sm font-medium text-primary-token">
                  3 link clicks to Spotify
                </p>
                <p className="text-xs text-secondary-token">
                  Yesterday at 7:12 PM
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <span className="text-lg">🌟</span>
              </div>
              <div>
                <p className="text-sm font-medium text-primary-token">
                  New follower from United States
                </p>
                <p className="text-xs text-secondary-token">
                  2 days ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
