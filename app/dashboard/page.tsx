'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/site/Container';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { Spinner, OptimizedImage } from '@/components/ui';
import {
  ProfileLinkCard,
  OnboardingForm,
  ProfileForm,
  SocialsForm,
  ListenNowForm,
  AnalyticsCards,
} from '@/components/dashboard';
import { PendingClaimRunner } from '@/components/bridge/PendingClaimRunner';
import { useAuthenticatedSupabase } from '@/lib/supabase';
import {
  Artist,
  CreatorProfile,
  convertCreatorProfileToArtist,
} from '@/types/db';
import { APP_NAME } from '@/constants/app';

// Root layout handles dynamic rendering

const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'social', label: 'Social Links' },
  { id: 'listen', label: 'Listen Now' },
  { id: 'analytics', label: 'Analytics' },
];

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { getAuthenticatedClient } = useAuthenticatedSupabase();
  const router = useRouter();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [creatorProfiles, setCreatorProfiles] = useState<CreatorProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [error, setError] = useState<string | null>(null);
  const [checkingClaims, setCheckingClaims] = useState(true);

  // Hard redirect to sign-in when unauthenticated
  useEffect(() => {
    if (isLoaded && !user) {
      router.replace('/sign-in?redirect_url=/dashboard');
    }
  }, [isLoaded, user, router]);

  // Check for pending claims and redirect if needed
  useEffect(() => {
    if (!isLoaded) return;

    const pendingClaim = sessionStorage.getItem('pendingClaim');
    const selectedArtist = sessionStorage.getItem('selectedArtist');

    if (pendingClaim && !selectedArtist) {
      // User has a pending claim but hasn't selected an artist yet
      router.push('/artist-selection');
      return;
    }

    setCheckingClaims(false);
  }, [isLoaded, router]);

  const fetchArtist = useCallback(async () => {
    if (!user || !isLoaded || checkingClaims) return;

    try {
      // Get authenticated Supabase client using native integration
      const supabase = getAuthenticatedClient();

      if (!supabase) {
        console.error('Failed to get authenticated Supabase client');
        setError('Authentication failed. Please try signing out and back in.');
        setLoading(false);
        return;
      }

      // Check if user exists in app_users table (using Clerk's user.id as the primary key)
      const { data: userData, error: userError } = await supabase
        .from('app_users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (userError) {
        // If it's a permission error, the user likely needs to be created
        if (userError.code === 'PGRST301' || userError.code === '42501') {
          console.log('User not found in database, redirecting to onboarding');
          router.push('/onboarding');
          return;
        }
        console.error('Error fetching user:', userError);
        setError('Database connection failed. Please refresh the page.');
        setLoading(false);
        return;
      }

      if (!userData?.id) {
        // No user row yet → send to onboarding to create user/artist
        router.push('/onboarding');
        return;
      }

      // Get all creator profiles for this user
      const { data: creatorData, error } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: true }); // Oldest first as default

      if (error) {
        console.error('Error fetching creator profiles:', error);
        setError('Failed to load creator profiles. Please refresh the page.');
        setLoading(false);
        return;
      }

      if (!creatorData || creatorData.length === 0) {
        // No creator profiles yet → onboarding
        router.push('/onboarding');
        return;
      }

      // Store all profiles
      setCreatorProfiles(creatorData);

      // Select the first profile by default (or restore previous selection)
      const profileToSelect = creatorData[0];
      setSelectedProfileId(profileToSelect.id);

      // Convert selected CreatorProfile to Artist for backward compatibility
      const artistData = convertCreatorProfileToArtist(profileToSelect);
      setArtist(artistData);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, [user, isLoaded, getAuthenticatedClient, checkingClaims, router]);

  useEffect(() => {
    if (user && isLoaded && !checkingClaims) {
      fetchArtist();
    }
  }, [user, isLoaded, fetchArtist, checkingClaims]);

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

  // Show loading while checking claims or initial load
  if (checkingClaims || loading || !isLoaded || (!user && isLoaded)) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0D0E12] transition-colors">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="flex min-h-screen items-center justify-center relative z-10">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600 dark:text-white/70 transition-colors">
              Loading your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0D0E12] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 dark:text-white/70 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PendingClaimRunner />

      {!artist ? (
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
      ) : (
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
                            <OptimizedImage
                              src={profile.avatar_url}
                              alt={profile.display_name || profile.username}
                              size="sm"
                              shape="circle"
                            />
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
                    <ProfileForm
                      artist={artist}
                      onUpdate={handleArtistUpdated}
                    />
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
      )}
    </>
  );
}
