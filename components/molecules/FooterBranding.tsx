import Link from 'next/link';
import { JovieLogo } from '@/components/atoms/JovieLogo';
import { track } from '@/lib/analytics';
import { useFeatureFlag } from '@/lib/analytics';

interface FooterBrandingProps {
  artistHandle?: string;
  variant?: 'light' | 'dark';
  className?: string;
  showCTA?: boolean;
}

export function FooterBranding({
  artistHandle,
  variant = 'light',
  className = '',
  showCTA = true,
}: FooterBrandingProps) {
  const signUpLink = artistHandle
    ? `/sign-up?utm_source=profile&utm_artist=${artistHandle}`
    : '/sign-up';
  
  // Feature flag for tipping functionality
  const tipEnabled = useFeatureFlag('feature_tipping', false);

  // Handle Venmo tip click
  const handleTipClick = () => {
    if (!artistHandle) return;
    
    // Track the tip click event with required properties
    track('tip_click', {
      userId: artistHandle, // Using handle as userId as specified in requirements
      handle: artistHandle,
      ts: new Date().toISOString(),
    });
    
    // Open Venmo in a new tab - this is a placeholder URL
    // In a real implementation, this would be a properly formatted Venmo URL
    window.open(`https://venmo.com/${artistHandle}`, '_blank');
  };

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-2.5 ${className}`}
    >
      <JovieLogo artistHandle={artistHandle} variant={variant} />

      <div className="flex flex-col items-center space-y-2">
        {showCTA && (
          <Link
            href={signUpLink}
            className='text-[11px] uppercase tracking-[0.08em] text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400 font-medium transition-colors'
          >
            Claim your profile now
          </Link>
        )}
        
        {tipEnabled && artistHandle && (
          <button
            onClick={handleTipClick}
            className="text-[11px] uppercase tracking-[0.08em] text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors flex items-center"
          >
            <span className="mr-1">💸</span> Tip with Venmo
          </button>
        )}
      </div>
    </div>
  );
}
