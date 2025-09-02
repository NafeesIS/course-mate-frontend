'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUserSignInDetails } from '@/store/userStore';
import {
  Banknote,
  CalendarIcon,
  Clock,
  CreditCard,
  FileText,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ISingleUserData, IUserSubscription } from '../../_types/types';
import useNcaEmailHistoryAdmin from '../_services/services';
// import FileHistory from './FileHistory'; // ⛔️ remove old usage
import FileHistory from './FileHistory';
import FileHistoryTable, {
  FileRow,
  FilterKey,
  SortDirection,
  SortKey,
} from './FileHistoryTable'; // ✅ new table
import { formatCurrency } from './OrdersTab';

type EnhancedSubscription = IUserSubscription & {
  subscriptionName: string;
  currency: string;
  finalAmountPaid: number;
};

const SubscriptionsTab = ({ userData }: { userData: ISingleUserData }) => {
  const subscriptions: EnhancedSubscription[] = (userData?.subscriptions || [])
    .sort(
      (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
    )
    .map((subscription) => {
      const matchingOrder = userData?.orders?.find(
        (order) => order.orderId === subscription.orderId
      );
      const subscriptionService = matchingOrder?.items?.find(
        (item) =>
          item.serviceType === 'subscription' || item?.customAttributes?.plan
      );
      const finalAmountPaid = matchingOrder
        ? matchingOrder?.value + matchingOrder?.gst
        : 0;
      const subscriptionCurrency = subscriptionService?.currency || 'INR';
      return {
        ...subscription,
        subscriptionName:
          subscriptionService?.serviceName || 'Unknown Subscription',
        currency: subscriptionCurrency,
        finalAmountPaid,
      };
    });
  const { userSignInDetails } = useUserSignInDetails();
  const userId = userSignInDetails?.data._id;

  // -------- Table/Query Shared State --------
  const [sortBy, setSortBy] = useState<SortKey>('sentDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterBy, setFilterBy] = useState<FilterKey>('sentDate');
  const [reset, setReset] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSubscription, setSelectedSubscription] =
    useState<EnhancedSubscription>(subscriptions[0]);
  useEffect(() => {
    const status = selectedSubscription?.status?.toLowerCase();

    if (!reset && status === 'active') {
      // Active → use today
      setSelectedDate(new Date());
      return;
    }

    if (!reset && status === 'expired') {
      // Expired → use startDate (fallback to today if invalid/missing)
      const s = selectedSubscription?.startDate;
      if (s) {
        const d = new Date(s);
        setSelectedDate(Number.isNaN(d.getTime()) ? new Date() : d);
      } else {
        setSelectedDate(new Date());
      }
      return;
    }

    // For any other status, leave selectedDate as-is
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubscription?.status, selectedSubscription?.startDate]);
  // Build query options for the API based on the same UI state
  const queryOptions = useMemo(() => {
    const opts: any = {
      userId,
      orderId: selectedSubscription.orderId,
      limit: 10,
      page: page,
    };

    // Set the correct sort field based on filterBy
    if (filterBy === 'dataDate') {
      opts.sortBy = 'processDate';
    } else {
      opts.sortBy = 'emailSentDate';
    }

    opts.sortOrder = sortDirection;

    // Add date filtering based on filterBy
    if (selectedDate) {
      const dateStart = new Date(
        Date.UTC(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        )
      );

      const dateStartIso = dateStart.toISOString();
      const dateEnd = new Date(
        Date.UTC(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        )
      );
      const dateEndIso = dateEnd.toISOString();
      if (filterBy === 'dataDate') {
        // Filter by processDate
        opts.processDate = dateStartIso;
        opts.processEndDate = dateEndIso;
      } else {
        // Filter by emailSentDate
        opts.emailSentDate = dateStartIso;
        opts.emailSentEndDate = dateEndIso;
      }
    }
    return opts;
  }, [
    userId,
    sortDirection,
    filterBy,
    selectedDate,
    selectedSubscription,
    page,
  ]);

  const { data: ncaEmailHistoryAdmin } = useNcaEmailHistoryAdmin(queryOptions);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filesData = ncaEmailHistoryAdmin?.data?.data || [];
  const meta = ncaEmailHistoryAdmin?.data?.meta;

  // Map API shape → FileHistoryTable rows
  const fileRows: FileRow[] = useMemo(
    () =>
      filesData.map((item: any) => ({
        planName: item?.planName ?? item?.planType ?? 'Unknown', // be resilient if API sends planType
        dataDate: item?.processDate, // processDate is the Data Date
        sentDate: item?.emailSentDate,
        fileLink: item?.blobUrl || item?.fileLink,
      })),
    [filesData]
  );

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <Card className='mx-auto mt-10 max-w-3xl'>
        <CardContent className='p-6 text-center'>
          <FileText className='mx-auto h-12 w-12 text-muted-foreground opacity-50' />
          <h3 className='mt-4 text-lg font-semibold'>No Subscriptions Found</h3>
          <p className='text-sm text-muted-foreground'>
            The user has no active or past subscriptions.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const calculateRemainingDays = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className='mx-auto space-y-6'>
      {/* Main Content */}
      <h2 className='flex items-center gap-2 text-lg font-bold md:text-xl'>
        <CalendarIcon className='h-5 w-5' /> Subscription History
      </h2>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
        {/* Subscription List */}
        <div className='duration-300 lg:col-span-4'>
          {/* Mobile/Tablet View - Dropdown */}
          <div className='block lg:hidden'>
            <Select
              value={selectedSubscription?._id}
              onValueChange={(value) => {
                const subscription = subscriptions.find(
                  (sub) => sub._id === value
                );
                if (subscription) setSelectedSubscription(subscription);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select a subscription' />
              </SelectTrigger>
              <SelectContent>
                {subscriptions.map((subscription) => (
                  <SelectItem key={subscription._id} value={subscription._id}>
                    <div className='flex w-72 items-center justify-between gap-2 text-xs sm:w-full sm:text-sm'>
                      <span>{subscription.subscriptionName}</span>
                      <Badge className={getStatusColor(subscription.status)}>
                        {subscription.status}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop View - Scrollable List */}
          <div className='hidden lg:block'>
            <div className='max-h-[500px] space-y-3 overflow-y-auto'>
              {subscriptions.map((subscription) => (
                <Card
                  key={subscription._id}
                  className={`cursor-pointer rounded-lg transition-all hover:shadow-md ${
                    selectedSubscription?._id === subscription._id
                      ? 'border-[3px] border-primary'
                      : ''
                  }`}
                  onClick={() => setSelectedSubscription(subscription)}
                >
                  <CardContent className='p-4'>
                    <div className='flex flex-col space-y-2'>
                      <div className='flex items-center justify-between gap-2'>
                        <h3 className='font-semibold capitalize'>
                          {subscription.subscriptionName}
                        </h3>
                        <Badge className={getStatusColor(subscription.status)}>
                          {subscription.status}
                        </Badge>
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        <p>Order ID: {subscription.orderId}</p>
                        <p>
                          {formatDate(subscription.startDate)} -{' '}
                          {formatDate(subscription.endDate)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Subscription Details */}
        <div className='lg:col-span-8'>
          {/* Subscription Summary */}
          <div className='mb-4 hidden gap-4 lg:grid lg:grid-cols-3'>
            <Card>
              <CardContent className='p-6'>
                <div className='itemscenter flex space-x-2'>
                  <CreditCard className='min-h-4 min-w-4 text-muted-foreground' />
                  <p className='text-sm font-medium capitalize'>
                    {selectedSubscription?.status} Plan
                  </p>
                </div>
                <h3 className='mt-2 text-lg font-bold capitalize'>
                  {selectedSubscription?.plan || 'N/A'}
                </h3>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center space-x-2'>
                  <Clock className='min-h-4 min-w-4 text-muted-foreground' />
                  <p className='text-sm font-medium'>
                    {selectedSubscription?.status?.toLowerCase() ===
                      'expired' ||
                    calculateRemainingDays(selectedSubscription?.endDate) < 0
                      ? 'Subscription Expired'
                      : 'Time Remaining'}
                  </p>
                </div>
                <h3 className='mt-2 text-lg font-bold'>
                  {selectedSubscription?.status?.toLowerCase() === 'expired' ||
                  calculateRemainingDays(selectedSubscription?.endDate) < 0
                    ? `${Math.abs(calculateRemainingDays(selectedSubscription?.endDate))} days ago`
                    : `${calculateRemainingDays(selectedSubscription?.endDate)} days`}
                </h3>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center space-x-2'>
                  <Banknote className='min-h-4 min-w-4 text-muted-foreground' />
                  <p className='text-sm font-medium'>Amount Paid</p>
                </div>
                <h3 className='mt-2 text-lg font-bold'>
                  {formatCurrency(
                    selectedSubscription?.finalAmountPaid || 0,
                    selectedSubscription?.currency
                  )}
                  <span className='text-[10px]'> (incl. gst)</span>
                </h3>
              </CardContent>
            </Card>
          </div>

          <Card className='w-full'>
            <CardHeader className='p-3 lg:px-6 lg:pb-0 lg:pt-4'>
              <CardTitle>Subscription Details</CardTitle>
            </CardHeader>
            <CardContent className='p-3 lg:p-6'>
              <div className='space-y-6'>
                <div className='grid gap-4 md:grid-cols-2'>
                  <div>
                    <h3 className='mb-2 font-semibold'>Plan Information</h3>
                    <div className='space-y-1 text-xs capitalize sm:text-sm'>
                      <p>
                        <span className='text-muted-foreground'>
                          Plan Type:
                        </span>{' '}
                        {selectedSubscription?.plan}
                      </p>
                      <p>
                        <span className='text-muted-foreground'>Amount:</span>{' '}
                        {formatCurrency(
                          selectedSubscription?.finalAmountPaid || 0,
                          selectedSubscription?.currency
                        )}{' '}
                        <span className='text-[10px]'> (incl. gst)</span>
                      </p>
                      <p>
                        <span className='text-muted-foreground'>Status:</span>{' '}
                        {selectedSubscription?.status}
                      </p>
                      <p className='lg:hidden'>
                        <span className='text-muted-foreground'>Order ID:</span>{' '}
                        {selectedSubscription?.orderId}
                      </p>
                      <p>
                        <span className='text-muted-foreground'>
                          Payment ID:
                        </span>{' '}
                        {selectedSubscription?.paymentId}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className='mb-2 font-semibold'>Duration</h3>
                    <div className='space-y-1 text-xs sm:text-sm'>
                      <p>
                        <span className='text-muted-foreground'>
                          Start Date:
                        </span>{' '}
                        {formatDate(selectedSubscription?.startDate)}
                      </p>
                      <p>
                        <span className='text-muted-foreground'>End Date:</span>{' '}
                        {formatDate(selectedSubscription?.endDate)}
                      </p>
                      <p>
                        <span className='text-muted-foreground'>
                          {selectedSubscription?.status?.toLowerCase() ===
                            'expired' ||
                          calculateRemainingDays(
                            selectedSubscription?.endDate
                          ) < 0
                            ? 'Subscription Expired: '
                            : 'Days Remaining: '}
                        </span>{' '}
                        {selectedSubscription?.status?.toLowerCase() ===
                          'expired' ||
                        calculateRemainingDays(selectedSubscription?.endDate) <
                          0
                          ? `${Math.abs(
                              calculateRemainingDays(
                                selectedSubscription?.endDate
                              )
                            )} days ago`
                          : `${calculateRemainingDays(selectedSubscription?.endDate)} days`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Show loading state */}
                {/* {isNcaEmailHistoryLoading && <LoadingWithSpinner />} */}

                {/* Show error state */}
                {/* {ncaEmailHistoryError && (
                  <div className='py-4 text-center text-red-600'>
                    <p>Error loading file history. Please try again.</p>
                  </div>
                )} */}

                {/* 🔄 New File History Table powered by API + shared state */}
                {selectedSubscription?.fileSentHistory ? (
                  <FileHistory
                    fileSentHistory={
                      selectedSubscription?.fileSentHistory || []
                    }
                  />
                ) : (
                  <FileHistoryTable
                    rows={fileRows}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    setReset={setReset}
                    sortDirection={sortDirection}
                    setSortDirection={setSortDirection}
                    filterBy={filterBy}
                    setFilterBy={setFilterBy}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    meta={meta}
                    setPage={setPage}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsTab;
