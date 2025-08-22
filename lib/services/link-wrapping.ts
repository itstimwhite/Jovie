/**
 * Link Wrapping Service with Anti-Cloaking Protection
 * Handles creation and management of wrapped links
 */

import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  categorizeDomain,
  getCrawlerSafeLabel,
} from '@/lib/utils/domain-categorizer';
import {
  simpleEncryptUrl,
  simpleDecryptUrl,
  generateShortId,
  isValidUrl,
  extractDomain,
} from '@/lib/utils/url-encryption';

export interface WrappedLink {
  id: string;
  shortId: string;
  originalUrl: string;
  kind: 'normal' | 'sensitive';
  domain: string;
  category?: string;
  titleAlias?: string;
  clickCount: number;
  createdAt: string;
  expiresAt?: string;
}

export interface CreateWrappedLinkOptions {
  url: string;
  userId?: string;
  expiresInHours?: number;
  customAlias?: string;
}

export interface LinkStats {
  totalClicks: number;
  normalLinks: number;
  sensitiveLinks: number;
  topDomains: Array<{ domain: string; count: number }>;
}

/**
 * Creates a new wrapped link with anti-cloaking protection
 */
export async function createWrappedLink(
  options: CreateWrappedLinkOptions
): Promise<WrappedLink | null> {
  const { url, userId, expiresInHours, customAlias } = options;

  if (!isValidUrl(url)) {
    throw new Error('Invalid URL provided');
  }

  const domain = extractDomain(url);
  const category = await categorizeDomain(url);

  try {
    const supabase = await createServerSupabaseClient();

    // Generate unique short ID
    let shortId = customAlias || generateShortId();

    // Ensure short ID is unique
    let attempts = 0;
    while (attempts < 5) {
      const { data: existing } = await supabase
        .from('wrapped_links')
        .select('id')
        .eq('short_id', shortId)
        .single();

      if (!existing) break;

      shortId = generateShortId();
      attempts++;
    }

    if (attempts >= 5) {
      throw new Error('Failed to generate unique short ID');
    }

    // Encrypt URL for storage
    const encryptedUrl = simpleEncryptUrl(url);

    // Calculate expiration
    const expiresAt = expiresInHours
      ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString()
      : null;

    // Create wrapped link record
    const { data, error } = await supabase
      .from('wrapped_links')
      .insert({
        short_id: shortId,
        encrypted_url: encryptedUrl,
        kind: category.kind,
        domain,
        category: category.category,
        title_alias: category.alias || getCrawlerSafeLabel(domain),
        created_by: userId || null,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create wrapped link:', error);
      return null;
    }

    return {
      id: data.id,
      shortId: data.short_id,
      originalUrl: url,
      kind: data.kind,
      domain: data.domain,
      category: data.category,
      titleAlias: data.title_alias,
      clickCount: data.click_count,
      createdAt: data.created_at,
      expiresAt: data.expires_at,
    };
  } catch (error) {
    console.error('Link wrapping service error:', error);
    return null;
  }
}

/**
 * Retrieves a wrapped link by short ID
 */
export async function getWrappedLink(
  shortId: string
): Promise<WrappedLink | null> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('wrapped_links')
      .select('*')
      .eq('short_id', shortId)
      .single();

    if (error || !data) {
      return null;
    }

    // Check if link has expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return null;
    }

    // Decrypt URL
    const originalUrl = simpleDecryptUrl(data.encrypted_url);

    return {
      id: data.id,
      shortId: data.short_id,
      originalUrl,
      kind: data.kind,
      domain: data.domain,
      category: data.category,
      titleAlias: data.title_alias,
      clickCount: data.click_count,
      createdAt: data.created_at,
      expiresAt: data.expires_at,
    };
  } catch (error) {
    console.error('Failed to get wrapped link:', error);
    return null;
  }
}

/**
 * Increments click count for a wrapped link
 */
export async function incrementClickCount(shortId: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from('wrapped_links')
      .update({
        click_count: supabase.rpc('increment_click_count', {
          link_short_id: shortId,
        }),
      })
      .eq('short_id', shortId);

    return !error;
  } catch (error) {
    console.error('Failed to increment click count:', error);
    return false;
  }
}

/**
 * Gets link statistics for analytics
 */
export async function getLinkStats(userId?: string): Promise<LinkStats> {
  try {
    const supabase = await createServerSupabaseClient();

    let query = supabase.from('wrapped_links').select('*');

    if (userId) {
      query = query.eq('created_by', userId);
    }

    const { data, error } = await query;

    if (error || !data) {
      return {
        totalClicks: 0,
        normalLinks: 0,
        sensitiveLinks: 0,
        topDomains: [],
      };
    }

    const totalClicks = data.reduce((sum, link) => sum + link.click_count, 0);
    const normalLinks = data.filter((link) => link.kind === 'normal').length;
    const sensitiveLinks = data.filter(
      (link) => link.kind === 'sensitive'
    ).length;

    // Calculate top domains
    const domainCounts: Record<string, number> = {};
    data.forEach((link) => {
      domainCounts[link.domain] =
        (domainCounts[link.domain] || 0) + link.click_count;
    });

    const topDomains = Object.entries(domainCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([domain, count]) => ({ domain, count }));

    return {
      totalClicks,
      normalLinks,
      sensitiveLinks,
      topDomains,
    };
  } catch (error) {
    console.error('Failed to get link stats:', error);
    return {
      totalClicks: 0,
      normalLinks: 0,
      sensitiveLinks: 0,
      topDomains: [],
    };
  }
}

/**
 * Deletes expired links (cleanup function)
 */
export async function cleanupExpiredLinks(): Promise<number> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('wrapped_links')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('id');

    if (error) {
      console.error('Failed to cleanup expired links:', error);
      return 0;
    }

    return data?.length || 0;
  } catch (error) {
    console.error('Cleanup error:', error);
    return 0;
  }
}

/**
 * Batch creates wrapped links for multiple URLs
 */
export async function createWrappedLinksBatch(
  urls: string[],
  userId?: string
): Promise<WrappedLink[]> {
  const results: WrappedLink[] = [];

  for (const url of urls) {
    try {
      const wrappedLink = await createWrappedLink({ url, userId });
      if (wrappedLink) {
        results.push(wrappedLink);
      }
    } catch (error) {
      console.error(`Failed to wrap URL ${url}:`, error);
    }
  }

  return results;
}

/**
 * Updates a wrapped link's metadata
 */
export async function updateWrappedLink(
  shortId: string,
  updates: Partial<Pick<WrappedLink, 'titleAlias' | 'expiresAt'>>
): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();

    const updateData: any = {};
    if (updates.titleAlias) updateData.title_alias = updates.titleAlias;
    if (updates.expiresAt) updateData.expires_at = updates.expiresAt;

    const { error } = await supabase
      .from('wrapped_links')
      .update(updateData)
      .eq('short_id', shortId);

    return !error;
  } catch (error) {
    console.error('Failed to update wrapped link:', error);
    return false;
  }
}
