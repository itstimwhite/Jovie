'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { createBrowserClient } from '@/lib/supabase';
import {
  onboardingSchema,
  OnboardingValues,
} from '@/lib/validation/onboarding';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export function OnboardingForm() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const [isHandleAvailable, setIsHandleAvailable] = useState<boolean | null>(
    null
  );

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      handle: '',
    },
  });

  const handle = form.watch('handle');

  useEffect(() => {
    const checkHandle = async () => {
      if (handle.length < 3) {
        setIsHandleAvailable(null);
        return;
      }

      const response = await fetch(`/api/handle/check?handle=${handle}`);
      const { available } = await response.json();
      setIsHandleAvailable(available);
    };

    const debounce = setTimeout(() => {
      checkHandle();
    }, 500);

    return () => clearTimeout(debounce);
  }, [handle]);

  const onSubmit = async (values: OnboardingValues) => {
    setLoading(true);

    try {
      const supabase = createBrowserClient();
      const artistName = sessionStorage.getItem('pendingClaim')
        ? JSON.parse(sessionStorage.getItem('pendingClaim')!).artistName
        : 'New Artist';

      await supabase.from('artists').insert({
        owner_user_id: user!.id,
        name: artistName,
        handle: values.handle,
        tagline: 'Artist',
      });

      router.push('/dashboard');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      form.setError('handle', {
        type: 'manual',
        message: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[420px] pt-[15vh] pb-[20vh]">
      <h2 className="text-3xl font-semibold">Welcome to Jovie</h2>
      <p className="mb-8 text-base text-slate-500">Choose your jov.ie handle</p>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative">
          <Input
            {...form.register('handle')}
            placeholder="your-handle"
            autoFocus
            maxLength={24}
            className="h-12 pl-16"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            jov.ie/
          </span>
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {isHandleAvailable === true && (
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
            )}
            {isHandleAvailable === false && (
              <XCircleIcon className="h-6 w-6 text-red-500" />
            )}
          </div>
        </div>
        {form.formState.errors.handle && (
          <p className="mt-2 text-sm text-red-500" aria-live="polite">
            {form.formState.errors.handle.message}
          </p>
        )}

        <Button
          type="submit"
          className="mt-6 w-full rounded-full py-3"
          disabled={!form.formState.isValid || !isHandleAvailable || loading}
        >
          {loading ? 'Saving...' : 'Continue'}
        </Button>
      </form>

      <p className="mt-4 text-xs text-slate-400">
        You can change this later in Settings.
      </p>
    </div>
  );
}
