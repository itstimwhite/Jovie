/**
 * Remote Image Processor
 * 
 * A utility for fetching, processing, and uploading remote images.
 * This is designed to be a reusable pipeline for remote avatar ingestion.
 */

// Import types and utilities
import type { LogEvent } from './logging';

// Types for the processor
export interface RemoteImageProcessorOptions {
  userId: string;
  sourceUrl: string;
  folder?: string;
  maxSizeBytes?: number;
  timeout?: number;
  generateSizes?: number[];
}

export interface RemoteImageProcessorResult {
  success: boolean;
  imageUrl?: string;
  thumbnailUrl?: string;
  error?: string;
  publicId?: string;
}

// List of private IP ranges to block (SSRF protection)
const PRIVATE_IP_RANGES = [
  // IPv4 private ranges
  /^127\./,                // Loopback
  /^10\./,                 // Class A private
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // Class B private
  /^192\.168\./,           // Class C private
  /^169\.254\./,           // Link-local
  
  // IPv6 private ranges
  /^::1/,                  // Loopback
  /^f[cd][0-9a-f]{2}:/i,   // Unique local
  /^fe80:/i,               // Link-local
];

/**
 * Checks if a URL points to a private IP address (SSRF protection)
 * 
 * @param url URL to check
 * @returns True if the URL points to a private IP, false otherwise
 */
function isPrivateIpUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    
    // Check against private IP ranges
    return PRIVATE_IP_RANGES.some(range => range.test(hostname));
  } catch {
    // If URL parsing fails, assume it's invalid and block it
    return true;
  }
}

/**
 * Fetches, processes, and uploads a remote image
 * 
 * @param options Processing options
 * @returns Promise resolving to the processing result
 */
export async function processRemoteImage(
  options: RemoteImageProcessorOptions
): Promise<RemoteImageProcessorResult> {
  const {
    userId,
    sourceUrl,
    folder = 'avatars',
    maxSizeBytes = 2 * 1024 * 1024, // 2MB
    timeout = 5000,
    generateSizes = [1024, 256],
  } = options;
  
  // Validate source URL
  if (!sourceUrl) {
    return {
      success: false,
      error: 'Source URL is required',
    };
  }
  
  // SSRF protection - block private IPs
  if (isPrivateIpUrl(sourceUrl)) {
    return {
      success: false,
      error: 'Source URL points to a private IP address (blocked for security)',
    };
  }
  
  try {
    // Fetch the image with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(sourceUrl, {
      signal: controller.signal,
      headers: {
        // Minimal headers to avoid tracking
        'User-Agent': 'Mozilla/5.0 (compatible; JovieBot/1.0; +https://jovie.com)',
        'Accept': 'image/*',
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch image: HTTP ${response.status}`,
      };
    }
    
    // Check content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      return {
        success: false,
        error: `Invalid content type: ${contentType}`,
      };
    }
    
    // Check file size
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > maxSizeBytes) {
      return {
        success: false,
        error: `Image too large: ${Math.round(parseInt(contentLength, 10) / 1024)}KB (max ${Math.round(maxSizeBytes / 1024)}KB)`,
      };
    }
    
    // Get the image data as blob
    const imageBlob = await response.blob();
    
    // Double-check size after download
    if (imageBlob.size > maxSizeBytes) {
      return {
        success: false,
        error: `Image too large: ${Math.round(imageBlob.size / 1024)}KB (max ${Math.round(maxSizeBytes / 1024)}KB)`,
      };
    }
    
    // Create a File object from the blob
    const file = new File([imageBlob], 'avatar.jpg', { type: imageBlob.type });
    
    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(file, userId, folder);
    
    if (!uploadResult.success) {
      return uploadResult;
    }
    
    // Generate URLs for different sizes
    const imageUrl = uploadResult.imageUrl;
    const publicId = uploadResult.publicId;
    
    // If we have a public ID and sizes to generate, create the thumbnail URL
    let thumbnailUrl: string | undefined;
    
    if (publicId && generateSizes.includes(256)) {
      // Use Cloudinary transformation URL
      thumbnailUrl = imageUrl?.replace('/upload/', '/upload/c_fill,g_face,h_256,w_256/');
    }
    
    return {
      success: true,
      imageUrl,
      thumbnailUrl,
      publicId,
    };
  } catch (error) {
    return {
      success: false,
      error: `Error processing remote image: ${error.message || 'Unknown error'}`,
    };
  }
}

/**
 * Uploads an image to Cloudinary
 * 
 * @param file Image file to upload
 * @param userId User ID for folder structure
 * @param folder Cloudinary folder
 * @returns Promise resolving to the upload result
 */
async function uploadToCloudinary(
  file: File,
  userId: string,
  folder: string
): Promise<RemoteImageProcessorResult> {
  try {
    // Get signed upload params from our API
    const signRes = await fetch('/api/images/sign-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: `${folder}/${userId}` }),
    });
    
    if (!signRes.ok) {
      return {
        success: false,
        error: `Failed to sign upload: HTTP ${signRes.status}`,
      };
    }
    
    const { cloudName, apiKey, timestamp, signature, upload_preset } =
      await signRes.json() as {
        cloudName: string;
        apiKey: string;
        timestamp: number;
        signature: string;
        upload_preset?: string;
      };
    
    // Create form data for upload
    const form = new FormData();
    form.append('file', file);
    form.append('api_key', apiKey);
    form.append('timestamp', String(timestamp));
    if (upload_preset) form.append('upload_preset', upload_preset);
    form.append('folder', `${folder}/${userId}`);
    form.append('signature', signature);
    
    // Add transformation parameters for square crop
    form.append('transformation', 'c_fill,g_face,h_1024,w_1024');
    
    // Upload to Cloudinary
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    const uploadRes = await fetch(uploadUrl, { method: 'POST', body: form });
    
    if (!uploadRes.ok) {
      return {
        success: false,
        error: `Upload failed: HTTP ${uploadRes.status}`,
      };
    }
    
    const uploadData = await uploadRes.json() as {
      public_id: string;
      secure_url: string;
    };
    
    return {
      success: true,
      imageUrl: uploadData.secure_url,
      publicId: uploadData.public_id,
    };
  } catch (error) {
    return {
      success: false,
      error: `Cloudinary upload error: ${error.message || 'Unknown error'}`,
    };
  }
}
