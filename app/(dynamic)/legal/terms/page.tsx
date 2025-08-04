'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/site/Container';

export default function TermsPage() {
  const [contentHtml, setContentHtml] = useState<string>('');

  useEffect(() => {
    // Fetch the content from an API route
    fetch('/api/legal/terms')
      .then((res) => res.text())
      .then((html) => setContentHtml(html))
      .catch((err) => {
        console.error('Failed to load terms:', err);
        setContentHtml('<p>Failed to load terms of service.</p>');
      });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#0D0E12]">
      <main className="flex-1 py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div
              className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-white/70 prose-a:text-blue-400 prose-strong:text-white prose-code:text-white prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>
        </Container>
      </main>
    </div>
  );
}
