'use client';

import { useState } from 'react';
import { Artist, convertDrizzleCreatorProfileToArtist } from '@/types/db';
import type { CreatorProfile } from '@/lib/db/schema';
import type { DashboardData } from '@/app/dashboard/actions';

interface DashboardLinksProps {
  initialData: DashboardData;
}

export function DashboardLinks({ initialData }: DashboardLinksProps) {
  const [artist, setArtist] = useState<Artist | null>(
    initialData.selectedProfile
      ? convertDrizzleCreatorProfileToArtist(initialData.selectedProfile)
      : null
  );
  const [creatorProfiles] = useState<CreatorProfile[]>(
    initialData.creatorProfiles
  );
  // const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
  //   initialData.selectedProfile?.id || null
  // );

  // const handleArtistUpdated = (updatedArtist: Artist) => {
  //   setArtist(updatedArtist);
  // };

  // Handle profile selection when user has multiple creator profiles
  // const handleProfileSelection = (profileId: string) => {
  //   const selectedProfile = creatorProfiles.find(p => p.id === profileId);
  //   if (selectedProfile) {
  //     setSelectedProfileId(profileId);
      const artistData = convertDrizzleCreatorProfileToArtist(selectedProfile);
      setArtist(artistData);
    }
  };

  if (!artist) {
    return null; // This shouldn't happen given the server-side logic
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-token">
          Manage Links
        </h1>
        <p className="text-secondary-token mt-1">
          Add and manage your social and streaming links
        </p>
      </div>

      {/* Links content */}
      <div className="space-y-6">
        <div className="bg-surface-1 backdrop-blur-sm rounded-lg border border-subtle p-6 hover:shadow-lg hover:border-accent/10 transition-all duration-300 relative z-10">
          <h3 className="text-lg font-medium text-primary-token mb-4">
            Your Links
          </h3>
          <div className="space-y-4">
            {/* This is a placeholder for the links management UI */}
            <p className="text-secondary-token">
              This is where you&apos;ll manage your social and streaming links. The actual links management UI will be implemented in a future update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

