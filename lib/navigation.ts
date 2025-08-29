'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  NAVIGATION_ITEMS,
  SETTINGS_SECTIONS,
  SETTINGS_SUBSECTIONS,
  NavigationItem,
  SettingsSection,
  SettingsSubsection,
  getNavItemUrl,
  getSettingsSectionUrl,
  getSettingsSubsectionUrl
} from './navigation.const';

// Re-export all constants and types from navigation.const.ts
export {
  NAVIGATION_ITEMS,
  SETTINGS_SECTIONS,
  SETTINGS_SUBSECTIONS,
  NavigationItem,
  SettingsSection,
  SettingsSubsection,
  getNavItemUrl,
  getSettingsSectionUrl,
  getSettingsSubsectionUrl
};

// URL parsing hooks
export function useCurrentNavItem(): NavigationItem {
  const pathname = usePathname();
  
  // Default to overview if no match is found
  if (!pathname) return 'overview';
  
  // Extract the navigation item from the URL
  const parts = pathname.split('/');
  const navItem = parts[2] as NavigationItem;
  
  // Validate that it's a known navigation item
  if (NAVIGATION_ITEMS.includes(navItem)) {
    return navItem;
  }
  
  return 'overview';
}

export function useCurrentSettingsSection(): SettingsSection | null {
  const pathname = usePathname();
  const [hash, setHash] = useState<string | null>(null);
  
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      // Get the hash from the window location
      setHash(window.location.hash.replace('#', ''));
      
      // Listen for hash changes
      const handleHashChange = () => {
        setHash(window.location.hash.replace('#', ''));
      };
      
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, []);
  
  // Only process if we're on the settings page
  if (!pathname || !pathname.includes('/dashboard/settings')) {
    return null;
  }
  
  // If there's a hash, check if it's a valid section
  if (hash) {
    // First check if it's a direct section match
    if (SETTINGS_SECTIONS.includes(hash as SettingsSection)) {
      return hash as SettingsSection;
    }
    
    // Then check if it's a subsection and extract the parent section
    for (const section of SETTINGS_SECTIONS) {
      if (hash.startsWith(`${section}-`)) {
        return section;
      }
    }
  }
  
  // Default to profile if no section is specified
  return 'profile';
}

export function useCurrentSettingsSubsection(): SettingsSubsection | null {
  const pathname = usePathname();
  const [hash, setHash] = useState<string | null>(null);
  
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      // Get the hash from the window location
      setHash(window.location.hash.replace('#', ''));
      
      // Listen for hash changes
      const handleHashChange = () => {
        setHash(window.location.hash.replace('#', ''));
      };
      
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, []);
  
  // Only process if we're on the settings page
  if (!pathname || !pathname.includes('/dashboard/settings')) {
    return null;
  }
  
  // If there's a hash, check if it's a valid subsection
  if (hash && SETTINGS_SUBSECTIONS.includes(hash as SettingsSubsection)) {
    return hash as SettingsSubsection;
  }
  
  return null;
}

// URL generation utilities are already re-exported at the top of the file
