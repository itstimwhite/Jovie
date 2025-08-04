'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { InfoBox } from '@/components/ui/InfoBox';
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
          To get started, search for your artist profile on our homepage and
          claim it.
        </p>

        <InfoBox title="How it works:" variant="info">
          <ol className="space-y-1">
            <li>1. Search for your artist name on the homepage</li>
            <li>2. Select your profile from the results</li>
            <li>3. Click "Claim" to create your Jovie profile</li>
            <li>4. Customize your profile and add social links</li>
          </ol>
        </InfoBox>

        <Link href="/" className="block">
          <Button className="w-full" color="indigo">
            Search for Your Artist
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
