'use client';

import { Button } from '@/components/ui/button';
import { usePageVisitTracker } from '@/hooks/usePageVisitTracker';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaHome } from 'react-icons/fa';
import { redirectToAuth } from 'supertokens-auth-react';
import { EmailPasswordPreBuiltUI } from 'supertokens-auth-react/recipe/emailpassword/prebuiltui';
import { EmailVerificationPreBuiltUI } from 'supertokens-auth-react/recipe/emailverification/prebuiltui';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import { ThirdPartyPreBuiltUI } from 'supertokens-auth-react/recipe/thirdparty/prebuiltui';
import { AuthPage } from 'supertokens-auth-react/ui';
import loginImg from '../../../../../public/assets/auth/login-cr.png';
import { ISessionObject } from '../../_utils/types';

const AuthPopupCompanyPage = ({ pathname }: { pathname: string }) => {
  const { tooManyRequests } = usePageVisitTracker(
    pathname, // path user is currently on
    '/company/', // path we want to track
    'c_pg_vw_cnt', // local storage key
    5, // number of requests allowed without login
    3 * 24 * 60 * 60 * 1000 // expiration time 3 days
  );

  const session: ISessionObject = useSessionContext();
  const [showAuthContent, setShowAuthContent] = useState(false);

  useEffect(() => {
    if (
      pathname.includes('/company/') &&
      !session.loading &&
      tooManyRequests &&
      !session.doesSessionExist
    ) {
      setShowAuthContent(true);
    } else {
      setShowAuthContent(false);
    }
  }, [pathname, tooManyRequests, session]);

  if (session.loading || !showAuthContent) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 backdrop-blur-sm'>
      <div className='w-full overflow-hidden rounded-t-lg bg-background shadow-lg'>
        <div className='wrapper flex flex-col md:flex-row'>
          <div className='flex-col-center p-6 text-center md:w-1/2'>
            <Image
              src={loginImg}
              alt='Access Illustration'
              width={200}
              height={200}
              className='h-40 w-40 rounded-lg md:h-48 md:w-48'
            />
            <h2 className='mt-4 text-xl font-bold text-primary md:text-2xl'>
              Unlock Full Access
            </h2>
            <p className='mt-2 text-base md:text-lg'>
              You&apos;ve reached the view limit for guests. Log in to continue
              exploring our detailed company profiles without restrictions.
            </p>
            <div className='mt-4 flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
              <Link href='/' passHref>
                <Button variant='outline' className='w-full sm:w-auto'>
                  <FaHome className='mr-2 h-4 w-4' />
                  Return Home
                </Button>
              </Link>

              <Button
                variant='default'
                className='block w-full md:hidden'
                onClick={() => redirectToAuth({ redirectBack: true })}
              >
                Proceed to Login
              </Button>
            </div>
          </div>
          <div className='hidden w-full md:block md:w-1/2'>
            <AuthPage
              preBuiltUIList={[
                ThirdPartyPreBuiltUI,
                EmailPasswordPreBuiltUI,
                EmailVerificationPreBuiltUI,
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPopupCompanyPage;
