/**
 * Error Route Handler
 * This route handles error responses and provides appropriate responses based on the request type.
 * It supports both API (JSON) and browser (redirect) error responses.
 */

import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET handler for error responses
 * Processes error requests and returns appropriate response format based on the request type:
 * - For API requests: Returns JSON response with error message and status
 * - For browser requests: Redirects to the error page with error details
 *
 * @param req - The incoming request object
 * @returns NextResponse with either JSON error or redirect to error page
 */
export async function GET(req: NextRequest) {
  // Extract error details from URL parameters
  const searchParams = req.nextUrl.searchParams;
  const message = searchParams.get('message') || 'An error occurred';
  const status = searchParams.get('status') || '500';
  const redirectTo = searchParams.get('redirectTo');

  // Check if the request is from an API call by examining the Accept header
  const headersList = headers();
  const accept = headersList.get('accept') || '';

  // Handle API requests with JSON response
  if (accept.includes('application/json')) {
    return NextResponse.json({ message }, { status: parseInt(status) });
  }

  // Handle browser requests by redirecting to the error page
  const errorUrl = new URL('/error', req.nextUrl.origin);
  errorUrl.searchParams.set('message', message);
  errorUrl.searchParams.set('status', status);

  // Add redirect path if provided (for post-error navigation)
  if (redirectTo) {
    errorUrl.searchParams.set('redirectTo', redirectTo);
  }

  return NextResponse.redirect(errorUrl);
}
