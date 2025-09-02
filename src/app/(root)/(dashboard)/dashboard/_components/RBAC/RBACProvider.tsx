'use client';

import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import SignOutBtn from '@/components/shared/Header/SignOutBtn';
import { Button } from '@/components/ui/button';
import { useUserSignInDetails } from '@/store/userStore';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';

const RBACProvider = ({ children }: { children: ReactNode }) => {
  // session info from supertokens
  const session = useSessionContext();
  // user details from database
  const {
    userSignInDetails,
    userSignInDetailsLoading,
    userSignInDetailsError,
  } = useUserSignInDetails();
  // router
  const router = useRouter();
  const pathname = usePathname();

  // if session or user details is loading, show loading spinner
  if (
    session.loading ||
    userSignInDetailsLoading ||
    session.doesSessionExist === false ||
    !userSignInDetails
  ) {
    return <LoadingWithSpinner className='h-screen' />;

    // if user details error, show unauthorized view
  } else if (userSignInDetailsError) {
    return (
      <UnauthorizedView
        message='An error occurred while fetching your details. Please sign out and try again.'
        action={<SignOutBtn />}
      />
    );
  }

  const isAdmin = userSignInDetails.data.roles.includes('admin');
  const isUser = userSignInDetails.data.roles.includes('user');
  const isAdminRoute = pathname?.startsWith('/dashboard/admin');

  // Block regular users from accessing admin routes
  if (!isAdmin && isUser && isAdminRoute) {
    return (
      <UnauthorizedView
        message='You do not have access to this page.'
        action={
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        }
      />
    );
  }

  // Allow access for valid role combinations
  return <>{children}</>;
};

const UnauthorizedView = ({
  message,
  action,
}: {
  message: string;
  action?: ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className='flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900'
  >
    <div className='rounded-lg bg-white p-8 text-center shadow-md dark:bg-gray-800'>
      <h1 className='mb-4 text-2xl font-bold text-gray-800 dark:text-gray-200'>
        Unauthorized Access
      </h1>
      <p className='mb-6 text-gray-600 dark:text-gray-400'>{message}</p>
      {action}
    </div>
  </motion.div>
);

export default RBACProvider;
