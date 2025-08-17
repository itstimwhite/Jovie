'use client';

import { useState } from 'react';

// Mock TipButton for demo purposes
function DemoTipButton({
  handle,
  artistName,
  className = '',
}: {
  handle: string;
  artistName: string;
  className?: string;
}) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    alert(`Demo: Would navigate to /${handle}/tip`);
    setTimeout(() => setIsPressed(false), 150);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium
        bg-gradient-to-b from-purple-500 to-purple-600 
        hover:from-purple-600 hover:to-purple-700
        active:from-purple-700 active:to-purple-800
        text-white rounded-full transition-all duration-200 ease-out
        shadow-sm hover:shadow-md active:shadow-sm
        focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
        dark:focus:ring-offset-gray-900
        transform hover:scale-105 active:scale-95
        ${isPressed ? 'scale-95' : ''}
        ${className}
      `}
      title={`Tip ${artistName}`}
      aria-label={`Send a tip to ${artistName}`}
    >
      <span className="relative z-10 flex items-center gap-1.5">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
        Tip
      </span>

      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 ease-out" />
    </button>
  );
}

// Mock SocialIcon for demo purposes
function DemoSocialIcon({ platform }: { platform: string }) {
  const iconMap: Record<string, string> = {
    instagram: '📷',
    twitter: '🐦',
    spotify: '🎵',
    youtube: '📺',
    tiktok: '📱',
  };

  return <span>{iconMap[platform] || '🔗'}</span>;
}

// Mock SocialLink for demo purposes
function DemoSocialLink({
  platform,
  artistName,
}: {
  platform: string;
  artistName: string;
}) {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        alert(`Demo: Would open ${platform} for ${artistName}`);
      }}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 cursor-pointer"
      title={`Follow on ${platform}`}
      aria-label={`Follow ${artistName} on ${platform}`}
    >
      <DemoSocialIcon platform={platform} />
    </a>
  );
}

// Mock SocialBar for demo purposes
function DemoSocialBar({
  handle,
  artistName,
  socialLinks,
  showTipButton = false,
}: {
  handle: string;
  artistName: string;
  socialLinks: string[];
  showTipButton?: boolean;
}) {
  if (socialLinks.length === 0 && !showTipButton) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-4 w-full max-w-sm mx-auto">
      {/* Social Icons - Left Side */}
      <div className="flex flex-wrap gap-3">
        {socialLinks.map((platform) => (
          <DemoSocialLink
            key={platform}
            platform={platform}
            artistName={artistName}
          />
        ))}
      </div>

      {/* Tip Button - Right Side */}
      {showTipButton && (
        <div className="flex-shrink-0">
          <DemoTipButton handle={handle} artistName={artistName} />
        </div>
      )}
    </div>
  );
}

export default function ComponentDemoPage() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? 'dark bg-gray-900' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Tip Button Component Demo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Testing the new tip button integration with social bar -
              Apple-style UX
            </p>
          </div>

          {/* Demo Sections */}
          <div className="space-y-8">
            {/* Section 1: Social Bar Only */}
            <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                1. Social Bar Only (Original)
              </h2>
              <div className="flex justify-center">
                <DemoSocialBar
                  handle="demo-artist"
                  artistName="Demo Artist"
                  socialLinks={['instagram', 'twitter', 'spotify']}
                  showTipButton={false}
                />
              </div>
            </section>

            {/* Section 2: Social Bar with Tip Button */}
            <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                2. Social Bar with Tip Button (New) - Icons Left, Button Right
              </h2>
              <div className="flex justify-center">
                <DemoSocialBar
                  handle="demo-artist"
                  artistName="Demo Artist"
                  socialLinks={['instagram', 'twitter', 'spotify']}
                  showTipButton={true}
                />
              </div>
            </section>

            {/* Section 3: Tip Button Only */}
            <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                3. Tip Button Standalone
              </h2>
              <div className="flex justify-center">
                <DemoTipButton handle="demo-artist" artistName="Demo Artist" />
              </div>
            </section>

            {/* Section 4: Only Tip Button (No Social Links) */}
            <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                4. Social Bar with Only Tip Button (No Social Links)
              </h2>
              <div className="flex justify-center">
                <DemoSocialBar
                  handle="demo-artist"
                  artistName="Demo Artist"
                  socialLinks={[]}
                  showTipButton={true}
                />
              </div>
            </section>

            {/* Section 5: Responsive Test */}
            <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                5. Responsive Test (Many Social Links + Tip Button)
              </h2>
              <div className="flex justify-center">
                <DemoSocialBar
                  handle="demo-artist"
                  artistName="Demo Artist"
                  socialLinks={[
                    'instagram',
                    'twitter',
                    'spotify',
                    'youtube',
                    'tiktok',
                  ]}
                  showTipButton={true}
                />
              </div>
            </section>
          </div>

          {/* Design Notes */}
          <section className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Design Features (Apple-style UX)
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>• Purple gradient background with hover/active states</li>
              <li>• Smooth scale transforms on hover/click</li>
              <li>• Shimmer effect on hover</li>
              <li>• Dollar icon with &quot;Tip&quot; text</li>
              <li>• Focus ring for accessibility</li>
              <li>• Clean spacing and typography</li>
              <li>• Responsive layout: icons left, button right</li>
            </ul>
          </section>

          {/* Controls */}
          <div className="text-center space-y-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Toggle Dark Mode
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click any social icon or tip button to see demo interaction
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
