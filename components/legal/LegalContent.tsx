'use client';

import { useEffect, useState } from 'react';

interface LegalContentProps {
  endpoint: string;
  fallbackHtml: string;
}

export function LegalContent({ endpoint, fallbackHtml }: LegalContentProps) {
  const [contentHtml, setContentHtml] = useState('');

  useEffect(() => {
    fetch(endpoint)
      .then(res => res.text())
      .then(setContentHtml)
      .catch(err => {
        console.error(`Failed to load ${endpoint}:`, err);
        setContentHtml(fallbackHtml);
      });
  }, [endpoint, fallbackHtml]);

  return (
    <div
      className='prose prose-invert max-w-none prose-headings:text-white prose-p:text-white/70 prose-a:text-blue-400 prose-strong:text-white prose-code:text-white prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10'
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}
