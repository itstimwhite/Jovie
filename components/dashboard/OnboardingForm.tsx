'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function OnboardingForm() {
  const { user } = useUser();
  const router = useRouter();
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for pending claim
    const pendingClaim = sessionStorage.getItem('pendingClaim');
    if (pendingClaim) {
      try {
        const claim = JSON.parse(pendingClaim);
        // Generate a handle from the artist name
        const suggestedHandle = claim.artistName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .substring(0, 20);
        setHandle(suggestedHandle);
      } catch (error) {
        console.error('Error parsing pending claim:', error);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Get or create user in database
      if (!user?.id) {
        setError('User not found. Please sign in again.');
        setLoading(false);
        return;
      }

      console.log('Creating artist profile for user:', user.id);
      console.log('Handle:', handle);

      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', user.id)
        .single();

      let userId;
      if (userError && userError.code === 'PGRST116') {
        console.log('Creating new user in database');
        const { data: newUser, error: createUserError } = await supabase
          .from('users')
          .insert({
            clerk_id: user?.id,
            email: user?.primaryEmailAddress?.emailAddress || '',
          })
          .select('id')
          .single();

        if (createUserError) {
          console.error('Error creating user:', createUserError);
          throw createUserError;
        }
        userId = newUser.id;
        console.log('Created user with ID:', userId);
      } else if (userError) {
        console.error('Error fetching user:', userError);
        throw userError;
      } else {
        userId = existingUser.id;
        console.log('Found existing user with ID:', userId);
      }

      // Check if handle is available
      console.log('Checking if handle is available:', handle);
      const { data: existingArtist, error: checkError } = await supabase
        .from('artists')
        .select('id')
        .eq('handle', handle)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking handle availability:', checkError);
        throw checkError;
      }

      if (existingArtist) {
        setError('This handle is already taken. Please choose another one.');
        return;
      }

      // Create artist profile
      console.log('Creating artist profile with data:', {
        owner_user_id: userId,
        handle: handle.toLowerCase(),
        name: 'Your Artist Name',
        published: true,
      });

      const { data: newArtist, error: artistError } = await supabase
        .from('artists')
        .insert({
          owner_user_id: userId,
          handle: handle.toLowerCase(),
          name: 'Your Artist Name',
          published: true,
        })
        .select('*')
        .single();

      if (artistError) {
        console.error('Error creating artist:', artistError);
        throw artistError;
      }

      console.log('Successfully created artist:', newArtist);

      // Clear pending claim
      sessionStorage.removeItem('pendingClaim');

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating artist profile:', error);
      setError(
        `Failed to create artist profile: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
          Choose your jov.ie handle
        </label>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-white/50 font-medium transition-colors">
            jov.ie/
          </span>
          <Input
            value={handle}
            onChange={(e) => setHandle(e.target.value.toLowerCase())}
            placeholder="yourname"
            className="flex-1"
            required
          />
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-white/50 transition-colors">
          This will be your unique URL on Jovie
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400 transition-colors">
            {error}
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        variant="primary"
        className="w-full"
      >
        {loading ? 'Creating Profile...' : 'Create Profile'}
      </Button>
    </form>
  );
}
