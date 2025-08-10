'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef, useLayoutEffect, useState } from 'react';

export type FeaturedArtist = {
  id: string;
  handle: string;
  name: string;
  src: string;
  alt?: string;
};

export default function FeaturedArtists({
  artists,
}: {
  artists: FeaturedArtist[];
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start end', 'end start'],
  });

  const [range, setRange] = useState(0);
  useLayoutEffect(() => {
    const el = wrapRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const r = track.scrollWidth - el.clientWidth;
    setRange(Math.max(0, r));
    const onResize = () => {
      const r2 = track.scrollWidth - el.clientWidth;
      setRange(Math.max(0, r2));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [artists?.length]);

  const x = useTransform(scrollYProgress, [0, 1], [0, -range]);

  return (
    <section aria-label="Featured artists" className="relative">
      <div ref={wrapRef} className="relative h-[120vh] md:h-[140vh]">
        <div className="sticky top-16 md:top-20">
          {/* Desktop: scroll-tied horizontal drift */}
          <motion.ul
            ref={trackRef}
            style={{ x }}
            className="mt-4 hidden md:flex items-center gap-10 will-change-transform"
          >
            {artists.map((a) => (
              <li key={a.id} className="shrink-0">
                <Link
                  href={`/${a.handle}`}
                  aria-label={`View ${a.name}'s profile`}
                  title={a.name}
                  className="group block cursor-pointer"
                >
                  <Image
                    src={a.src}
                    alt={a.alt ?? a.name}
                    width={256}
                    height={256}
                    loading="lazy"
                    decoding="async"
                    className="size-40 rounded-full object-cover ring-1 ring-white/15 shadow-2xl group-hover:ring-white/25"
                  />
                </Link>
              </li>
            ))}
          </motion.ul>

          {/* Mobile: swipe */}
          <ul className="mt-4 md:hidden flex items-center gap-6 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {artists.map((a) => (
              <li key={a.id} className="shrink-0 first:ml-2 last:mr-2">
                <Link
                  href={`/${a.handle}`}
                  aria-label={`View ${a.name}'s profile`}
                  title={a.name}
                  className="group block cursor-pointer"
                >
                  <Image
                    src={a.src}
                    alt={a.alt ?? a.name}
                    width={176}
                    height={176}
                    loading="lazy"
                    decoding="async"
                    className="size-28 rounded-full object-cover ring-1 ring-black/10 dark:ring-white/15 shadow-lg group-hover:ring-white/25"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
