'use client';

/**
 * Homepage for claiming an artist profile via Spotify search.
 */

import { useState, useEffect } from 'react';
import { useClerk } from '@clerk/nextjs';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/site/Container';
import Image from 'next/image';
import type { SpotifyArtist } from '@/types/common';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SpotifyArtist[]>([]);
  const [selected, setSelected] = useState<SpotifyArtist | null>(null);
  const clerk = useClerk();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await fetch(
        `/api/spotify/search?q=${encodeURIComponent(query)}`
      );
      if (res.ok) {
        setResults(await res.json());
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleClaim = () => {
    if (selected && clerk) {
      const destination = `/dashboard?artistId=${encodeURIComponent(
        selected.id
      )}`;
      clerk.redirectToSignIn({
        signInFallbackRedirectUrl: destination,
      });
    }
  };

  return (
    <section className="flex h-full w-full items-center justify-center">
      <Container className="flex flex-col items-center text-center space-y-8">
        <h1 className="text-5xl font-semibold tracking-tight">
          Claim your artist profile
        </h1>
        <div className="flex w-full max-w-md flex-col items-center space-y-4">
          <div className="relative w-full">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Spotify for your artist"
              className="w-full pr-40"
            />
            <Button
              onClick={handleClaim}
              disabled={!selected}
              className="absolute inset-y-0 right-0 h-full rounded-l-none px-6"
            >
              Claim
            </Button>
          </div>
          {results.length > 0 && (
            <ul className="w-full border rounded-md bg-white shadow-md">
              {results.map((artist) => {
                const imageUrl = artist.images?.[0]?.url;
                return (
                  <li
                    key={artist.id}
                    onClick={() => setSelected(artist)}
                    className={`flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100 ${
                      selected?.id === artist.id ? 'bg-gray-200' : ''
                    }`}
                  >
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={`${artist.name} profile photo`}
                        width={40}
                        height={40}
                        className="mr-3 h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="mr-3 h-10 w-10 rounded-full bg-gray-200" />
                    )}
                    <span>{artist.name}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}
