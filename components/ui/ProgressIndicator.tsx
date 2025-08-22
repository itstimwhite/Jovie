'use client';

import { useMemo } from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  showTimeEstimate?: boolean;
  className?: string;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  stepLabels = [],
  showTimeEstimate = false,
  className = '',
}: ProgressIndicatorProps) {
  const progressPercentage = useMemo(() => {
    return Math.min((currentStep / totalSteps) * 100, 100);
  }, [currentStep, totalSteps]);

  const estimatedTimeRemaining = useMemo(() => {
    if (!showTimeEstimate) return null;
    const remainingSteps = Math.max(totalSteps - currentStep, 0);
    const timePerStep = 30; // 30 seconds per step estimate
    const totalSeconds = remainingSteps * timePerStep;
    
    if (totalSeconds <= 0) return 'Complete';
    if (totalSeconds < 60) return `${totalSeconds}s remaining`;
    
    const minutes = Math.ceil(totalSeconds / 60);
    return `${minutes}m remaining`;
  }, [currentStep, totalSteps, showTimeEstimate]);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Progress Bar */}
      <div className="relative">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Progress Text */}
        <div className="flex justify-between items-center mt-2 text-xs text-gray-600 dark:text-gray-400">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          {estimatedTimeRemaining && (
            <span className="text-blue-600 dark:text-blue-400">
              {estimatedTimeRemaining}
            </span>
          )}
        </div>
      </div>

      {/* Step Labels */}
      {stepLabels.length > 0 && (
        <div className="flex justify-between items-center">
          {stepLabels.map((label, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            
            return (
              <div
                key={label}
                className={`flex-1 text-center relative ${
                  index < stepLabels.length - 1 ? 'after:content-[""] after:absolute after:top-3 after:left-1/2 after:w-full after:h-0.5 after:bg-gray-200 dark:after:bg-gray-700 after:z-0' : ''
                }`}
              >
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mb-1 transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                        ? 'bg-blue-500 text-white ring-4 ring-blue-100 dark:ring-blue-900'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      stepNumber
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium transition-colors duration-300 ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : isCompleted
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}