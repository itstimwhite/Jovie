import { Container } from '@/components/site/Container';
import {
  ProfileSkeleton,
  ButtonSkeleton,
  SocialBarSkeleton,
} from '@/components/ui/LoadingSkeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Container>
        <div className="flex min-h-screen flex-col items-center justify-center py-12">
          {/* Screen reader announcement */}
          <div
            aria-live="polite"
            aria-label="Loading artist profile..."
            className="sr-only"
          >
            Loading artist profile...
          </div>

          <div className="w-full max-w-md space-y-8">
            <ProfileSkeleton />

            <div className="flex justify-center">
              <ButtonSkeleton />
            </div>

            <SocialBarSkeleton />

            <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
              <div className="flex items-center justify-center">
                <div
                  className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse"
                  aria-label="Loading footer content"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
