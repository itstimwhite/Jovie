'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { createBrowserClient } from '@/lib/supabase';
import { Artist } from '@/types/db';

interface OnboardingFormProps {
  onSuccess?: (artist: Artist) => void;
}

export function OnboardingForm({ onSuccess }: OnboardingFormProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    tagline: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const supabase = createBrowserClient();

      // Create user record if it doesn't exist
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', user.id)
        .single();

      let userId: string;

      if (userError && userError.code === 'PGRST116') {
        // User doesn't exist, create them
        const { data: newUser, error: createUserError } = await supabase
          .from('users')
          .insert({
            clerk_id: user.id,
            email: user.emailAddresses[0]?.emailAddress,
          })
          .select('id')
          .single();

        if (createUserError) throw createUserError;
        userId = newUser.id;
      } else if (userError) {
        throw userError;
      } else {
        userId = userData.id;
      }

      // Create artist profile
      const { data: artist, error: artistError } = await supabase
        .from('artists')
        .insert({
          owner_user_id: userId,
          name: formData.name,
          handle: formData.handle,
          tagline: formData.tagline,
        })
        .select('*')
        .single();

      if (artistError) throw artistError;

      // Call onSuccess callback if provided
      if (onSuccess && artist) {
        onSuccess(artist);
      }

      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Error creating artist:', err);
      setError(err instanceof Error ? err.message : 'Failed to create artist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Artist Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
          placeholder="Enter your artist name"
          required
        />
      </div>

      <div>
        <label htmlFor="handle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Handle
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-300">
            jov.ie/
          </span>
          <input
            type="text"
            id="handle"
            value={formData.handle}
            onChange={(e) => setFormData({ ...formData, handle: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
            className="flex-1 min-w-0 block w-full rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="your-handle"
            required
          />
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          This will be your unique URL: jov.ie/{formData.handle || 'your-handle'}
        </p>
      </div>

      <div>
        <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tagline
        </label>
        <input
          type="text"
          id="tagline"
          value={formData.tagline}
          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
          placeholder="A short description of your music"
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating...' : 'Create Profile'}
      </button>
    </form>
  );
}
