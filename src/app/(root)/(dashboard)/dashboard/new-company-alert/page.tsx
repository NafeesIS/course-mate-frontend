'use client';

import BannerNewCompanyAlert2 from '@/components/custom-ad-banners/BannerNewCompanyAlert2';
import { Button } from '@/components/ui/button';
import { useUserSignInDetails } from '@/store/userStore';
import { Bell, Loader2, RefreshCw } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import CTAComponents from './_components/CTAComponents';
import FileHistoryTable from './_components/FileHistoryTable';
import SubscriptionDetails from './_components/SubscriptionDetails';
import TodaysFiles from './_components/TodaysFiles';
import TodaysMetrics from './_components/TodaysMetrics';
import useNcaEmailHistory from './_hooks/useNcaEmailHistory';
import useSubscriptionDetails from './_hooks/useSubscriptionDetails';

export default function NCADashboardPage() {
  const {
    userSignInDetails,
    // userSignInDetailsLoading,
    // setUserSignInDetailsError,
  } = useUserSignInDetails();

  const userId = userSignInDetails?.data._id ?? '';
  const userEmail = userSignInDetails?.data.emails[0] ?? '';
  const subscriptions = userSignInDetails?.data.subscriptions ?? [];

  // Query: Subscription Details
  const {
    data: subscriptionDetails,
    // isPending: isSubscriptionLoading,
    isFetching: isSubscriptionLoading,
    error: subscriptionError,
    refetch: refetchSubscriptionDetails,
  } = useSubscriptionDetails(subscriptions);

  // Use useNcaEmailHistory for today's data
  const todayUTC = new Date();
  todayUTC.setUTCHours(0, 0, 0, 0);
  const todayISO = todayUTC.toISOString();

  const {
    data: ncaEmailHistory,
    // isPending: isNcaEmailHistoryLoading,
    isFetching: isNcaEmailHistoryLoading,
    error: ncaEmailHistoryError,
    refetch: refetchNcaEmailHistory,
  } = useNcaEmailHistory({
    userId,
    emailSentDate: todayISO,
    limit: 100, // in case there are many files today
  });

  // Remove aggregation logic, just get the raw filesData
  const filesData = ncaEmailHistory?.data?.data || [];
  const hasActiveSubscriptions =
    subscriptionDetails &&
    subscriptionDetails?.data.filter((item) => {
      return item.status === 'active';
    }).length > 0;

  return (
    <div className='text-pretty'>
      <div className='mx-auto max-w-7xl'>
        {/* Header Section */}
        <div className='flex flex-row items-center justify-between gap-4'>
          <div className='space-y-1'>
            <div className='flex items-center gap-3'>
              <div className='flex size-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600'>
                <Bell className='size-5 text-white' />
              </div>

              <h1 className='text-base font-bold text-gray-900 xl:text-xl'>
                New Company Alert
              </h1>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <div className='group relative'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  const message = encodeURIComponent(
                    'Hi! I would like to join the FileSure New Company Alerts WhatsApp community to receive timely updates and critical notifications about new company registrations.'
                  );
                  window.open(
                    `https://chat.whatsapp.com/HX1N0HxvhQ90vR13R4yay3?mode=ac_t?text=${message}`,
                    '_blank'
                  );
                }}
                className='relative h-9 gap-2 overflow-hidden border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 text-xs font-medium text-emerald-700 transition-all duration-300 hover:border-emerald-300 hover:from-emerald-100 hover:to-green-100 hover:shadow-md hover:shadow-emerald-100/50'
              >
                <div className='flex items-center gap-2'>
                  <div className='relative'>
                    <FaWhatsapp className='size-3.5 transition-transform duration-300 group-hover:scale-110' />
                    <div className='absolute -right-0.5 -top-0.5 size-2 animate-pulse rounded-full bg-emerald-500 opacity-75'></div>
                  </div>
                  <span className='hidden font-semibold sm:inline'>
                    Join Our Community
                  </span>
                  <span className='font-semibold sm:hidden'>Join</span>
                </div>

                {/* Subtle shine effect on hover */}
                <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full'></div>
              </Button>

              {/* Tooltip */}
              <div className='absolute left-1/2 top-[140%] z-50 mb-2 hidden w-80 -translate-x-1/2 transform opacity-0 transition-all duration-300 group-hover:block group-hover:opacity-100 md:w-96'>
                <div className='rounded-lg border border-emerald-200 bg-white p-4 shadow-lg ring-1 ring-black/5'>
                  {/* Tooltip arrow */}
                  <div className='absolute -top-2 left-1/2 right-4 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-gray-200 bg-white'></div>

                  <div className='space-y-3'>
                    <div className='flex items-center gap-2'>
                      <div className='flex size-6 items-center justify-center rounded-lg bg-emerald-100'>
                        <FaWhatsapp className='size-3 text-emerald-600' />
                      </div>
                      <h4 className='text-sm font-semibold text-gray-900'>
                        FileSure New Company Alerts
                      </h4>
                    </div>

                    <div className='space-y-2'>
                      <p className='text-xs leading-relaxed text-gray-600'>
                        Join our <strong>exclusive WhatsApp community</strong>{' '}
                        for sharing important updates, notifications, and
                        service-related messages about our &ldquo;New Company
                        Alert&rdquo; services.
                      </p>

                      <p className='text-xs leading-relaxed text-gray-600'>
                        Stay connected to receive{' '}
                        <strong>timely information</strong> and ensure you
                        don&apos;t miss any critical updates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                refetchSubscriptionDetails();
                refetchNcaEmailHistory();
              }}
              disabled={isNcaEmailHistoryLoading || isSubscriptionLoading}
              className='h-9 gap-1.5 text-xs'
            >
              {isNcaEmailHistoryLoading || isSubscriptionLoading ? (
                <Loader2 className='size-3 animate-spin' />
              ) : (
                <RefreshCw className='size-3' />
              )}
              <span className='hidden sm:inline'>Refresh</span>
            </Button>
          </div>
        </div>

        {!hasActiveSubscriptions && <BannerNewCompanyAlert2 className='mt-6' />}

        {/* Main Dashboard Grid */}
        <div className='mt-6 grid grid-cols-1 items-start gap-3 xl:grid-cols-3'>
          <div className='col-span-1 space-y-3 xl:col-span-2'>
            {/* Today's Metrics - Takes full width on mobile, 2 columns on large screens */}
            <TodaysMetrics
              filesData={filesData}
              isLoading={isNcaEmailHistoryLoading}
              error={ncaEmailHistoryError}
              todayISO={todayISO}
              hasActiveSubscriptions={!!hasActiveSubscriptions}
            />

            {/* Today's Files */}
            <TodaysFiles
              filesData={filesData}
              isLoading={isNcaEmailHistoryLoading}
              error={ncaEmailHistoryError}
              userEmail={userEmail}
              hasActiveSubscriptions={!!hasActiveSubscriptions}
            />

            {/* File History Table */}
            <FileHistoryTable
              userId={userId}
              hasActiveSubscriptions={!!hasActiveSubscriptions}
            />
          </div>

          <div className='flex flex-col-reverse gap-3 xl:flex-col'>
            {/* CTAs */}
            <CTAComponents />

            {/* Subscription Details */}
            <SubscriptionDetails
              subscriptions={subscriptionDetails?.data}
              isLoading={isSubscriptionLoading}
              error={subscriptionError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
