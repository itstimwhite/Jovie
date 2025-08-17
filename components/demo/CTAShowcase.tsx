'use client';

import { useState } from 'react';
import PrimaryCTA from '@/components/ui/PrimaryCTA';

export function CTAShowcase() {
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);

  const handleDemoClick = (setLoading: (loading: boolean) => void) => {
    return async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false);
    };
  };

  return (
    <section className="py-20 border-t border-gray-200 dark:border-white/5">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-2xl font-semibold mb-6">Apple-Level CTA Buttons</h2>
        <p className="text-gray-600 dark:text-white/70 mb-8">
          World-class buttons with smooth loading states, no layout shift, and premium feel.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Large Button Demo */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Large Size (Default)</h3>
            <div className="max-w-sm">
              <PrimaryCTA
                ariaLabel="Listen to music"
                loadingLabel="Opening music player..."
                loading={isLoading1}
                onClick={handleDemoClick(setIsLoading1)}
                size="lg"
              >
                Listen Now
              </PrimaryCTA>
            </div>
            <p className="text-sm text-gray-600 dark:text-white/60">
              Click to see the smooth loading transition. Notice how the button 
              maintains its exact dimensions and smoothly fades between states.
            </p>
          </div>

          {/* Medium Button Demo */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Medium Size</h3>
            <div className="max-w-sm">
              <PrimaryCTA
                ariaLabel="Start free trial"
                loadingLabel="Setting up your account..."
                loading={isLoading2}
                onClick={handleDemoClick(setIsLoading2)}
                size="md"
              >
                Start Free Trial
              </PrimaryCTA>
            </div>
            <p className="text-sm text-gray-600 dark:text-white/60">
              Compact version perfect for secondary actions or smaller spaces.
            </p>
          </div>

          {/* Not Full Width Demo */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Auto Width</h3>
            <div>
              <PrimaryCTA
                ariaLabel="Save changes"
                loadingLabel="Saving..."
                loading={isLoading3}
                onClick={handleDemoClick(setIsLoading3)}
                fullWidth={false}
              >
                Save Changes
              </PrimaryCTA>
            </div>
            <p className="text-sm text-gray-600 dark:text-white/60">
              Auto-width version that sizes to content while maintaining fixed height.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Key Features</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-white/70">
              <li>✨ <strong>No Layout Shift:</strong> Fixed dimensions in all states</li>
              <li>🎭 <strong>Smooth Transitions:</strong> 200ms fade animations</li>
              <li>🎨 <strong>Premium Design:</strong> Apple-level shadows and hover effects</li>
              <li>♿ <strong>Accessible:</strong> Focus-visible, aria-labels, loading states</li>
              <li>🌙 <strong>Dark Mode:</strong> Perfect light/dark theme support</li>
              <li>📱 <strong>Responsive:</strong> Adapts beautifully to all screen sizes</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 p-6 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
          <h3 className="text-lg font-medium mb-3">Technical Implementation</h3>
          <div className="text-sm text-gray-600 dark:text-white/70 space-y-2">
            <p><strong>Fixed Heights:</strong> <code>min-h-[56px]</code> (lg), <code>min-h-[48px]</code> (md)</p>
            <p><strong>Transitions:</strong> Content fades to <code>opacity-0</code> while spinner fades in</p>
            <p><strong>Accessibility:</strong> Proper <code>aria-disabled</code>, <code>loadingLabel</code> support</p>
            <p><strong>Premium Styling:</strong> <code>shadow-lg</code>, <code>rounded-xl</code>, scale transforms</p>
          </div>
        </div>
      </div>
    </section>
  );
}