'use client';

import { useEffect } from 'react';
import { getAuthenticatedClient } from '@/lib/supabase';

export function PendingClaimRunner() {
  useEffect(() => {
    const processPendingClaims = async () => {
      try {
        const supabase = await getAuthenticatedClient();
        
        // Check for pending claims in sessionStorage
        const pendingClaim = sessionStorage.getItem('pendingClaim');
        if (pendingClaim) {
          try {
            const claim = JSON.parse(pendingClaim);
            console.log('Processing pending claim:', claim);
            
            // Clear the pending claim
            sessionStorage.removeItem('pendingClaim');
            
            // You could process the claim here if needed
            // For now, we just clear it
          } catch (error) {
            console.error('Error processing pending claim:', error);
            sessionStorage.removeItem('pendingClaim');
          }
        }
      } catch (error) {
        console.error('Error in PendingClaimRunner:', error);
      }
    };

    processPendingClaims();
  }, []);

  return null;
}
