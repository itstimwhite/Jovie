/**
 * Instagram profile image fetcher
 * 
 * This utility fetches Instagram profile images using a combination of
 * approaches, with fallbacks for reliability.
 */

import { getInstagramProfileUrl, normalizeInstagramHandle } from './instagram-utils';

// Types for the fetcher response
export interface InstagramImageFetchResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
  source?: 'oembed' | 'opengraph' | 'html';
}

/**
 * Fetches an Instagram profile image using multiple methods with fallbacks
 * 
 * @param handle Instagram handle (can be normalized or not)
 * @returns Promise resolving to the fetch result
 */
export async function fetchInstagramProfileImage(
  handle: string
): Promise<InstagramImageFetchResult> {
  const normalizedHandle = normalizeInstagramHandle(handle);
  
  if (!normalizedHandle) {
    return {
      success: false,
      error: 'Invalid Instagram handle',
    };
  }
  
  // Try multiple methods with fallbacks
  try {
    // First try oEmbed API (most reliable when it works)
    const oembedResult = await fetchViaOEmbed(normalizedHandle);
    if (oembedResult.success) {
      return oembedResult;
    }
    
    // Fall back to Open Graph tags
    const ogResult = await fetchViaOpenGraph(normalizedHandle);
    if (ogResult.success) {
      return ogResult;
    }
    
    // Last resort: parse HTML directly
    const htmlResult = await fetchViaHtmlParsing(normalizedHandle);
    if (htmlResult.success) {
      return htmlResult;
    }
    
    // All methods failed
    return {
      success: false,
      error: 'Could not fetch Instagram profile image using any available method',
    };
  } catch (error) {
    return {
      success: false,
      error: `Error fetching Instagram profile image: ${error.message || 'Unknown error'}`,
    };
  }
}

/**
 * Fetches Instagram profile image via oEmbed API
 * 
 * @param handle Normalized Instagram handle
 * @returns Promise resolving to the fetch result
 */
async function fetchViaOEmbed(
  handle: string
): Promise<InstagramImageFetchResult> {
  try {
    const profileUrl = getInstagramProfileUrl(handle);
    
    // Instagram's oEmbed endpoint requires an access token now,
    // so we'll use a public oEmbed provider that supports Instagram
    const oembedUrl = `https://api.microlink.io/?url=${encodeURIComponent(profileUrl)}&meta=true`;
    
    const response = await fetchWithTimeout(oembedUrl, { timeout: 5000 });
    
    if (!response.ok) {
      return {
        success: false,
        error: `oEmbed API returned status ${response.status}`,
        source: 'oembed',
      };
    }
    
    const data = await response.json();
    
    // Extract author thumbnail from microlink response
    if (data?.data?.author?.image?.url) {
      return {
        success: true,
        imageUrl: data.data.author.image.url,
        source: 'oembed',
      };
    }
    
    return {
      success: false,
      error: 'Could not find profile image in oEmbed response',
      source: 'oembed',
    };
  } catch (error) {
    return {
      success: false,
      error: `oEmbed fetch error: ${error.message || 'Unknown error'}`,
      source: 'oembed',
    };
  }
}

/**
 * Fetches Instagram profile image via Open Graph tags
 * 
 * @param handle Normalized Instagram handle
 * @returns Promise resolving to the fetch result
 */
async function fetchViaOpenGraph(
  handle: string
): Promise<InstagramImageFetchResult> {
  try {
    const profileUrl = getInstagramProfileUrl(handle);
    
    // Use a service that can extract Open Graph tags
    const ogUrl = `https://api.microlink.io/?url=${encodeURIComponent(profileUrl)}&meta=true`;
    
    const response = await fetchWithTimeout(ogUrl, { timeout: 5000 });
    
    if (!response.ok) {
      return {
        success: false,
        error: `Open Graph API returned status ${response.status}`,
        source: 'opengraph',
      };
    }
    
    const data = await response.json();
    
    // Try to extract profile image from Open Graph data
    if (data?.data?.image?.url) {
      return {
        success: true,
        imageUrl: data.data.image.url,
        source: 'opengraph',
      };
    }
    
    return {
      success: false,
      error: 'Could not find profile image in Open Graph response',
      source: 'opengraph',
    };
  } catch (error) {
    return {
      success: false,
      error: `Open Graph fetch error: ${error.message || 'Unknown error'}`,
      source: 'opengraph',
    };
  }
}

/**
 * Fetches Instagram profile image via direct HTML parsing
 * 
 * @param handle Normalized Instagram handle
 * @returns Promise resolving to the fetch result
 */
async function fetchViaHtmlParsing(
  handle: string
): Promise<InstagramImageFetchResult> {
  try {
    const profileUrl = getInstagramProfileUrl(handle);
    
    // Use a headless browser service or HTML parser
    // For simplicity, we'll use a service that can extract images from HTML
    const htmlUrl = `https://api.microlink.io/?url=${encodeURIComponent(profileUrl)}&screenshot=true&meta=false`;
    
    const response = await fetchWithTimeout(htmlUrl, { timeout: 8000 });
    
    if (!response.ok) {
      return {
        success: false,
        error: `HTML parsing API returned status ${response.status}`,
        source: 'html',
      };
    }
    
    const data = await response.json();
    
    // Try to extract screenshot from response
    if (data?.data?.screenshot?.url) {
      return {
        success: true,
        imageUrl: data.data.screenshot.url,
        source: 'html',
      };
    }
    
    return {
      success: false,
      error: 'Could not find profile image in HTML parsing response',
      source: 'html',
    };
  } catch (error) {
    return {
      success: false,
      error: `HTML parsing error: ${error.message || 'Unknown error'}`,
      source: 'html',
    };
  }
}

/**
 * Fetch with timeout utility
 * 
 * @param url URL to fetch
 * @param options Fetch options with timeout
 * @returns Promise resolving to the fetch response
 */
async function fetchWithTimeout(
  url: string,
  options: { timeout?: number } & RequestInit = {}
): Promise<Response> {
  const { timeout = 5000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    // Add user agent to avoid being blocked
    const headers = {
      'User-Agent': 'Mozilla/5.0 (compatible; JovieBot/1.0; +https://jovie.com)',
      ...fetchOptions.headers,
    };
    
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });
    
    return response;
  } finally {
    clearTimeout(id);
  }
}

