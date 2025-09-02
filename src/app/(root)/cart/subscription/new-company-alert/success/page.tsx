'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BASE_URL_BACKEND, FILESURE_SUPPORT_EMAIL } from '@/constants';
import { cn } from '@/lib/utils';
import thanks from '../../../../../../../public/assets/success/thankyou.png';

export default function Component() {
  const params = useSearchParams();
  const subscriptionId = params?.get('subscription_id');

  const {
    data: subscriptionDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['subscriptionDetails', subscriptionId],
    queryFn: async () => {
      if (!subscriptionId) throw new Error('No subscription ID provided');
      const response = await axios.get(
        `${BASE_URL_BACKEND}/api/v1/subscribe/get-subscription-details/${subscriptionId}`
      );
      return response.data;
    },
    enabled: !!subscriptionId,
  });

  useEffect(() => {
    if (error) {
      toast.error('Failed to fetch subscription details. Please try again.');
    }
  }, [error]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd-MMM-yyyy');
  };

  return (
    <div className='wrapper my-10 h-full w-full'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-10 xl:gap-6'>
        <div className='hidden h-full w-full items-center justify-center rounded-md shadow-lg md:col-span-5 md:flex'>
          <Image src={thanks} alt='Thank You' />
        </div>
        <div className='mx-auto flex h-full w-full max-w-[500px] items-center justify-center rounded-md p-5 shadow-lg md:col-span-5 md:max-w-full'>
          <div>
            <h2 className='text-lg font-semibold text-primary lg:text-xl'>
              Thank You for Your Purchase!
            </h2>
            <p className='mt-2 text-xs font-medium md:text-sm xl:text-base'>
              We sincerely appreciate your purchase. Your order has been
              successfully placed, and a receipt has been sent to your email.
            </p>

            <div className='my-6 rounded-md border border-[#0076CE54] p-2 text-xs font-medium md:text-sm'>
              <p className='mb-3 text-[10px] font-semibold md:text-xs xl:text-sm'>
                Order Information
              </p>
              {isLoading ? (
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-full' />
                </div>
              ) : subscriptionDetails ? (
                <div className='flex flex-col gap-1.5'>
                  <div className='flex items-center justify-between gap-2'>
                    <p className='text-muted-foreground'>Purchased Plan:</p>
                    <p>{subscriptionDetails.data.serviceId.name}</p>
                  </div>
                  <div className='flex items-center justify-between gap-2'>
                    <p className='text-muted-foreground'>Recipient Email:</p>
                    <p>{subscriptionDetails.data.userId.emails[0]}</p>
                  </div>
                  <div className='flex items-center justify-between gap-2'>
                    <p className='text-muted-foreground'>Start Date:</p>
                    <p>{formatDate(subscriptionDetails.data.startDate)}</p>
                  </div>
                  <div className='flex items-center justify-between gap-2'>
                    <p className='text-muted-foreground'>End Date:</p>
                    <p>{formatDate(subscriptionDetails.data.endDate)}</p>
                  </div>
                </div>
              ) : (
                <p className='text-center text-sm text-muted-foreground'>
                  No subscription details available
                </p>
              )}
            </div>
            {/* <div className='flex items-center justify-between gap-1.5'>
              <p className='text-[10px] md:text-xs xl:text-sm'>
                If you need to update your email address for receiving director
                updates and company alerts, please contact our support team.
              </p>
              <a
                href='https://wa.me/918104946419'
                target='_blank'
                rel='noopener noreferrer'
              >
                <div className='relative z-0 overflow-hidden rounded-xl border border-primary bg-accent from-zinc-400 px-3 py-1.5 text-primary-foreground transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l after:transition-transform after:duration-1000 hover:after:translate-x-[0%] hover:after:translate-y-[0%]'>
                  <MdSupportAgent className='size-8 text-primary duration-200 group-hover:text-white xl:size-10' />
                </div>
              </a>
            </div> */}

            <div className='flex flex-col gap-1.5'>
              <p className='text-[10px] md:text-xs xl:text-sm'>
                If you need to update your email address for receiving director
                updates and company alerts, please contact our support team at{' '}
                <a
                  href={`mailto:${FILESURE_SUPPORT_EMAIL}`}
                  target='_blank'
                  className='text-primary underline'
                >
                  {FILESURE_SUPPORT_EMAIL}
                </a>
                .
              </p>
            </div>

            <Link
              href='/dashboard/new-company-alert'
              prefetch={false}
              className={cn(
                'mt-4 w-full',
                buttonVariants({ variant: 'gooeyLeft' })
              )}
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
