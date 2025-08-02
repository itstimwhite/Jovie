import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="flex min-h-[calc(100vh-4rem)] items-center py-12 md:py-24 lg:py-32">
        <Container>
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                One link. All your music.
              </h1>
              <p className="mx-auto max-w-[700px] text-lg text-gray-500 dark:text-gray-400 md:text-xl">
                Jovie auto-builds a clean profile that sends fans straight to
                your music.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/sign-in">
                <Button size="lg">Login with Spotify</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-24 lg:py-32">
        <Container>
          <div className="grid gap-10 px-10 md:gap-16 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V8.5L13.5 3Z" />
                  <path d="M13 3V8.5H19" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Simple Setup</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Connect your Spotify account and we&apos;ll automatically pull
                your music and profile.
              </p>
            </div>
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M18 20V10" />
                  <path d="M12 20V4" />
                  <path d="M6 20V14" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Smart Routing</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Fans get sent to the right streaming platform based on their
                device and preferences.
              </p>
            </div>
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M3 3v18h18" />
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Analytics</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Track clicks and see which platforms your fans prefer.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
