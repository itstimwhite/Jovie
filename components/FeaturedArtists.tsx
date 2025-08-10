'use client';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useLayoutEffect, useState } from 'react';

type Artist = { id: string; name: string; src: string; alt?: string };

export default function FeaturedArtists({ artists }: { artists: Artist[] }) {
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
    <section
      aria-labelledby="featured-heading"
      className="relative border-t border-white/10"
    >
      <div ref={wrapRef} className="relative h-[120vh] md:h-[140vh]">
        {/* Pinned content */}
        <div className="sticky top-16 md:top-20">
          <h2
            id="featured-heading"
            className="text-center text-2xl md:text-4xl font-semibold"
          >
            Artists using Jovie
          </h2>

          {/* Desktop: scroll-tied horizontal drift */}
          <motion.ul
            ref={trackRef}
            style={{ x }}
            className="mt-8 hidden md:flex items-center gap-10 will-change-transform"
          >
            {artists.map((a) => (
              <li key={a.id} className="shrink-0">
                <Image
                  src={a.src}
                  alt={a.alt ?? a.name}
                  width={256}
                  height={256}
                  loading="lazy"
                  decoding="async"
                  className="size-40 rounded-full object-cover ring-1 ring-white/15 shadow-2xl"
                />
              </li>
            ))}
          </motion.ul>

          {/* Mobile: swipe with snap */}
          <ul className="mt-6 md:hidden flex items-center gap-6 overflow-x-auto snap-x snap-mandatory px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {artists.map((a) => (
              <li
                key={a.id}
                className="snap-start shrink-0 first:ml-2 last:mr-2"
              >
                <Image
                  src={a.src}
                  alt={a.alt ?? a.name}
                  width={176}
                  height={176}
                  loading="lazy"
                  decoding="async"
                  className="size-28 rounded-full object-cover ring-1 ring-black/10 dark:ring-white/15 shadow-lg"
                />
              </li>
            ))}
          </ul>

          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-neutral-900/80 to-transparent hidden md:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-neutral-900/80 to-transparent hidden md:block" />
        </div>
      </div>
    </section>
  );
}
