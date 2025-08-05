'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { getAuthenticatedClient } from '@/lib/supabase';

export function OnboardingForm() {
  const { user } = useUser();
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Get authenticated Supabase client
      const supabase = await getAuthenticatedClient();

      console.log('Creating artist profile for user:', user.id);
      console.log('Handle:', handle);

      // First get the user's database ID
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
            clerk_id: user.id,
            email: user.emailAddresses[0]?.emailAddress || '',
            first_name: user.firstName || '',
            last_name: user.lastName || '',
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
      <FormField
        label="Handle"
        description="This will be your jov.ie URL"
        error={error}
      >
        <Input
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="your-handle"
          required
          pattern="[a-zA-Z0-9-]+"
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
