"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import SuperTokens from 'supertokens-auth-react/ui';
import { EmailPasswordPreBuiltUI } from 'supertokens-auth-react/recipe/emailpassword/prebuiltui';
import { ThirdPartyPreBuiltUI } from 'supertokens-auth-react/recipe/thirdparty/prebuiltui';

/**
 * Authentication Page Component
 * Handles login/signup with SuperTokens integration
 * Includes error handling and user feedback
 */

export default function Auth() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionContext = useSessionContext();

  // Get error from URL parameters
  const urlError = searchParams.get('error');

  useEffect(() => {
    // Handle URL errors
    if (urlError) {
      switch (urlError) {
        case 'google_callback_failed':
          setError('Google sign-in failed. Please try again.');
          break;
        case 'session_expired':
          setError('Your session has expired. Please sign in again.');
          break;
        case 'unauthorized':
          setError('Please sign in to access this page.');
          break;
        default:
          setError('An authentication error occurred. Please try again.');
      }
    }

    // Redirect if already authenticated
    if (!sessionContext.loading && sessionContext.doesSessionExist) {
      router.push('/dashboard');
      return;
    }

    setLoaded(true);
  }, [sessionContext, router, urlError]);

  // Show loading state
  if (!loaded || sessionContext.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if SuperTokens can handle the current route
  if (SuperTokens.canHandleRoute([EmailPasswordPreBuiltUI, ThirdPartyPreBuiltUI]) === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-6">Something went wrong with the authentication system.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with branding */}
      <div className="pt-12 pb-8 text-center">
        <div className="flex justify-center items-center space-x-3 mb-4">
          <div className="text-4xl">📚</div>
          <h1 className="text-3xl font-bold text-gray-900">Course Mate</h1>
        </div>
        <p className="text-gray-600 max-w-md mx-auto px-4">
          Your gateway to unlimited learning opportunities. Join thousands of students advancing their careers.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-md mx-auto mb-6 px-4">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="text-red-400 text-xl mr-3">❌</div>
              <div>
                <p className="text-red-800 font-medium">Authentication Error</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="mt-3 text-red-600 hover:text-red-800 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Auth Container */}
      <div className="flex justify-center px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white text-center">
            <h2 className="text-xl font-semibold mb-2">Welcome Back!</h2>
            <p className="text-blue-100 text-sm">Continue your learning journey</p>
          </div>

          {/* SuperTokens Auth Forms */}
          <div className="p-8">
            {SuperTokens.getRoutingComponent([EmailPasswordPreBuiltUI, ThirdPartyPreBuiltUI])}
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 px-8 py-6 border-t">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
              
              {/* Features highlight */}
              <div className="grid grid-cols-3 gap-4 text-center text-xs text-gray-500">
                <div>
                  <div className="text-blue-600 text-lg mb-1">🎓</div>
                  <p>Expert Courses</p>
                </div>
                <div>
                  <div className="text-green-600 text-lg mb-1">📈</div>
                  <p>Track Progress</p>
                </div>
                <div>
                  <div className="text-purple-600 text-lg mb-1">🏆</div>
                  <p>Certificates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pb-8">
        <p className="text-gray-500 text-sm mb-4">
          New to learning platforms? 
          <button 
            onClick={() => router.push('/about')}
            className="text-blue-600 hover:text-blue-800 ml-1 underline"
          >
            Learn more about us
          </button>
        </p>
      </div>

      {/* Custom styles for better SuperTokens integration */}
      <style jsx global>{`
        /* Override SuperTokens default styles for better integration */
        [data-supertokens~="container"] {
          box-shadow: none !important;
          background: transparent !important;
        }
        
        [data-supertokens~="row"] {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        
        [data-supertokens~="superTokensBranding"] {
          display: none !important;
        }
        
        /* Custom button hover effects */
        [data-supertokens~="button"]:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15) !important;
        }
        
        /* Better input focus states */
        [data-supertokens~="input"]:focus {
          border-color: rgb(59, 130, 246) !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        
        /* Improved error styling */
        [data-supertokens~="generalError"] {
          background: rgb(254, 242, 242) !important;
          border: 1px solid rgb(252, 165, 165) !important;
          border-radius: 8px !important;
          padding: 12px 16px !important;
          color: rgb(185, 28, 28) !important;
        }
        
        /* Success message styling */
        [data-supertokens~="generalSuccess"] {
          background: rgb(240, 253, 244) !important;
          border: 1px solid rgb(134, 239, 172) !important;
          border-radius: 8px !important;
          padding: 12px 16px !important;
          color: rgb(21, 128, 61) !important;
        }
      `}</style>
    </div>
  );
}