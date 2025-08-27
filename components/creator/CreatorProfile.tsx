'use client';

import { useCreator } from '@/hooks/useCreator';
import { LoadingSkeleton as Skeleton } from '@/components/ui/LoadingSkeleton';
import { OptimizedAvatar as Avatar } from '@/components/ui/OptimizedAvatar';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/icons';

export function CreatorProfile({ username }: { username: string }) {
  const { creator, loading, error } = useCreator(username);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton rounded="full" className="h-24 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        <p>Failed to load creator profile. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
        <Avatar
          src={creator.avatarUrl}
          alt={creator.displayName || creator.username}
          size={128}
          className="h-24 w-24"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold">
            {creator.displayName || creator.username}
          </h1>
          {creator.bio && (
            <p className="mt-2 text-muted-foreground">{creator.bio}</p>
          )}
          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
            {creator.socialLinks?.map((link) => (
              <Button
                key={link.id}
                variant="outline"
                size="sm"
                className="gap-2"
                asChild
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <Icons.externalLink className="h-4 w-4" />
                  {link.displayText || link.platform}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {creator.spotifyUrl && (
        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold">Latest Release</h2>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full rounded-md bg-muted">
              {/* Spotify embed or custom player component would go here */}
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">
                  Music player placeholder
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
