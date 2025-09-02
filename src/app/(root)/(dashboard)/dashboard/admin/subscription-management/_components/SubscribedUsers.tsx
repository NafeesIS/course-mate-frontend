'use client';

import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  Hourglass,
  PowerOff,
  RefreshCw,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { IUserServiceSubscription } from '../_types/types';
import { getSubscriberDetails } from '../_utils/getSubscriberDetails';
import { StatCard } from './StatCard';
import SubscriberTable from './SubscriberTable';

const SubscribedUsers: React.FC = () => {
  const {
    data: subscribers,
    refetch,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['subscribers'],
    queryFn: () => getSubscriberDetails('all'),
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch on component mount
  });
  // In SubscribedUsers.tsx
  const [tableFilters, setTableFilters] = useState({
    plan: '',
    product: '',
    options: '',
    status: '', // This will be updated when clicking a StatCard
    startDate: '',
    endDate: '',
    expirationDays: '',
    startRange: '',
    endRange: '',
  });
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const stats = useMemo(() => {
    let activeCount = 0;
    let inactiveCount = 0;
    let expiredCount = 0;
    let trialCount = 0;
    let graceCount = 0;

    subscribers?.data?.forEach((subscriber: IUserServiceSubscription) => {
      switch (subscriber.status) {
        case 'active':
          activeCount++;
          break;
        case 'inactive':
          inactiveCount++;
          break;
        case 'expired':
          expiredCount++;
          break;
        case 'trial':
          trialCount++;
          break;
        case 'grace':
          graceCount++;
          break;
        default:
          break;
      }
    });

    return { activeCount, inactiveCount, expiredCount, trialCount, graceCount };
  }, [subscribers?.data]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className='space-y-6'
      initial='hidden'
      animate='visible'
      variants={containerVariants}
    >
      {/* Header Section */}
      <div className='flex flex-row items-center justify-between gap-4'>
        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.5 }}
          className='flex items-center gap-3'
        >
          <div className='rounded-lg bg-blue-50 p-2'>
            <Users className='h-6 w-6 text-blue-600' />
          </div>
          <div>
            <h1 className='text-lg font-semibold text-gray-900 sm:text-2xl'>
              Subscription List
            </h1>
            <p className='text-sm text-gray-500'>
              Total Subscribers: {subscribers?.data?.length || 0}
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

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='grid grid-cols-2 gap-4 lg:grid-cols-5'
      >
        <StatCard
          title='Active Users'
          value={stats.activeCount}
          icon={Activity}
          colorClass='bg-green-50 text-green-600'
          isSelected={selectedStatus === 'active'}
          onClick={() => {
            setTableFilters((prev) => ({ ...prev, status: 'active' }));
            setSelectedStatus(selectedStatus === 'active' ? '' : 'active');
          }}
        />
        <StatCard
          title='Inactive Users'
          value={stats.inactiveCount}
          icon={PowerOff}
          colorClass='bg-yellow-50 text-yellow-600'
          isSelected={selectedStatus === 'inactive'}
          onClick={() => {
            setTableFilters((prev) => ({ ...prev, status: 'inactive' }));
            setSelectedStatus(selectedStatus === 'inactive' ? '' : 'inactive');
          }}
        />
        <StatCard
          title='Expired Users'
          value={stats.expiredCount}
          icon={AlertCircle}
          colorClass='bg-red-50 text-red-600'
          isSelected={selectedStatus === 'expired'}
          onClick={() => {
            setTableFilters((prev) => ({ ...prev, status: 'expired' }));
            setSelectedStatus(selectedStatus === 'expired' ? '' : 'expired');
          }}
        />
        <StatCard
          title='Trial Users'
          value={stats.trialCount}
          icon={AlertCircle}
          colorClass='bg-purple-50 text-purple-600'
          isSelected={selectedStatus === 'trial'}
          onClick={() => {
            setTableFilters((prev) => ({ ...prev, status: 'trial' }));
            setSelectedStatus(selectedStatus === 'trial' ? '' : 'trial');
          }}
        />
        <StatCard
          title='Grace Users'
          value={stats.graceCount}
          icon={Hourglass}
          colorClass='bg-red-50 text-red-600'
          isSelected={selectedStatus === 'grace'}
          onClick={() => {
            setTableFilters((prev) => ({ ...prev, status: 'grace' }));
            setSelectedStatus(selectedStatus === 'grace' ? '' : 'grace');
          }}
        />
      </motion.div>

      {/* Table Section */}
      <motion.div
        variants={itemVariants}
        transition={{ duration: 0.5, delay: 0.4 }}
        className='rounded-lg bg-white'
      >
        {isLoading ? (
          <div className='flex h-64 items-center justify-center'>
            <LoadingWithSpinner />
          </div>
        ) : (
          <SubscriberTable
            subscribers={subscribers?.data}
            filters={tableFilters}
            setFilters={setTableFilters}
            setSelectedStatus={setSelectedStatus}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default SubscribedUsers;
