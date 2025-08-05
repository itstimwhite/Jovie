'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/site/Container';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { ProfileLinkCard } from '@/components/dashboard/ProfileLinkCard';
import { OnboardingForm } from '@/components/dashboard/OnboardingForm';
import { ProfileForm } from '@/components/dashboard/ProfileForm';
import { SocialsForm } from '@/components/dashboard/SocialsForm';
import { ListenNowForm } from '@/components/dashboard/ListenNowForm';
import { AnalyticsCards } from '@/components/dashboard/AnalyticsCards';
import { PendingClaimRunner } from '@/components/bridge/PendingClaimRunner';
import { getAuthenticatedClient } from '@/lib/supabase';
import { Artist } from '@/types/db';
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
  const { getToken } = useAuth();
  const router = useRouter();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [error, setError] = useState<string | null>(null);
  const [checkingClaims, setCheckingClaims] = useState(true);

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
      // Get Clerk token for Supabase authentication
      const token = await getToken({ template: 'supabase' });

      if (!token) {
        setError('Authentication failed. Please try logging in again.');
        return;
      }

      // Get authenticated Supabase client
      const supabase = await getAuthenticatedClient(token);

      // First get the user's database ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', user.id)
        .single();

      if (userError) {
        console.error('Error fetching user:', userError);
        if (userError.code === 'PGRST116') {
          // User doesn't exist in database, redirect to onboarding
          router.push('/onboarding');
          return;
        }
        setError('Failed to load user data');
        return;
      }

      if (!userData?.id) {
        console.error('No user ID found');
        setError('User data is incomplete');
        return;
      }

      // Then get the artist data
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('owner_user_id', userData.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching artist:', error);
        setError('Failed to load artist data');
      } else if (error && error.code === 'PGRST116') {
        // No artist found, redirect to onboarding
        router.push('/onboarding');
        return;
      } else {
        setArtist(data as Artist | null);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user, isLoaded, getToken, checkingClaims, router]);

  useEffect(() => {
    if (user && isLoaded && !checkingClaims) {
      fetchArtist();
    }
  }, [user, isLoaded, fetchArtist, checkingClaims]);

  const handleArtistUpdated = (updatedArtist: Artist) => {
    setArtist(updatedArtist);
  };

  // Show loading while checking claims
  if (checkingClaims) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0D0E12] flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 dark:border-white/20 border-t-gray-600 dark:border-t-white"></div>
          <p className="mt-4 text-gray-600 dark:text-white/70">Loading...</p>
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

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0D0E12] transition-colors">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="flex min-h-screen items-center justify-center relative z-10">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 dark:border-white/20 border-t-gray-600 dark:border-t-white"></div>
            <p className="mt-4 text-gray-600 dark:text-white/70 transition-colors">
              Loading...
            </p>
          </div>
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
            <div className="flex min-h-screen items-center justify-center py-12">
              <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                    Welcome to {APP_NAME}
                  </h1>
                  <p className="text-gray-600 dark:text-white/70 text-lg transition-colors">
                    Claim your jov.ie handle to launch your artist profile
                  </p>
                </div>

                {/* Form Card */}
                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 rounded-xl p-6 shadow-xl transition-colors">
                  <OnboardingForm />
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                  <p className="text-sm text-gray-500 dark:text-white/50 transition-colors">
                    Your profile will be live at jov.ie/yourhandle
                  </p>
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
                  {activeTab === 'social' && (
                    <SocialsForm artistId={artist.id} />
                  )}
                  {activeTab === 'listen' && (
                    <ListenNowForm
                      artist={artist}
                      onUpdate={handleArtistUpdated}
                    />
                  )}
                  {activeTab === 'analytics' && (
                    <AnalyticsCards artistId={artist.id} />
                  )}
                </div>
              </div>
            </div>
          </Container>
        </div>
      )}
    </>
  );
}
