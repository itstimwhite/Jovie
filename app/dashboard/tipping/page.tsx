import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { TippingClient } from '@/components/tipping/TippingClient';
import { getServerFeatureFlags } from '@/lib/feature-flags';

export default async function TippingPage() {
  const { userId } = await auth();

  // Handle unauthenticated users
  if (!userId) {
    redirect('/sign-in?redirect_url=/dashboard/tipping');
  }

  // Check if tipping feature is enabled
  const featureFlags = await getServerFeatureFlags(userId);
  if (!featureFlags.tipping_mvp) {
    // Redirect to dashboard if feature is disabled
    redirect('/dashboard');
  }

  return (
    <div className='px-4 sm:px-6 lg:px-8'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-primary-token'>Tipping</h1>
        <p className='text-secondary-token mt-1'>
          Set up and manage your tipping options
        </p>
      </div>
      <TippingClient />
    </div>
  );
}
