'use client';

import { useSignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { useState } from 'react';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useSignUp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (!signUp) {
        throw new Error('Sign up not available');
      }

      // Start the sign-up process
      await signUp.create({
        emailAddress: email,
      });

      // Send email verification
      await signUp.prepareEmailAddressVerification();

      setIsSubmitted(true);
    } catch (err) {
      console.error('Waitlist signup error:', err);
      setError('Failed to join waitlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 transition-colors'>
        <div className='container mx-auto px-4 py-16'>
          <div className='max-w-2xl mx-auto text-center'>
            <div className='bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-gray-200/50 dark:border-white/20 transition-colors'>
              <div className='mb-6'>
                <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900'>
                  <svg
                    className='h-6 w-6 text-green-600 dark:text-green-400'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
              </div>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                Check Your Email
              </h2>
              <p className='text-gray-600 dark:text-white/80 mb-6'>
                We&apos;ve sent a verification link to <strong>{email}</strong>.
                Click the link to confirm your email and join our waitlist.
              </p>
              <p className='text-sm text-gray-500 dark:text-white/60'>
                Didn&apos;t receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className='text-blue-600 hover:text-blue-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors'
                >
                  try again
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 transition-colors'>
      <div className='container mx-auto px-4 py-16'>
        <div className='max-w-2xl mx-auto text-center'>
          <h1 className='text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-colors'>
            Join the Waitlist
          </h1>
          <p className='text-xl text-gray-700 dark:text-white/80 mb-12 transition-colors'>
            Be the first to know when Jovie launches. Get early access to claim
            your artist profile and connect with your fans.
          </p>

          <div className='bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-gray-200/50 dark:border-white/20 transition-colors'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 dark:text-white/80 mb-2'
                >
                  Email Address
                </label>
                <input
                  type='email'
                  id='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className='w-full px-4 py-3 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-purple-500 focus-visible:border-transparent transition-colors'
                  placeholder='Enter your email address'
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <div className='text-red-600 dark:text-red-400 text-sm'>
                  {error}
                </div>
              )}

              <button
                type='submit'
                disabled={isSubmitting || !email}
                className='w-full bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isSubmitting ? 'Joining...' : 'Join Waitlist'}
              </button>
            </form>
          </div>

          <div className='mt-12 text-center'>
            <p className='text-sm text-gray-600 dark:text-white/60 transition-colors'>
              Already have access?{' '}
              <Link
                href='/sign-in'
                className='text-blue-600 hover:text-blue-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors'
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
