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

