'use client';

import { useState } from 'react';
import { SettingsPolished } from '@/components/dashboard/organisms/SettingsPolished';
import { Artist, convertDrizzleCreatorProfileToArtist } from '@/types/db';
import type { CreatorProfile } from '@/lib/db/schema';
import type { DashboardData } from '@/app/dashboard/actions';

interface DashboardSettingsProps {
  initialData: DashboardData;
}

export function DashboardSettings({ initialData }: DashboardSettingsProps) {
  const [artist, setArtist] = useState<Artist | null>(
    initialData.selectedProfile
      ? convertDrizzleCreatorProfileToArtist(initialData.selectedProfile)
      : null
  );
  // const [creatorProfiles] = useState<CreatorProfile[]>(
  //   initialData.creatorProfiles
  // );
  // Note: These handlers are currently unused but kept for future functionality
  // const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
  //   initialData.selectedProfile?.id || null
  // );

  const handleArtistUpdated = (updatedArtist: Artist) => {
    setArtist(updatedArtist);
  };

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
          Settings
        </h1>
        <p className="text-secondary-token mt-1">
          Manage your account preferences and settings
        </p>
      </div>

      {/* Settings content */}
      <SettingsPolished
        artist={artist}
        onArtistUpdate={handleArtistUpdated}
      />
    </div>
  );
}

