'use client';

import { SignUp } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Combobox } from '@/components/ui/Combobox';
import { useArtistSearch } from '@/lib/hooks/useArtistSearch';
import { Container } from '@/components/site/Container';
import { Logo } from '@/components/ui/Logo';

interface SearchResult {
  id: string;
  name: string;
  imageUrl?: string;
  popularity: number;
  followers?: number;
  spotifyUrl: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const [selectedArtist, setSelectedArtist] = useState<SearchResult | null>(
    null
  );
  const [showSignUp, setShowSignUp] = useState(false);
  const { searchResults, isLoading, error, searchArtists, clearResults } =
    useArtistSearch();

  const handleArtistSelect = (
    option: { id: string; name: string; imageUrl?: string } | null
  ) => {
    if (option) {
      // Find the full artist data from results
      const artist = searchResults.find((a) => a.id === option.id);
      if (artist) {
        setSelectedArtist(artist);
        // Store the selected artist in sessionStorage for the claim process
        sessionStorage.setItem(
          'pendingClaim',
          JSON.stringify({
            spotifyId: artist.id,
            artistName: artist.name,
            timestamp: Date.now(),
          })
        );

        // Show the signup form
        setShowSignUp(true);
      }
    } else {
      setSelectedArtist(null);
    }
  };

  const handleInputChange = (value: string) => {
    if (value.trim()) {
      searchArtists(value);
    } else {
      clearResults();
    }
  };

  // Convert search results to Combobox options
  const options = searchResults.map((artist) => ({
    id: artist.id,
    name: artist.name,
    imageUrl: artist.imageUrl,
  }));

  const handleSubmit = () => {
    if (selectedArtist) {
      handleArtistSelect({
        id: selectedArtist.id,
        name: selectedArtist.name,
        imageUrl: selectedArtist.imageUrl,
      });
    }
  };

  // If user has selected an artist and we should show signup, render the signup form
  if (showSignUp) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0D0E12] transition-colors">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <Logo size="lg" className="mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600 dark:text-white/70">
              Sign up to claim your profile:{' '}
              <strong>{selectedArtist?.name}</strong>
            </p>
          </div>
          <SignUp redirectUrl="/dashboard" afterSignUpUrl="/dashboard" />
        </div>
      </div>
    );
  }

  // Otherwise, show the artist search flow
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 transition-colors">
      <Container className="relative z-10">
        <div className="flex min-h-screen items-center justify-center py-12">
          <div className="w-full max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <Logo size="lg" className="mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
                Claim Your Artist Profile
              </h1>
              <p className="text-xl text-gray-700 dark:text-white/80 mb-8 transition-colors">
                Search for your artist on Spotify to get started
              </p>
            </div>

            {/* Artist Search */}
            <div className="bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-gray-200/50 dark:border-white/20 transition-colors">
              <Combobox
                options={options}
                value={
                  selectedArtist
                    ? {
                        id: selectedArtist.id,
                        name: selectedArtist.name,
                        imageUrl: selectedArtist.imageUrl,
                      }
                    : null
                }
                onChange={handleArtistSelect}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                placeholder="Search for your artist on Spotify..."
                label="Search for your artist on Spotify"
                isLoading={isLoading}
                error={error}
                ctaText="Continue to Sign Up"
                showCta={true}
                className="w-full"
              />
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-600 dark:text-white/60 transition-colors">
                Already have an account?{' '}
                <button
                  onClick={() => router.push('/sign-in')}
                  className="text-blue-600 hover:text-blue-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors font-medium"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
