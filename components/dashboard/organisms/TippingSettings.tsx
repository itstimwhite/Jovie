'use client';

import { useState } from 'react';
import { VenmoHandleCard } from '@/components/tipping/VenmoHandleCard';
import { updateVenmoHandle } from '@/lib/actions/update-venmo-handle';
import { useToast } from '@/components/ui/ToastContainer';

interface UpdateVenmoHandleResult {
  venmoHandle?: string | null;
  [key: string]: any;
}

interface TippingSettingsProps {
  initialVenmoHandle?: string | null;
}

export function TippingSettings({ initialVenmoHandle }: TippingSettingsProps) {
  const [venmoHandle, setVenmoHandle] = useState(initialVenmoHandle || '');
  const { showToast } = useToast();

  const handleSaveVenmoHandle = async (newHandle: string) => {
    try {
      const result = await updateVenmoHandle(newHandle);
      // The result should have venmoHandle property based on the schema update
      const profile = result as UpdateVenmoHandleResult;
      setVenmoHandle(profile.venmoHandle || '');
      return result;
    } catch (error) {
      console.error('Failed to update Venmo handle:', error);
      showToast({
        message: 'Failed to update Venmo handle. Please try again.',
        type: 'error',
        duration: 5000,
      });
      throw error;
    }
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-subtle pb-12 md:grid-cols-3">
        <div>
          <h2 className="text-base/7 font-semibold text-primary">Tipping Settings</h2>
          <p className="mt-1 text-sm/6 text-secondary">
            Configure how fans can send you tips and support your work.
          </p>
        </div>

        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 md:col-span-2">
          <VenmoHandleCard 
            initialValue={venmoHandle} 
            onSave={handleSaveVenmoHandle}
            className="col-span-full"
          />
          
          {/* Additional tipping settings can be added here in the future */}
        </div>
      </div>
    </div>
  );
}
