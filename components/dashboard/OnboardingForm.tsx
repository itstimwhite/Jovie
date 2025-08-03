'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { APP_NAME } from '@/constants/app';

interface OnboardingFormProps {
  onSuccess: (artist: any) => void;
}

export function OnboardingForm({ onSuccess }: OnboardingFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to {APP_NAME}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          To get started, search for your artist profile on our homepage and claim it.
        </p>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            How it works:
          </h3>
          <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>1. Search for your artist name on the homepage</li>
            <li>2. Select your profile from the results</li>
            <li>3. Click "Claim" to create your Jovie profile</li>
            <li>4. Customize your profile and add social links</li>
          </ol>
        </div>

        <Link href="/" className="block">
          <Button className="w-full" color="indigo">
            Search for Your Artist
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
