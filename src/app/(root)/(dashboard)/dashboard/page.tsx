'use client';

import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { useUserSignInDetails } from '@/store/userStore';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import QuickActions from './_components/Home/QuickActions';
import RecentActivity from './_components/Home/RecentActivity';
import UsageStats from './_components/Home/UsageStats';
import { DashboardSuccessPopup } from './_components/Sidebar/DashboardSuccessPopup';
import { fetchUnlockedCompanies } from './_services/fetchUnlockedCompanies';
import { fetchUnlockedContacts } from './director-contacts/_services/services';

export default function DashboardHome() {
  const { userSignInDetails, userSignInDetailsLoading } =
    useUserSignInDetails();

  const userId = userSignInDetails?.data._id;

  const { data: unlockedContacts, isLoading: unlockedContactsLoading } =
    useQuery({
      queryKey: ['unlockedContacts', userId ?? '', 1, 10],
      queryFn: () =>
        fetchUnlockedContacts({ queryKey: ['', userId ?? '', 1, 10] }),
      enabled: !!userId,
      refetchOnWindowFocus: false,
      retry: 3,
    });

  const { data: unlockedCompanies, isLoading: unlockedCompaniesLoading } =
    useQuery({
      queryKey: ['unlockedCompanies', userId],
      queryFn: () => fetchUnlockedCompanies(userId!),
      enabled: !!userId,
      refetchOnWindowFocus: false,
      retry: 3,
    });

  if (
    userSignInDetailsLoading ||
    unlockedCompaniesLoading ||
    unlockedContactsLoading
  ) {
    return <LoadingWithSpinner className='h-[80vh]' />;
  }

  const firstName = userSignInDetails?.data.meta_data?.firstName || 'User';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='space-y-4 md:space-y-8'
    >
      <div className='rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white shadow-lg'>
        <h1 className='mb-2 text-xl font-semibold md:text-2xl'>
          Welcome back, {firstName}!
        </h1>
        <p className='text-sm text-blue-100 md:text-lg'>
          Get quick access to our services and stay updated with the latest
          information.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3'>
        <div className='col-span-1 md:col-span-2 lg:col-span-3'>
          <QuickActions credits={userSignInDetails?.data.bulk_unlock_credits} />
        </div>
        <div className='col-span-1 md:col-span-2 lg:col-span-2'>
          <RecentActivity
            unlockedContacts={unlockedContacts?.data.unlockedContacts}
            unlockedCompanies={unlockedCompanies}
          />
        </div>
        <div className='col-span-1 md:col-span-2 lg:col-span-1'>
          <UsageStats credits={userSignInDetails?.data.bulk_unlock_credits} />
        </div>
      </div>

      <DashboardSuccessPopup />
    </motion.div>
  );
}
