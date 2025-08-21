/**
 * Link Wrapping Utilities
 * Handles URL encryption, domain categorization, and link creation
 */

import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

export type LinkKind = 'normal' | 'sensitive';

export interface WrappedLink {
  id: string;
  kind: LinkKind;
  original_domain: string;
  clicks: number;
  created_at: string;
}

export interface LinkRedirectInfo {
  url: string;
  kind: LinkKind;
  domain: string;
  creator_username: string;
}

/**
 * Extract domain from URL for categorization
 */
export function extractDomain(url: string): string {
  try {
    // Remove protocol
    let domain = url.replace(/^https?:\/\//, '');
    // Remove www. prefix
    domain = domain.replace(/^www\./, '');
    // Extract domain (everything before first slash or query)
    domain = domain.split('/')[0].split('?')[0];
    // Remove port if present
    domain = domain.split(':')[0];
    
    return domain.toLowerCase();
  } catch {
    return '';
  }
}

/**
 * Check if domain is categorized as sensitive
 */
export async function isSensitiveDomain(domain: string): Promise<boolean> {
  const supabase = createServerSupabaseClient();
  
  const { data } = await supabase
    .from('sensitive_domains')
    .select('domain')
    .eq('domain', domain.toLowerCase())
    .single();
    
  return !!data;
}

/**
 * Create a wrapped link for a creator
 */
export async function createWrappedLink(
  creatorId: string,
  targetUrl: string,
  forceKind?: LinkKind
): Promise<string | null> {
  const supabase = createServerSupabaseClient();
  
  const { data } = await supabase
    .rpc('create_wrapped_link', {
      creator_id: creatorId,
      target_url: targetUrl,
      force_kind: forceKind || null
    });
    
  return data;
}

/**
 * Get wrapped link information for redirect
 */
export async function getWrappedLinkInfo(linkId: string): Promise<LinkRedirectInfo | null> {
  const supabase = createServerSupabaseClient();
  
  const { data } = await supabase
    .rpc('get_wrapped_link_url', {
      link_id: linkId
    });
    
  return data?.[0] || null;
}

/**
 * Increment click count for a wrapped link
 */
export async function incrementLinkClicks(linkId: string): Promise<void> {
  const supabase = createServerSupabaseClient();
  
  await supabase.rpc('increment_wrapped_link_clicks', {
    link_id: linkId
  });
}

/**
 * Generate signed URL for sensitive link access
 */
export async function generateSignedUrl(linkId: string, expirySeconds = 60): Promise<string | null> {
  const supabase = createServerSupabaseClient();
  
  const { data } = await supabase
    .rpc('generate_signed_url', {
      link_id: linkId,
      expiry_seconds: expirySeconds
    });
    
  return data;
}

/**
 * Verify signed URL and return link ID
 */
export async function verifySignedUrl(signedToken: string): Promise<string | null> {
  const supabase = createServerSupabaseClient();
  
  try {
    const { data } = await supabase
      .rpc('verify_signed_url', {
        signed_token: signedToken
      });
      
    return data;
  } catch {
    return null;
  }
}

/**
 * Get all wrapped links for a creator
 */
export async function getCreatorWrappedLinks(creatorId: string): Promise<WrappedLink[]> {
  const supabase = createServerSupabaseClient();
  
  const { data } = await supabase
    .from('wrapped_links')
    .select('id, kind, original_domain, clicks, created_at')
    .eq('creator_profile_id', creatorId)
    .order('created_at', { ascending: false });
    
  return data || [];
}

/**
 * Client-side utilities for browser environment
 */
export class ClientLinkWrapper {
  private supabase: ReturnType<typeof createClient>;
  
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!
    );
  }
  
  /**
   * Check if domain is sensitive (client-side)
   */
  async isSensitiveDomain(domain: string): Promise<boolean> {
    const { data } = await this.supabase
      .from('sensitive_domains')
      .select('domain')
      .eq('domain', domain.toLowerCase())
      .single();
      
    return !!data;
  }
  
  /**
   * Get wrapped link info (client-side)
   */
  async getWrappedLinkInfo(linkId: string): Promise<LinkRedirectInfo | null> {
    const { data } = await this.supabase
      .rpc('get_wrapped_link_url', {
        link_id: linkId
      });
      
    return data?.[0] || null;
  }
  
  /**
   * Increment clicks (client-side)
   */
  async incrementClicks(linkId: string): Promise<void> {
    await this.supabase.rpc('increment_wrapped_link_clicks', {
      link_id: linkId
    });
  }
}

/**
 * Bot/Crawler Detection
 */
export interface BotDetectionResult {
  isBot: boolean;
  isMeta: boolean;
  reason: string;
}

/**
 * Meta/Facebook user agents and ASNs to block
 */
const META_USER_AGENTS = [
  'facebookexternalhit',
  'facebot',
  'instagram',
  'whatsapp'
];

const META_ASNS = [
  'AS32934', // Facebook
  'AS63293'  // Facebook/Meta
];

/**
 * Detect if request is from a bot or Meta crawler
 */
export function detectBot(userAgent: string, asn?: string): BotDetectionResult {
  const ua = userAgent.toLowerCase();
  
  // Check for Meta user agents
  for (const metaUA of META_USER_AGENTS) {
    if (ua.includes(metaUA)) {
      return {
        isBot: true,
        isMeta: true,
        reason: `Meta crawler detected: ${metaUA}`
      };
    }
  }
  
  // Check for Meta ASNs
  if (asn && META_ASNS.includes(asn)) {
    return {
      isBot: true,
      isMeta: true,
      reason: `Meta ASN detected: ${asn}`
    };
  }
  
  // Check for common bot user agents
  const botPatterns = [
    'bot', 'crawler', 'spider', 'scraper', 'fetch',
    'curl', 'wget', 'python', 'node', 'axios'
  ];
  
  for (const pattern of botPatterns) {
    if (ua.includes(pattern)) {
      return {
        isBot: true,
        isMeta: false,
        reason: `Bot pattern detected: ${pattern}`
      };
    }
  }
  
  return {
    isBot: false,
    isMeta: false,
    reason: 'Human user detected'
  };
}

/**
 * Generate wrapped link URL for use in components
 */
export function generateWrappedUrl(linkId: string, kind: LinkKind): string {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_SITE_URL || 'https://jovie.app'
    : 'http://localhost:3000';
    
  return kind === 'sensitive' 
    ? `${baseUrl}/out/${linkId}`
    : `${baseUrl}/go/${linkId}`;
}

/**
 * Security headers for sensitive link responses
 */
export const SECURITY_HEADERS = {
  'X-Robots-Tag': 'noindex, nofollow, nosnippet, noarchive, notranslate',
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Cache-Control': 'no-cache, no-store, must-revalidate, private'
} as const;