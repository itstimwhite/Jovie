import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-white/70">© 2025 Jovie</div>
        <nav className="flex items-center gap-4 text-xs">
          <Link href="/privacy" className="text-white/60 hover:text-white">
            Privacy
          </Link>
          <Link href="/terms" className="text-white/60 hover:text-white">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
