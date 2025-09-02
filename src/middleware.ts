import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { MAINTENANCE_MODE } from './constants';

// Define allowed paths that can be accessed during maintenance
const ALLOWED_PATHS = [
  '/api/', // Allow API routes
  '/_next/', // Allow Next.js assets
  '/favicon.ico',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if site is in maintenance mode
  const isMaintenanceMode = MAINTENANCE_MODE;

  // Check if current path should be allowed during maintenance
  const isAllowedPath = ALLOWED_PATHS.some((path) => pathname.startsWith(path));

  // If in maintenance mode and not an allowed path, return a 503 Service Unavailable response
  if (
    isMaintenanceMode &&
    !isAllowedPath &&
    !pathname.startsWith('/maintenance')
  ) {
    const response = NextResponse.rewrite(new URL('/maintenance', request.url));

    // Add security headers
    addSecurityHeaders(response);

    // Set proper status code for maintenance
    response.headers.set('Content-Type', 'text/html; charset=UTF-8');
    response.headers.set('X-Robots-Tag', 'noindex');

    // Add Retry-After header (tells search engines when to come back)
    // Set this to a reasonable time when you expect maintenance to be complete (in seconds)
    response.headers.set('Retry-After', '3600'); // Example: 1 hour

    // Override the status to 503 Service Unavailable
    return new Response(response.body, {
      status: 503,
      headers: response.headers,
    });
  }

  // For normal operation, continue with security headers
  const response = NextResponse.next();

  // Add security headers
  addSecurityHeaders(response);

  return response;
}

// Helper function to add security headers
function addSecurityHeaders(response: NextResponse) {
  // Prevents the page from being embedded in iframes, protecting against clickjacking attacks
  response.headers.set('X-Frame-Options', 'DENY');

  // Additional protection against iframe embedding through CSP
  // Only allows the page to be embedded by nobody (not even itself)
  response.headers.set('Content-Security-Policy', "frame-ancestors 'none'");

  // Prevents browsers from MIME-sniffing a response away from the declared content-type
  // Reduces exposure to drive-by download attacks
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Controls how much referrer information should be included with requests
  // Helps protect user privacy while still providing origin information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
}

// Configuration for the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
