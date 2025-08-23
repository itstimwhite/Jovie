'use client';

import { track } from '@/lib/analytics';

// Constants
const DRAFT_STORAGE_PREFIX = 'jovie_draft_';
const DRAFT_EXPIRY_HOURS = 24; // Drafts expire after 24 hours

// Draft data interface
interface DraftData {
  path: string;
  data: Record<string, unknown>;
  timestamp: number;
  expiresAt: number;
}

/**
 * Save a draft snapshot for the current path
 * 
 * @param path The path to save the draft for (usually current URL path)
 * @param data Optional data to save (if not provided, tries to extract from forms)
 * @returns boolean indicating success
 */
export function saveDraftSnapshot(
  path: string,
  data?: Record<string, unknown>
): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    // If no data provided, try to extract from forms on the page
    const formData = data || extractFormData();
    
    // Don't save empty drafts
    if (Object.keys(formData).length === 0) return false;
    
    const now = Date.now();
    const expiresAt = now + (DRAFT_EXPIRY_HOURS * 60 * 60 * 1000);
    
    const draftData: DraftData = {
      path,
      data: formData,
      timestamp: now,
      expiresAt,
    };
    
    // Save to localStorage
    localStorage.setItem(
      `${DRAFT_STORAGE_PREFIX}${normalizePath(path)}`,
      JSON.stringify(draftData)
    );
    
    // Track analytics
    track('draft.save', { path });
    
    return true;
  } catch (error) {
    console.error('Failed to save draft:', error);
    return false;
  }
}

/**
 * Restore a draft snapshot for the given path
 * 
 * @param path The path to restore the draft for
 * @returns The draft data or null if not found
 */
export function restoreDraftSnapshot(path: string): Record<string, unknown> | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const key = `${DRAFT_STORAGE_PREFIX}${normalizePath(path)}`;
    const storedData = localStorage.getItem(key);
    
    if (!storedData) return null;
    
    const draftData = JSON.parse(storedData) as DraftData;
    
    // Check if draft has expired
    if (Date.now() > draftData.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    
    // Track analytics
    track('draft.restore', { 
      path,
      age: Date.now() - draftData.timestamp,
    });
    
    return draftData.data;
  } catch (error) {
    console.error('Failed to restore draft:', error);
    return null;
  }
}

/**
 * Clear a draft snapshot for the given path
 * 
 * @param path The path to clear the draft for
 * @returns boolean indicating success
 */
export function clearDraftSnapshot(path: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const key = `${DRAFT_STORAGE_PREFIX}${normalizePath(path)}`;
    localStorage.removeItem(key);
    
    // Track analytics
    track('draft.clear', { path });
    
    return true;
  } catch (error) {
    console.error('Failed to clear draft:', error);
    return false;
  }
}

/**
 * Check if a draft exists for the given path
 * 
 * @param path The path to check
 * @returns boolean indicating if a draft exists
 */
export function hasDraftSnapshot(path: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const key = `${DRAFT_STORAGE_PREFIX}${normalizePath(path)}`;
    const storedData = localStorage.getItem(key);
    
    if (!storedData) return false;
    
    const draftData = JSON.parse(storedData) as DraftData;
    
    // Check if draft has expired
    if (Date.now() > draftData.expiresAt) {
      localStorage.removeItem(key);
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Apply a draft to the current page forms
 * 
 * @param data The draft data to apply
 * @returns boolean indicating success
 */
export function applyDraftToForms(data: Record<string, unknown>): boolean {
  if (typeof window === 'undefined' || !data) return false;
  
  try {
    // Find all form elements
    const forms = document.querySelectorAll('form');
    let applied = false;
    
    forms.forEach(form => {
      // Find all input, select, and textarea elements
      const elements = form.querySelectorAll('input, select, textarea');
      
      elements.forEach(element => {
        const input = element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        const name = input.name || input.id;
        
        if (!name || !(name in data)) return;
        
        // Apply value based on input type
        if (input instanceof HTMLInputElement) {
          if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = Boolean(data[name]);
          } else {
            input.value = String(data[name] || '');
          }
        } else {
          input.value = String(data[name] || '');
        }
        
        applied = true;
        
        // Dispatch input event to trigger any listeners
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
    
    return applied;
  } catch (error) {
    console.error('Failed to apply draft to forms:', error);
    return false;
  }
}

/**
 * Extract form data from the current page
 * 
 * @returns Record of form field values
 */
function extractFormData(): Record<string, unknown> {
  if (typeof window === 'undefined') return {};
  
  const formData: Record<string, unknown> = {};
  
  try {
    // Find all form elements
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Find all input, select, and textarea elements
      const elements = form.querySelectorAll('input, select, textarea');
      
      elements.forEach(element => {
        const input = element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        const name = input.name || input.id;
        
        if (!name) return;
        
        // Extract value based on input type
        if (input instanceof HTMLInputElement) {
          if (input.type === 'checkbox' || input.type === 'radio') {
            formData[name] = input.checked;
          } else if (input.type !== 'password') { // Skip password fields
            formData[name] = input.value;
          }
        } else {
          formData[name] = input.value;
        }
      });
    });
  } catch (error) {
    console.error('Failed to extract form data:', error);
  }
  
  return formData;
}

/**
 * Normalize a path for storage
 * 
 * @param path The path to normalize
 * @returns Normalized path
 */
function normalizePath(path: string): string {
  // Remove query parameters and hash
  const basePath = path.split('?')[0].split('#')[0];
  
  // Remove trailing slash
  return basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
}

/**
 * Clean up expired drafts
 */
export function cleanupExpiredDrafts(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const now = Date.now();
    let count = 0;
    
    // Check all localStorage items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key?.startsWith(DRAFT_STORAGE_PREFIX)) {
        try {
          const storedData = localStorage.getItem(key);
          
          if (storedData) {
            const draftData = JSON.parse(storedData) as DraftData;
            
            // Remove if expired
            if (now > draftData.expiresAt) {
              localStorage.removeItem(key);
              count++;
            }
          }
        } catch {
          // If we can't parse the item, remove it
          localStorage.removeItem(key);
          count++;
        }
      }
    }
    
    if (count > 0) {
      track('draft.cleanup', { count });
    }
  } catch (error) {
    console.error('Failed to clean up expired drafts:', error);
  }
}

