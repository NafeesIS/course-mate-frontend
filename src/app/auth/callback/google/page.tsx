"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

/**
 * Google OAuth Callback Page
 * Handles the callback from Google OAuth and redirects appropriately
 */

export default function GoogleCallback() {
  const router = useRouter();
  const sessionContext = useSessionContext();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing Google sign-in...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Wait for session context to load
        if (sessionContext.loading) {
          return;
        }

        // Small delay to ensure SuperTokens processes the callback
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (sessionContext.doesSessionExist) {
          setStatus('success');
          setMessage('Sign-in successful! Redirecting...');
          
          // Redirect to dashboard after successful authentication
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        } else {
          setStatus('error');
          setMessage('Google sign-in failed. Please try again.');
          
          // Redirect to auth page with error after delay
          setTimeout(() => {
            router.push("/auth?error=google_callback_failed");
          }, 3000);
        }
      } catch (error) {
        console.error("Google callback error:", error);
        setStatus('error');
        setMessage('An error occurred during sign-in. Please try again.');
        
        setTimeout(() => {
          router.push("/auth?error=google_callback_failed");
        }, 3000);
      }
    };

    handleCallback();
  }, [router, sessionContext]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
        <div className="text-center">
          {/* Loading/Status Icon */}
          <div className="mb-6">
            {status === 'loading' && (
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            )}
            {status === 'success' && (
              <div className="text-green-500 text-6xl">✅</div>
            )}
            {status === 'error' && (
              <div className="text-red-500 text-6xl">❌</div>
            )}
          </div>

          {/* Google Logo */}
          <div className="flex justify-center items-center space-x-2 mb-4">
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-xl font-semibold text-gray-700">Google Sign-In</span>
          </div>

          {/* Status Message */}
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {status === 'loading' && 'Completing Sign-In...'}
            {status === 'success' && 'Sign-In Successful!'}
            {status === 'error' && 'Sign-In Failed'}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>

          {/* Progress indicator for loading */}
          {status === 'loading' && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          )}

          {/* Action button for error state */}
          {status === 'error' && (
            <button
              onClick={() => router.push("/auth")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium w-full"
            >
              Try Again
            </button>
          )}

          {/* Success indicator */}
          {status === 'success' && (
            <div className="text-sm text-green-600">
              Redirecting to dashboard...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}