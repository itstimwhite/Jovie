'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Container } from '@/components/site/Container';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import {
  ProfileLinkCard,
  OnboardingForm,
  ProfileForm,
  SocialsForm,
  ListenNowForm,
  AnalyticsCards,
} from '@/components/dashboard';
import { PendingClaimRunner } from '@/components/bridge/PendingClaimRunner';
import { PendingClaimHandler } from './PendingClaimHandler';
import {
  Artist,
  CreatorProfile,
  convertCreatorProfileToArtist,
} from '@/types/db';
import { APP_NAME } from '@/constants/app';

const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'social', label: 'Social Links' },
  { id: 'listen', label: 'Listen Now' },
  { id: 'analytics', label: 'Analytics' },
];

interface DashboardClientProps {
  initialData: {
    user: { id: string } | null;
    creatorProfiles: CreatorProfile[];
    selectedProfile: CreatorProfile | null;
    needsOnboarding: boolean;
  };
}

export function DashboardClient({ initialData }: DashboardClientProps) {
  const router = useRouter();
  const [artist, setArtist] = useState<Artist | null>(
    initialData.selectedProfile
      ? convertCreatorProfileToArtist(initialData.selectedProfile)
      : null
  );
  const [creatorProfiles] = useState<CreatorProfile[]>(
    initialData.creatorProfiles
  );
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    initialData.selectedProfile?.id || null
  );
  const [activeTab, setActiveTab] = useState('profile');

  const handleArtistUpdated = (updatedArtist: Artist) => {
    setArtist(updatedArtist);
  };

  // Handle profile selection when user has multiple creator profiles
  const handleProfileSelection = (profileId: string) => {
    const selectedProfile = creatorProfiles.find((p) => p.id === profileId);
    if (selectedProfile) {
      setSelectedProfileId(profileId);
      const artistData = convertCreatorProfileToArtist(selectedProfile);
      setArtist(artistData);
    }
  };

  if (initialData.needsOnboarding) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0D0E12] transition-colors">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* Gradient orbs - more subtle like Linear */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />

        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div>

        <Container className="relative z-10">
          <div className="flex min-h-screen items-center justify-center py-8">
            <div className="w-full max-w-md">
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-1 transition-colors">
                  Welcome to {APP_NAME}
                </h1>
                <p className="text-gray-600 dark:text-white/70 transition-colors">
                  Claim your handle to launch your artist profile
                </p>
              </div>

              {/* Form Card */}
              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 rounded-xl p-6 shadow-xl transition-colors">
                <OnboardingForm />
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!artist) {
    return null; // This shouldn't happen given the server-side logic
  }

  return (
    <>
      <PendingClaimRunner />
      <PendingClaimHandler />

      <div className="min-h-screen bg-white dark:bg-[#0D0E12] transition-colors">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* Gradient orbs - more subtle like Linear */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />

        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div>

        <Container className="relative z-10">
          <div className="py-12">
            <div className="mb-8">
              <h1 className="text-4xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-white/70 text-lg transition-colors">
                Manage your {APP_NAME} profile
              </p>
            </div>

            {/* Profile Selector - Show when user has multiple creator profiles */}
            {creatorProfiles.length > 1 && (
              <div className="mb-8">
                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 rounded-xl p-4 shadow-xl transition-colors">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Creator Profiles ({creatorProfiles.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {creatorProfiles.map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => handleProfileSelection(profile.id)}
                        className={`text-left p-3 rounded-lg border transition-colors ${
                          selectedProfileId === profile.id
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-400'
                            : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 bg-white/50 dark:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {profile.avatar_url ? (
                            <Image
                              src={profile.avatar_url}
                              alt={profile.display_name || profile.username}
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                {(profile.display_name || profile.username)
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {profile.display_name || profile.username}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {profile.creator_type} • @{profile.username}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Add New Profile Button */}
                  <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-white/10">
                    <button
                      onClick={() => router.push('/onboarding')}
                      className="w-full p-3 rounded-lg border border-dashed border-gray-300 dark:border-white/20 hover:border-gray-400 dark:hover:border-white/30 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-colors text-center"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Create New Profile
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-8">
              <ProfileLinkCard artist={artist} />
            </div>

            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 rounded-xl p-6 shadow-xl transition-colors">
              <div className="border-b border-gray-200/50 dark:border-white/10 mb-6">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-gray-900 text-gray-900 dark:border-white dark:text-white'
                          : 'border-transparent text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70 hover:border-gray-300 dark:hover:border-white/30'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="space-y-6">
                {activeTab === 'profile' && (
                  <ProfileForm artist={artist} onUpdate={handleArtistUpdated} />
                )}
                {activeTab === 'social' && <SocialsForm artist={artist} />}
                {activeTab === 'listen' && (
                  <ListenNowForm
                    artist={artist}
                    onUpdate={handleArtistUpdated}
                  />
                )}
                {activeTab === 'analytics' && <AnalyticsCards />}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
