// src/app/auth/callback/google/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SuperTokens from 'supertokens-auth-react';
import { ThirdPartyPreBuiltUI } from 'supertokens-auth-react/recipe/thirdparty/prebuiltui';

export default function GoogleCallback() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if SuperTokens can handle this route
        if (SuperTokens.canHandleRoute([ThirdPartyPreBuiltUI])) {
          // Let SuperTokens handle the callback
          const component = SuperTokens.getRoutingComponent([ThirdPartyPreBuiltUI]);
          if (component) {
            setIsProcessing(false);
            return;
          }
        }
        
        // If SuperTokens can't handle it, redirect to auth page
        router.push('/auth?error=callback_failed');
      } catch (error) {
        console.error('Callback handling error:', error);
        router.push('/auth?error=callback_failed');
      }
    };

    handleCallback();
  }, [router]);

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Processing authentication...</p>
          <p className="text-sm text-gray-600 mt-2">Please wait while we complete your login</p>
        </div>
      </div>
    );
  }

  // Let SuperTokens render the component
  return SuperTokens.getRoutingComponent([ThirdPartyPreBuiltUI]);
}