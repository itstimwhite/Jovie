import Link from 'next/link';

export function Footer() {
  return (
    <footer
      className="bg-neutral-950 text-white dark:bg-black"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-white/70">© 2025 Jovie</div>
        <nav
          aria-label="Footer navigation"
          className="flex items-center gap-6 text-sm"
        >
          <Link
            href="/privacy"
            className="text-white/60 hover:text-white focus:text-white focus:outline-hidden focus:ring-2 focus:ring-white/50 rounded-sm px-1 py-0.5 transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-white/60 hover:text-white focus:text-white focus:outline-hidden focus:ring-2 focus:ring-white/50 rounded-sm px-1 py-0.5 transition-colors"
          >
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
