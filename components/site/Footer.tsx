import Link from 'next/link';
import { Container } from './Container';
import { ThemeToggle } from './ThemeToggle';
import { getCopyrightText, LEGAL } from '@/constants/app';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0D0E12]">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-12 md:h-20 md:py-0 w-full">
          <div className="flex flex-col items-center md:items-start space-y-2 text-sm text-white/50">
            <p>{getCopyrightText()}</p>
            <p className="text-xs text-white/30">
              Made for musicians, by musicians
            </p>
          </div>
          <div className="flex items-center space-x-6 text-sm md:ml-auto">
            <Link
              href={LEGAL.privacyPath}
              className="text-white/50 hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              href={LEGAL.termsPath}
              className="text-white/50 hover:text-white transition-colors"
            >
              Terms
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </footer>
  );
}
