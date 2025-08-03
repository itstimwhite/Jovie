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
import { createBrowserClient } from '@/lib/supabase';
import { Artist } from '@/types/db';
import { APP_NAME } from '@/constants/app';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

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
  const supabase = createBrowserClient();

  const fetchArtist = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq(
          'owner_user_id',
          (
            await supabase
              .from('users')
              .select('id')
              .eq('clerk_id', user.id)
              .single()
          )?.data?.id
        )
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching artist:', error);
      } else {
        setArtist(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PendingClaimRunner />

      {!artist ? (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
          <Container>
            <div className="flex min-h-screen items-center justify-center py-12">
              <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-semibold">
                    Welcome to {APP_NAME}
                  </CardTitle>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Claim your jov.ie handle to launch your artist profile
                  </p>
                </CardHeader>
                <CardContent>
                  <OnboardingForm />
                </CardContent>
              </Card>
            </div>
          </Container>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Container>
            <div className="py-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Manage your {APP_NAME} profile
                </p>
              </div>

              <div className="mb-8">
                <ProfileLinkCard artist={artist} />
              </div>

              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-gray-900 text-gray-900 dark:border-gray-50 dark:text-gray-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="mt-8">
                {activeTab === 'profile' && (
                  <ProfileForm artist={artist} onUpdate={handleArtistUpdated} />
                )}
                {activeTab === 'social' && <SocialsForm artistId={artist.id} />}
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
          </Container>
        </div>
      )}
    </>
  );
}
