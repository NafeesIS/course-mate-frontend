'use client';

import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { LucideTicketCheck, RefreshCw } from 'lucide-react';
import { getAllCouponsDetails } from '../_services/services';
import AllCoupons from './AllCoupons';

const CouponList = () => {
  const {
    data: couponsList,
    refetch,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['couponsList'],
    queryFn: getAllCouponsDetails,
    gcTime: 1000 * 60 * 10, // 10 minute
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch on component mount
  });

  if (isLoading) {
    return <LoadingWithSpinner />;
  }

  if (error) {
    return (
      <div className='text-center text-sm text-red-500'>
        Failed to load coupons. Please try again later.
      </div>
    );
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      {/* Header Section */}
      <div className='mb-6 flex flex-row items-center justify-between gap-4'>
        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.5 }}
          className='flex items-center gap-3'
        >
          <div className='rounded-lg bg-blue-50 p-2'>
            <LucideTicketCheck className='h-6 w-6 text-blue-600' />
          </div>
          <div>
            <h1 className='text-lg font-semibold text-gray-900 sm:text-2xl'>
              Coupon List
            </h1>
            <p className='text-sm text-gray-500'>
              Total Coupons: {couponsList ? couponsList.length : ''}
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} transition={{ duration: 0.5 }}>
          <Button
            onClick={() => refetch()}
            disabled={isFetching}
            className='flex items-center gap-2 duration-300 hover:bg-primary hover:text-white'
            variant='outline'
          >
            <RefreshCw
              className={cn('h-4 w-4', isFetching && 'animate-spin')}
            />
            <span className='hidden sm:block'>
              {isFetching ? 'Refreshing...' : 'Refresh'}
            </span>
          </Button>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }} // Delayed to start after the heading animation
      >
        <AllCoupons data={couponsList} fetchCoupons={refetch} />
      </motion.div>
    </div>
  );
};

export default CouponList;
