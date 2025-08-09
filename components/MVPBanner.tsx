'use client';

import React from 'react';

export default function MVPBanner() {
  return (
    <div className="w-full border-b border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 text-center text-sm py-2 px-4">
      <span>hi friends! you’re looking at a crude mvp.</span>{' '}
      <span>you probably know that if you found your way here.</span>{' '}
      <span>send us some feedback!</span>
    </div>
  );
}
