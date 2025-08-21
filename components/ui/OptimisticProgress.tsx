'use client';

import { useEffect, useState } from 'react';

interface OptimisticProgressProps {
  isActive: boolean;
  steps: string[];
  currentStep: number;
  className?: string;
}

export function OptimisticProgress({ 
  isActive, 
  steps, 
  currentStep, 
  className = '' 
}: OptimisticProgressProps) {
  const [progress, setProgress] = useState(0);
  const [displayedStep, setDisplayedStep] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      setDisplayedStep(0);
      return;
    }

    // Optimistic progress animation
    const targetProgress = Math.min(((currentStep + 1) / steps.length) * 100, 100);
    const progressIncrement = (targetProgress - progress) / 20; // Smooth animation

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + progressIncrement;
        if (newProgress >= targetProgress) {
          clearInterval(interval);
          return targetProgress;
        }
        return newProgress;
      });
    }, 50);

    // Update step display with slight delay for better UX
    const stepTimeout = setTimeout(() => {
      setDisplayedStep(Math.min(currentStep, steps.length - 1));
    }, 200);

    return () => {
      clearInterval(interval);
      clearTimeout(stepTimeout);
    };
  }, [isActive, currentStep, steps.length, progress]);

  if (!isActive) return null;

  return (
    <div className={`space-y-3 ${className}`} role="status" aria-live="polite">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Step indicator */}
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400 font-medium">
          {steps[displayedStep] || 'Processing...'}
        </span>
        <span className="text-gray-500 dark:text-gray-500 tabular-nums">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Step dots */}
      <div className="flex justify-center space-x-2" aria-hidden="true">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index <= displayedStep
                ? 'bg-blue-500 scale-110'
                : index === displayedStep + 1
                ? 'bg-blue-300 animate-pulse'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}