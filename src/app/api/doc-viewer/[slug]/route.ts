/**
 * Document Viewer API Route
 * This route handles secure document viewing with authentication and authorization checks.
 * It verifies user permissions and company access before serving PDF documents.
 */

import {
  getAccessToken,
  getSSRSessionHelper,
} from '@/app/(root)/(auth)/_utils/SSRHelperFunctions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Decrypts an encoded URL using XOR encryption with a secret key
 * @param encodedUrl - The URL-safe base64 encoded string to decrypt
 * @param secretKey - The secret key used for decryption
 * @returns The decrypted original URL
 * @throws Error if decryption fails or parameters are invalid
 */
function decodeWithKey(encodedUrl: string, secretKey: string) {
  if (!encodedUrl || !secretKey) {
    throw new Error('Encoded URL and secret key must be provided');
  }

  // Convert URL-safe base64 back to standard base64
  let standardBase64 = encodedUrl
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .replace(/\./g, '=');

  // Ensure correct base64 padding
  while (standardBase64.length % 4 !== 0) {
    standardBase64 += '=';
  }

  try {
    // Decode base64 to bytes
    const decodedBytes = new Uint8Array(
      atob(standardBase64)
        .split('')
        .map((char) => char.charCodeAt(0))
    );

    // Generate keyBytes by repeating the secret key to match decoded length
    const keyChars = new TextEncoder().encode(secretKey);
    const keyBytes: number[] = [];
    for (let i = 0; i < decodedBytes.length; i++) {
      keyBytes.push(keyChars[i % keyChars.length]);
    }

    // XOR operation to retrieve original bytes
    const originalBytes = new Uint8Array(decodedBytes.length);
    for (let i = 0; i < decodedBytes.length; i++) {
      originalBytes[i] = decodedBytes[i] ^ keyBytes[i];
    }

    return new TextDecoder().decode(originalBytes);
  } catch (error) {
    throw new Error(
      'Failed to decode. The encoded URL might be corrupted or the wrong secret key was provided.'
    );
  }
}

// Type definitions for API responses
interface UserInfo {
  _id: string;
  success: boolean;
  data: any;
}

interface UnlockedCompany {
  companyId: string;
}

// Environment-based configuration
const isProduction = process.env.NEXT_PUBLIC_SITEMAP_ENV === 'production';

// Base URLs for different environments
const frontendBaseUrl = isProduction
  ? 'https://www.filesure.in'
  : 'http://localhost:3000';
const API_BASE_URL = isProduction
  ? 'https://production.filesure.in'
  : 'http://localhost:4000';

// API endpoints for user information and company access
const USER_INFO_API_URL = `${API_BASE_URL}/api/v1/users/user-info`;
const UNLOCKED_COMPANIES_API_URL = `${API_BASE_URL}/api/v1/unlock-company/user-unlocked-companies`;

/**
 * Creates a standardized error response that redirects to the error page
 * @param message - Error message to display
 * @param status - HTTP status code
 * @returns NextResponse with redirect to error page
 */
const createErrorResponse = (message: string, status: number) => {
  const errorUrl = new URL('/api/error', frontendBaseUrl);
  errorUrl.searchParams.set('message', message);
  errorUrl.searchParams.set('status', status.toString());
  return NextResponse.redirect(errorUrl);
};

/**
 * Fetches user information from the API
 * @param accessToken - User's authentication token
 * @returns User information or null if request fails
 */
const getUserInfo = async (accessToken: string): Promise<UserInfo | null> => {
  try {
    const response = await fetch(USER_INFO_API_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Failed to fetch user details:', error);
    return null;
  }
};

/**
 * Fetches list of companies the user has access to
 * @param userId - User's unique identifier
 * @param accessToken - User's authentication token
 * @returns List of unlocked companies or empty array if request fails
 */
const getUnlockedCompanies = async (userId: string, accessToken: string) => {
  try {
    const response = await fetch(UNLOCKED_COMPANIES_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _userId: userId }),
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch unlocked companies:', error);
    return { data: [] };
  }
};

