'use client';

import { useState } from 'react';
import { SettingsPolished } from '@/components/dashboard/organisms/SettingsPolished';
import { Artist, convertDrizzleCreatorProfileToArtist } from '@/types/db';
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
  const handleArtistUpdated = (updatedArtist: Artist) => {
    setArtist(updatedArtist);
  };

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

