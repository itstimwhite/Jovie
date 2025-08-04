'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { Container } from '@/components/site/Container';
import { ProfileLinkCard } from '@/components/dashboard/ProfileLinkCard';
import { OnboardingForm } from '@/components/dashboard/OnboardingForm';
import { ProfileForm } from '@/components/dashboard/ProfileForm';
import { SocialsForm } from '@/components/dashboard/SocialsForm';
import { ListenNowForm } from '@/components/dashboard/ListenNowForm';
import { AnalyticsCards } from '@/components/dashboard/AnalyticsCards';
import { PendingClaimRunner } from '@/components/bridge/PendingClaimRunner';
import { supabase } from '@/lib/supabase';
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
  const { user } = useUser();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  const fetchArtist = useCallback(async () => {
    if (!user) return;

    try {
      // First get the user's database ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', user.id)
        .single();

      if (userError) {
        console.error('Error fetching user:', userError);
        return;
      }

      if (!userData?.id) {
        console.error('No user ID found');
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
      } else {
        setArtist(data as Artist | null);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchArtist();
    }
  }, [user, fetchArtist]);

  const handleArtistUpdated = (updatedArtist: Artist) => {
    setArtist(updatedArtist);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0E12]">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="flex min-h-screen items-center justify-center relative z-10">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
            <p className="mt-4 text-white/70">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PendingClaimRunner />

      {!artist ? (
        <div className="min-h-screen bg-[#0D0E12]">
          {/* Subtle grid background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

          {/* Gradient orbs - more subtle like Linear */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />

          <Container className="relative z-10">
            <div className="flex min-h-screen items-center justify-center py-12">
              <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-semibold text-white mb-2">
                    Welcome to {APP_NAME}
                  </h1>
                  <p className="text-white/70 text-lg">
                    Claim your jov.ie handle to launch your artist profile
                  </p>
                </div>

                {/* Form Card */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl">
                  <OnboardingForm />
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                  <p className="text-sm text-white/50">
                    Your profile will be live at jov.ie/yourhandle
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </div>
      ) : (
        <div className="min-h-screen bg-[#0D0E12]">
          {/* Subtle grid background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

          {/* Gradient orbs - more subtle like Linear */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />

          <Container className="relative z-10">
            <div className="py-12">
              <div className="mb-8">
                <h1 className="text-4xl font-semibold text-white mb-2">
                  Dashboard
                </h1>
                <p className="text-white/70 text-lg">
                  Manage your {APP_NAME} profile
                </p>
              </div>

              <div className="mb-8">
                <ProfileLinkCard artist={artist} />
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl">
                <div className="border-b border-white/10 mb-6">
                  <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? 'border-white text-white'
                            : 'border-transparent text-white/50 hover:text-white/70 hover:border-white/30'
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
