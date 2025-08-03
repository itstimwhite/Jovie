'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/site/Container';

// Legal pages need to be client components due to potential client-side dependencies
export const dynamic = 'force-dynamic';

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
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div
              className="prose prose-gray max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>
        </Container>
      </main>
    </div>
  );
}
