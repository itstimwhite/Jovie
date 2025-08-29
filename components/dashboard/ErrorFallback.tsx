'use client';

import React from 'react';

export function ErrorFallback() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0E12] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-600 dark:text-white/70 mb-4">
          Failed to load overview data. Please refresh the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}

