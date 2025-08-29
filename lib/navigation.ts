'use client'

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Define the valid navigation items
export const NAVIGATION_ITEMS = [
  'overview',
  'links',
  'analytics',
  'audience',
  'settings',
] as const;

export type NavigationItem = typeof NAVIGATION_ITEMS[number];

// Define the valid settings sections
export const SETTINGS_SECTIONS = [
  'profile',
  'appearance',
  'links-notifications',
  'privacy',
  'advanced',
  'billing',
] as const;

export type SettingsSection = typeof SETTINGS_SECTIONS[number];

// Define the valid settings subsections
export const SETTINGS_SUBSECTIONS = [
  'profile-photo',
  'profile-name',
  'profile-bio',
  'appearance-theme',
] as const;

export type SettingsSubsection = typeof SETTINGS_SUBSECTIONS[number];

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
    // Only access window on client side
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
    // Only access window on client side
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

// URL generation utilities
export function getNavItemUrl(navItem: NavigationItem): string {
  return `/dashboard/${navItem}`;
}

export function getSettingsSectionUrl(section: SettingsSection): string {
  return `/dashboard/settings#${section}`;
}

export function getSettingsSubsectionUrl(subsection: SettingsSubsection): string {
  return `/dashboard/settings#${subsection}`;
}
