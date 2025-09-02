'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { redirectToAuth } from 'supertokens-auth-react';
import { EmailPasswordPreBuiltUI } from 'supertokens-auth-react/recipe/emailpassword/prebuiltui';
import { EmailVerificationPreBuiltUI } from 'supertokens-auth-react/recipe/emailverification/prebuiltui';
import { ThirdPartyPreBuiltUI } from 'supertokens-auth-react/recipe/thirdparty/prebuiltui';
import SuperTokens from 'supertokens-auth-react/ui';

const LoginForMore = () => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    redirectToAuth();
  };

  const onClose = () => {
    router.push('/');
  };

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (
      SuperTokens.canHandleRoute([
        ThirdPartyPreBuiltUI,
        EmailPasswordPreBuiltUI,
        EmailVerificationPreBuiltUI,
      ])
    ) {
      setLoaded(true);
    }
  }, []);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity'
      )}
    >
      <div className='flex items-center gap-5 rounded-lg bg-white shadow-lg'>
        <div className='p-8'>
          <h2 className='mb-4 text-center text-2xl font-bold text-blue-600'>
            Continue Exploring Without Limits
          </h2>
          <p className='mb-6 text-center text-sm text-gray-700 md:text-base'>
            Please log in to continue accessing our detailed company profiles.
            You&apos;ve reached the view limit for guests. Logging in ensures
            you can continue your exploration without any restrictions.
          </p>
          <div className='flex justify-center'>
            <Button
              onClick={handleLoginRedirect}
              variant='gooeyLeft'
              size='lg'
              className='text-sm font-semibold tracking-wide md:text-base'
            >
              Proceed to Login
            </Button>
          </div>
          <div className='mt-4 flex justify-center'>
            <Button onClick={onClose} variant='link' className=''>
              Return to Home
            </Button>
          </div>
        </div>

        <div className='w-1/2'>
          {loaded &&
            SuperTokens.getRoutingComponent([
              ThirdPartyPreBuiltUI,
              EmailPasswordPreBuiltUI,
              EmailVerificationPreBuiltUI,
            ])}
        </div>
      </div>
    </div>
  );
};

export default LoginForMore;
