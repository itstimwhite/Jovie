'use client';

import { useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { getAuthenticatedClient } from '@/lib/supabase';

export function OnboardingForm() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(undefined);

    try {
      // Get Clerk token for Supabase authentication
      const token = await getToken({ template: 'supabase' });

      // Get authenticated Supabase client
      const supabase = await getAuthenticatedClient(token);

      let userId: string;

      // Check if user already exists in our database
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', user.id)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        // User doesn't exist, create them
        const { data: newUser, error: createUserError } = await supabase
          .from('users')
          .insert({
            clerk_id: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            name: user.fullName || user.firstName || 'Unknown',
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

      // Redirect to the new profile
      window.location.href = `/${handle.toLowerCase()}`;
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Handle" error={error}>
        <Input
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="your-handle"
          required
          title="Only letters, numbers, and hyphens allowed"
          className="font-mono"
        />
      </FormField>

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
