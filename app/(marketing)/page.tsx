'use client';

/**
 * Homepage for claiming an artist profile via Spotify search.
 */

import { useState, useEffect } from 'react';
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
    if (selected) {
      window.location.href = `/api/spotify/auth?artistId=${encodeURIComponent(
        selected.id
      )}`;
    }
  };

  return (
    <div className="flex flex-col items-center py-20">
      <Container>
        <h1 className="text-4xl font-bold mb-6">Claim your profile</h1>
        <div className="flex flex-col items-center space-y-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your Spotify artist"
            className="w-full max-w-md"
          />
          {results.length > 0 && (
            <ul className="w-full max-w-md border rounded-md bg-white">
              {results.map((artist) => {
                const imageUrl = artist.images?.[0]?.url;
                return (
                  <li
                    key={artist.id}
                    onClick={() => setSelected(artist)}
                    className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                      selected?.id === artist.id ? 'bg-gray-200' : ''
                    }`}
                  >
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={`${artist.name} profile photo`}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 mr-3" />
                    )}
                    <span>{artist.name}</span>
                  </li>
                );
              })}
            </ul>
          )}
          <Button onClick={handleClaim} disabled={!selected} size="lg">
            Claim your profile
          </Button>
        </div>
      </Container>
    </div>
  );
}
