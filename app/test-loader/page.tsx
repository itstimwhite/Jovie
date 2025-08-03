'use client';

import { useState } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Input } from '@/components/ui/Input';
import { Combobox } from '@/components/ui/Combobox';
import { Container } from '@/components/site/Container';

interface ComboboxOption {
  id: string;
  name: string;
  imageUrl?: string;
}

const testOptions: ComboboxOption[] = [
  { id: '1', name: 'Lady Gaga', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb4Uwpa6zW3zzCSQvooQNksm' },
  { id: '2', name: 'David Guetta', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb1HY2Jd0NmPuamShAr6KMms' },
  { id: '3', name: 'Billie Eilish', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb4Uwpa6zW3zzCSQvooQNksm' },
];

export default function TestLoaderPage() {
  const [inputLoading, setInputLoading] = useState(false);
  const [comboboxLoading, setComboboxLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ComboboxOption | null>(null);

  const toggleInputLoading = () => {
    setInputLoading(!inputLoading);
  };

  const toggleComboboxLoading = () => {
    setComboboxLoading(!comboboxLoading);
  };

  const handleComboboxChange = (option: ComboboxOption | null) => {
    setSelectedOption(option);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <Container>
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              LoadingSpinner Demo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Testing the animated Jovie favicon loader in different contexts
            </p>
          </div>

          {/* Standalone Spinners */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Standalone Spinners
            </h2>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Small</span>
              </div>
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="md" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Medium</span>
              </div>
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="lg" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Large</span>
              </div>
            </div>
          </div>

          {/* Input with Loading State */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Input with Loading State
            </h2>
            <div className="space-y-4">
              <Input
                placeholder="Type something..."
                loading={inputLoading}
                label="Test Input"
              />
              <button
                onClick={toggleInputLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {inputLoading ? 'Stop Loading' : 'Start Loading'}
              </button>
            </div>
          </div>

          {/* Combobox with Loading State */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Combobox with Loading State
            </h2>
            <div className="space-y-4">
              <Combobox
                options={testOptions}
                value={selectedOption}
                onChange={handleComboboxChange}
                onInputChange={() => {}}
                placeholder="Search artists..."
                isLoading={comboboxLoading}
              />
              <button
                onClick={toggleComboboxLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {comboboxLoading ? 'Stop Loading' : 'Start Loading'}
              </button>
            </div>
          </div>

          {/* Different Colors */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Different Colors
            </h2>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="md" className="text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Blue</span>
              </div>
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="md" className="text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Green</span>
              </div>
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="md" className="text-red-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Red</span>
              </div>
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="md" className="text-purple-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Purple</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
} 