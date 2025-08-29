'use client';

import { useState } from 'react';
import { Artist, convertDrizzleCreatorProfileToArtist } from '@/types/db';
import type { CreatorProfile } from '@/lib/db/schema';
import type { DashboardData } from '@/app/dashboard/actions';

interface DashboardAudienceProps {
  initialData: DashboardData;
}

export function DashboardAudience({ initialData }: DashboardAudienceProps) {
  const [artist, setArtist] = useState<Artist | null>(
    initialData.selectedProfile
      ? convertDrizzleCreatorProfileToArtist(initialData.selectedProfile)
      : null
  );
  const [creatorProfiles] = useState<CreatorProfile[]>(
    initialData.creatorProfiles
  );
  const [_selectedProfileId, _setSelectedProfileId] = useState<string | null>(
    initialData.selectedProfile?.id || null
  );

  const _handleArtistUpdated = (_updatedArtist: Artist) => {
    // TODO: Implement artist update functionality
  };

  // Handle profile selection when user has multiple creator profiles
  const _handleProfileSelection = (profileId: string) => {
    const selectedProfile = creatorProfiles.find(p => p.id === profileId);
    if (selectedProfile) {
      _setSelectedProfileId(profileId);
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
          Audience
        </h1>
        <p className="text-secondary-token mt-1">
          Understand and grow your audience
        </p>
      </div>

      {/* Audience content */}
      <div className="space-y-6">
        {/* Top Countries */}
        <div className="bg-surface-1 backdrop-blur-sm rounded-lg border border-subtle p-6 hover:shadow-lg hover:border-accent/10 transition-all duration-300 relative z-10">
          <h3 className="text-lg font-medium text-primary-token mb-4">
            Top Countries
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇺🇸</span>
                <span className="text-primary-token font-medium">United States</span>
              </div>
              <span className="text-primary-token font-medium">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇬🇧</span>
                <span className="text-primary-token font-medium">United Kingdom</span>
              </div>
              <span className="text-primary-token font-medium">18%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇨🇦</span>
                <span className="text-primary-token font-medium">Canada</span>
              </div>
              <span className="text-primary-token font-medium">12%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇦🇺</span>
                <span className="text-primary-token font-medium">Australia</span>
              </div>
              <span className="text-primary-token font-medium">8%</span>
            </div>
          </div>
        </div>

        {/* Age Demographics */}
        <div className="bg-surface-1 backdrop-blur-sm rounded-lg border border-subtle p-6 hover:shadow-lg hover:border-accent/10 transition-all duration-300 relative z-10">
          <h3 className="text-lg font-medium text-primary-token mb-4">
            Age Demographics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-primary-token font-medium">18-24</span>
              <div className="flex items-center gap-2">
                <div className="w-48 h-4 bg-surface-2 rounded-full">
                  <div className="w-3/4 h-full bg-blue-500 rounded-full"></div>
                </div>
                <span className="text-primary-token font-medium">35%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-primary-token font-medium">25-34</span>
              <div className="flex items-center gap-2">
                <div className="w-48 h-4 bg-surface-2 rounded-full">
                  <div className="w-1/2 h-full bg-green-500 rounded-full"></div>
                </div>
                <span className="text-primary-token font-medium">28%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-primary-token font-medium">35-44</span>
              <div className="flex items-center gap-2">
                <div className="w-48 h-4 bg-surface-2 rounded-full">
                  <div className="w-1/4 h-full bg-purple-500 rounded-full"></div>
                </div>
                <span className="text-primary-token font-medium">22%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-primary-token font-medium">45+</span>
              <div className="flex items-center gap-2">
                <div className="w-48 h-4 bg-surface-2 rounded-full">
                  <div className="w-1/6 h-full bg-orange-500 rounded-full"></div>
                </div>
                <span className="text-primary-token font-medium">15%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audience Growth */}
        <div className="bg-surface-1 backdrop-blur-sm rounded-lg border border-subtle p-6 hover:shadow-lg hover:border-accent/10 transition-all duration-300 relative z-10">
          <h3 className="text-lg font-medium text-primary-token mb-4">
            Audience Growth
          </h3>
          <div className="space-y-4">
            <p className="text-secondary-token">
              Detailed audience growth metrics and charts will be available in a future update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

