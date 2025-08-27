'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  params: Promise<{
    username: string;
  }>;
}

export default function TipPage({ params }: Props) {
  const router = useRouter();

  useEffect(() => {
    // Get the username from params and redirect
    params.then(({ username }) => {
      router.replace(`/${username}?mode=tip`);
    });
  }, [params, router]);

  // Show loading while redirecting
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto mb-4'></div>
        <p className='text-gray-600 dark:text-gray-400'>Redirecting...</p>
      </div>
    </div>
  );
}
