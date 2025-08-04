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
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', user?.id)
        .single();

      let userId;
      if (userError && userError.code === 'PGRST116') {
        const { data: newUser, error: createUserError } = await supabase
          .from('users')
          .insert({
            clerk_id: user?.id,
            email: user?.primaryEmailAddress?.emailAddress || '',
          })
          .select('id')
          .single();

        if (createUserError) throw createUserError;
        userId = newUser.id;
      } else if (userError) {
        throw userError;
      } else {
        userId = existingUser.id;
      }

      // Check if handle is available
      const { data: existingArtist } = await supabase
        .from('artists')
        .select('id')
        .eq('handle', handle)
        .single();

      if (existingArtist) {
        setError('This handle is already taken. Please choose another one.');
        return;
      }

      // Create artist profile
      const { error: artistError } = await supabase
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
        throw artistError;
      }

      // Clear pending claim
      sessionStorage.removeItem('pendingClaim');

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating artist profile:', error);
      setError('Failed to create artist profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1">
          Choose your jov.ie handle
        </label>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-white/50">jov.ie/</span>
          <Input
            value={handle}
            onChange={(e) => setHandle(e.target.value.toLowerCase())}
            placeholder="yourname"
            className="flex-1"
            required
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating Profile...' : 'Create Profile'}
      </Button>
    </form>
  );
}
