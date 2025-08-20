'use client';

import { useState } from 'react';
import { Artist } from '@/types/db';
import { updateCreatorProfile } from '@/app/dashboard/actions';

interface SettingsFormProps {
  artist: Artist;
  onUpdate: (artist: Artist) => void;
}

export function SettingsForm({ artist, onUpdate }: SettingsFormProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [marketingOptOut, setMarketingOptOut] = useState(
    artist.marketing_opt_out || false
  );
  const [showSuccess, setShowSuccess] = useState(false);

  const handleMarketingOptOutChange = async (optedOut: boolean) => {
    try {
      setIsUpdating(true);
      setMarketingOptOut(optedOut);

      // Update the profile in the database
      await updateCreatorProfile(artist.id, {
        marketing_opt_out: optedOut,
      });

      // Update the local artist state
      const updatedArtist = {
        ...artist,
        marketing_opt_out: optedOut,
      };

      onUpdate(updatedArtist);
      setShowSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating marketing preferences:', error);
      // Revert the local state on error
      setMarketingOptOut(!optedOut);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Account Settings
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Manage your account preferences and privacy settings.
        </p>
      </div>

      {/* Marketing Preferences Section */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
          Marketing & Promotion
        </h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex items-center h-5">
              <input
                id="marketing-opt-out"
                type="checkbox"
                checked={marketingOptOut}
                onChange={(e) => handleMarketingOptOutChange(e.target.checked)}
                disabled={isUpdating}
                className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
              />
            </div>
            <div className="text-sm">
              <label
                htmlFor="marketing-opt-out"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Opt out of marketing materials
              </label>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                When enabled, your profile will not be featured on our homepage
                or used in marketing materials. You can change this setting at
                any time.
              </p>
            </div>
          </div>

          {showSuccess && (
            <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Settings updated successfully</span>
            </div>
          )}
        </div>
      </div>

      {/* Future Settings Sections */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
          Additional Settings
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          More account and privacy settings will be available here in the
          future.
        </p>
      </div>
    </div>
  );
}
