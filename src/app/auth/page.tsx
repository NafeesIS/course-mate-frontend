// src/app/auth/page.tsx (Updated)
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { redirectToAuth } from 'supertokens-auth-react';
import { EmailPasswordPreBuiltUI } from 'supertokens-auth-react/recipe/emailpassword/prebuiltui';
import { EmailVerificationPreBuiltUI } from 'supertokens-auth-react/recipe/emailverification/prebuiltui';
import { ThirdPartyPreBuiltUI } from 'supertokens-auth-react/recipe/thirdparty/prebuiltui';
import SuperTokens from 'supertokens-auth-react/ui';

function AuthContent() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleRoute = async () => {
      try {
        // Check for error params
        const errorParam = searchParams.get('error');
        if (errorParam) {
          setError('Authentication failed. Please try again.');
        }

        if (
          SuperTokens.canHandleRoute([
            ThirdPartyPreBuiltUI,
            EmailPasswordPreBuiltUI,
            EmailVerificationPreBuiltUI,
          ]) === false
        ) {
          // If SuperTokens can't handle this route, redirect to signin
          redirectToAuth({ redirectBack: false, show: 'signin' });
        } else {
          setLoaded(true);
        }
      } catch (error) {
        console.error('Auth route handling error:', error);
        setError('Authentication initialization failed. Please refresh the page.');
      }
    };

    handleRoute();
  }, [searchParams]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center p-6 max-w-md">
          <div className="text-red-600 mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading authentication...</p>
        </div>
      </div>
    );
  }

  return SuperTokens.getRoutingComponent([
    ThirdPartyPreBuiltUI,
    EmailPasswordPreBuiltUI,
    EmailVerificationPreBuiltUI,
  ]);
}

export default function Auth() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}