/**
 * Main API route handler for document viewing
 * Implements a secure document viewing flow with:
 * 1. URL parameter validation
 * 2. Authentication check
 * 3. User info verification
 * 4. Permission validation
 * 5. Document fetching and serving
 *
 * @param req - Next.js request object
 * @param params - Route parameters containing the document slug
 * @returns NextResponse with the document or an error response
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const key = req.nextUrl.searchParams.get('key');

  // Step 1: Validate required URL parameters
  if (!key) {
    return createErrorResponse(
      'Document access key is missing. Please ensure you have the correct URL.',
      400
    );
  }

  // Step 2: Decode and validate the document URL
  let decodedUrl: string;
  const secretKey = process.env.NEXT_PUBLIC_DOC_VIEWER_SECRET_KEY;
  if (!secretKey) {
    return createErrorResponse(
      'Document access secretKey is missing. Please ensure you have the correct secret.',
      400
    );
  }
  try {
    decodedUrl = decodeWithKey(key, secretKey);
  } catch {
    return createErrorResponse(
      'Invalid document access key. The URL appears to be corrupted or malformed.',
      400
    );
  }

  // Step 3: Verify user authentication
  const { accessTokenPayload, hasToken, error } = await getSSRSessionHelper();
  if (!accessTokenPayload || !hasToken || error) {
    const redirectPath = encodeURIComponent(
      `/api/doc-viewer/${slug}?key=${key}`
    );
    return NextResponse.redirect(
      new URL(`/auth?redirectToPath=${redirectPath}`, req.nextUrl.origin)
    );
  }

  // Step 4: Get and validate access token
  const accessToken = getAccessToken();
  if (!accessToken) {
    return createErrorResponse(
      'Your session has expired. Please log in again to access this document.',
      401
    );
  }

  // Step 5: Fetch and validate user information
  const userInfo = await getUserInfo(accessToken);
  if (!userInfo?._id) {
    return createErrorResponse(
      'Unable to verify your account. Please try logging in again or contact support if the issue persists.',
      401
    );
  }

  // Step 6: Check user permissions and company access
  const roles = accessTokenPayload?.['st-role']?.v || [];
  const isAdmin = roles.includes('admin');
  const unlockedCompanies = await getUnlockedCompanies(
    userInfo._id,
    accessToken
  );
  const unlockedCompanyIds =
    unlockedCompanies?.data?.map((item: UnlockedCompany) => item.companyId) ||
    [];

  // Verify if user has access to the requested document
  const hasAccess =
    isAdmin ||
    unlockedCompanyIds.some((companyId: string) =>
      decodedUrl.includes(companyId)
    );

  if (!hasAccess) {
    return createErrorResponse(
      "You do not have permission to access this document. Please ensure you have purchased access to this company's documents.",
      403
    );
  }

  // Step 7: Fetch and serve the document
  try {
    // Fetch the document from the source URL
    const response = await fetch(decodedUrl);
    if (!response.ok) {
      if (response.status === 404) {
        return createErrorResponse(
          'The requested document could not be found. It may have been removed or is no longer available.',
          404
        );
      }
      return createErrorResponse(
        `Unable to retrieve the document (${response.statusText}). Please try again later or contact support if the issue persists.`,
        response.status
      );
    }

    // Stream the document directly to the client
    // response.body is a ReadableStream that allows progressive loading
    // This prevents loading the entire PDF into memory
    return new NextResponse(response.body, {
      headers: {
        // Set PDF content type for proper browser handling
        'Content-Type': 'application/pdf',
        // Display PDF inline in the browser
        'Content-Disposition': 'inline',
        // Cache the document for 1 hour, allow stale for 24 hours
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        // Generate unique ETag for caching using content length and key
        ETag: `"${response.headers.get('content-length')}-${Buffer.from(key).toString('hex').slice(0, 8)}"`,
        // Handle different encodings
        Vary: 'Accept-Encoding',
        // Security headers to prevent MIME type sniffing
        'X-Content-Type-Options': 'nosniff',
        // Restrict resource loading to same origin
        'Content-Security-Policy': "default-src 'self'",
        // Prevent embedding in iframes
        'X-Frame-Options': 'SAMEORIGIN',
      },
    });
  } catch (error) {
    // Handle any streaming or fetch errors
    return createErrorResponse(
      'We encountered an error while loading the document. Please try again in a few moments or contact support if the issue persists.',
      500
    );
  }
}
