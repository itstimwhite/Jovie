'use client';

import { useState, useEffect } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/20/solid';
import { validateVenmoHandle } from '@/lib/validation/venmo';

interface VenmoHandleCardProps {
  initialValue?: string | null;
  onSave?: (value: string) => Promise<unknown>;
  className?: string;
}

export function VenmoHandleCard({
  initialValue = '',
  onSave,
  className = '',
}: VenmoHandleCardProps) {
  const [venmoHandle, setVenmoHandle] = useState(initialValue || '');
  const [originalValue, setOriginalValue] = useState(initialValue || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Reset to original value when initialValue changes (e.g. from API)
  useEffect(() => {
    setVenmoHandle(initialValue || '');
    setOriginalValue(initialValue || '');
  }, [initialValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.startsWith('@') ? e.target.value.slice(1) : e.target.value;
    setVenmoHandle(value);
    setError(undefined);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    // Validate the Venmo handle
    const validation = validateVenmoHandle(venmoHandle);
    
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    // If the handle hasn't changed, just exit edit mode
    if (validation.normalizedHandle === originalValue) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError(undefined);
    
    try {
      if (onSave) {
        await onSave(validation.normalizedHandle || '');
      }
      setOriginalValue(validation.normalizedHandle || '');
      setSaveSuccess(true);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save Venmo handle:', err);
      setError('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setVenmoHandle(originalValue);
    setIsEditing(false);
    setError(undefined);
    setSaveSuccess(false);
  };

  const displayValue = venmoHandle ? `@${venmoHandle}` : 'Not set';

  return (
    <div className={`rounded-lg border border-subtle bg-surface-1 overflow-hidden ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <CurrencyDollarIcon className="h-6 w-6 text-accent" aria-hidden="true" />
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold leading-6 text-primary">Venmo Handle</h3>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="rounded-md bg-surface-2 px-2.5 py-1.5 text-sm font-medium text-primary hover:bg-surface-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Edit
                </button>
              )}
            </div>
            
            <div className="mt-2 max-w-xl text-sm text-secondary">
              <p>Set your Venmo handle to allow fans to send you tips directly.</p>
            </div>
            
            {isEditing ? (
              <div className="mt-5">
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-subtle bg-surface-2 px-3 text-secondary sm:text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    value={venmoHandle}
                    onChange={handleInputChange}
                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-1.5 text-primary bg-surface-1 ring-1 ring-inset ring-subtle placeholder:text-secondary focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
                    placeholder="yourvenmohandle"
                    aria-describedby="venmo-handle-description"
                  />
                </div>
                
                {error && (
                  <p className="mt-2 text-sm text-red-600" id="venmo-handle-error">
                    {error}
                  </p>
                )}
                
                <div className="mt-3 flex items-center gap-x-3">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center rounded-md bg-surface-2 px-3 py-2 text-sm font-semibold text-primary shadow-sm hover:bg-surface-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-5 flex items-center">
                <span className={`text-sm ${venmoHandle ? 'text-primary' : 'text-secondary italic'}`}>
                  {displayValue}
                </span>
                {saveSuccess && (
                  <span className="ml-3 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    <CheckIcon className="mr-1 h-4 w-4" />
                    Saved
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
