'use client';

import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { formatInTimeZone } from 'date-fns-tz';
import { motion } from 'framer-motion';
import { ReceiptText, RefreshCw, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { IoSearchSharp } from 'react-icons/io5';
import { OrderDateRangePicker } from '../../order-management/_components/OrderDateRangePicker';
import OrderDateSwitch from '../../order-management/_components/OrderDateSwitch';
import { formatCurrency } from '../../user-management/[...slug]/_components/OrdersTab';
import { getAllTransactionDetails } from '../_services/services';
import { ITransaction } from '../_types/types';
import TransactionStatCard from './TransactionStatCard';

const DirectorSales = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [resetDatePicker, setResetDatePicker] = useState(false);
  const newDate = formatInTimeZone(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd');
  const [singleDateFilter, setSingleDateFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState(newDate);
  const [endDateFilter, setEndDateFilter] = useState(newDate);
  const [showTodayOrders, setShowTodayOrders] = useState('today');
  const [datePickerUpdate, setDatePickerUpdate] = useState(false);

  const handleDateRangeChange = (startDate?: string, endDate?: string) => {
    if (startDate && endDate && startDate === endDate) {
      // Single date selection
      setSingleDateFilter(startDate);
      setStartDateFilter('');
      setEndDateFilter('');
      setShowTodayOrders('');
    } else if (startDate && endDate) {
      // Date range selection
      setSingleDateFilter('');
      setStartDateFilter(startDate);
      setEndDateFilter(endDate);
      setShowTodayOrders('');
    } else {
      // Reset all date filters
      setSingleDateFilter('');
      setStartDateFilter('');
      setEndDateFilter('');
      if (startDate === '' && endDate === '') {
        setShowTodayOrders('allTime');
      } else {
        setShowTodayOrders('');
      }
    }
    setPage(1);
  };

  const {
    data: transactionsData,
    isLoading,
    refetch,
    isFetching,
    // isError,
  } = useQuery({
    queryKey: [
      'transactions',
      page,
      limit,
      debouncedSearch,
      statusFilter,
      singleDateFilter,
      startDateFilter,
      endDateFilter,
      sortDirection,
    ],
    queryFn: () =>
      getAllTransactionDetails({
        page,
        limit,
        status: statusFilter,
        orderId: debouncedSearch,
        createdAt: singleDateFilter,
        startDate: startDateFilter,
        endDate: endDateFilter,
        paymentId: debouncedSearch,
        email: debouncedSearch,
        name: debouncedSearch,
        phone: debouncedSearch,
        sort: sortDirection || undefined,
      }),
    gcTime: 1000 * 60 * 10, // 10 minute
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch on component mount
  });

  const totalPages = transactionsData?.totalPages || 0;
  const totalTransactions = transactionsData?.totalTransactions || 0;
  const allStatus = transactionsData?.status;
  const totalPaidINR: number = allStatus?.paid?.totalInrAmount / 100;
  const totalPaidUSD: number = allStatus?.paid?.totalUsdAmount / 100;
  const totalCreatedINR: number = allStatus?.created?.totalInrAmount / 100;
  const totalCreatedUSD: number = allStatus?.created?.totalUsdAmount / 100;
  const transactions = transactionsData?.transactions || [];

  const handleSearch = () => {
    setPage(1);
    setDebouncedSearch(searchQuery.trim());
  };

  const handleTodayOrdersToggle = (value: string) => {
    setShowTodayOrders(value);

    if (value === 'today') {
      // Set to today's date
      setSingleDateFilter(newDate);
      setStartDateFilter('');
      setEndDateFilter('');
    } else if (value === 'allTime') {
      // Clear all date filters for all time
      setSingleDateFilter('');
      setStartDateFilter('');
      setEndDateFilter('');
    }

    setPage(1);
  };

  const handleSort = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };
  const handleReset = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setPage(1);
    setLimit(10);
    setStatusFilter('');
    setSingleDateFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
    setDateRange(undefined);
    setSortDirection('desc');
    setShowTodayOrders('allTime');
    setResetDatePicker(true);
    setDatePickerUpdate((prev) => !prev);
    setTimeout(() => setResetDatePicker(false), 0);
  };

  const limitOptions = [5, 10, 20, 50];
  const statusOptions = ['all', 'created', 'pending', 'paid', 'failed'];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <div className='mb-4 flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.5 }}
          className='flex items-center gap-2 py-3'
        >
          <div className='rounded-lg bg-blue-50 p-2'>
            <ReceiptText className='h-6 w-6 text-blue-600' />
          </div>
          <div>
            <h1 className='text-lg font-semibold text-gray-900 sm:text-2xl'>
              Director Sales
            </h1>
            <p className='mt-1 flex items-center gap-2 text-sm text-gray-500'>
              Total Sales: {totalTransactions || 0}
              <Button
                size='icon'
                variant='outline'
                className='h-7 hover:bg-primary hover:text-white'
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCw
                  className={cn(
                    'h-4 w-4 text-xs',
                    isFetching && 'animate-spin'
                  )}
                />
              </Button>
            </p>
          </div>
        </motion.div>
        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='flex w-full items-center justify-center sm:w-auto'
        >
          <OrderDateSwitch
            checked={showTodayOrders}
            onChange={handleTodayOrdersToggle}
            leftLabel='All Sales'
            rightLabel="Today's Sales"
            setResetDatePicker={setResetDatePicker}
            setDatePickerUpdate={setDatePickerUpdate}
          />
        </motion.div>
      </div>
      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mb-6 xl:grid-cols-3'
      >
        <TransactionStatCard
          onClick={() => {
            setStatusFilter('paid');
            setPage(1);
          }}
          title='Paid Sales'
          isSelected={statusFilter === 'paid'}
          orderNumber={isLoading || isFetching ? 0 : allStatus.paid.count}
          inrAmount={isLoading || isFetching ? 0 : totalPaidINR}
          usdAmount={isLoading || isFetching ? 0 : totalPaidUSD}
          status={statusFilter}
          isLoading={isLoading}
          isFetching={isFetching}
          colorClass='bg-green-50 text-green-600'
        />
        <TransactionStatCard
          onClick={() => {
            setStatusFilter('created');
            setPage(1);
          }}
          title='Created Sales'
          isSelected={statusFilter === 'created'}
          orderNumber={isLoading || isFetching ? 0 : allStatus.created.count}
          inrAmount={isLoading || isFetching ? 0 : totalCreatedINR}
          usdAmount={isLoading || isFetching ? 0 : totalCreatedUSD}
          status={statusFilter}
          isLoading={isLoading}
          isFetching={isFetching}
          colorClass='bg-yellow-50 text-yellow-600'
        />
        <div className='hidden xl:block'>
          <TransactionStatCard
            onClick={() => {
              setStatusFilter('failed');
              setPage(1);
            }}
            title='Failed Sales'
            isSelected={statusFilter === 'failed'}
            orderNumber={isLoading || isFetching ? 0 : 0}
            inrAmount={isLoading || isFetching ? 0 : 0}
            usdAmount={isLoading || isFetching ? 0 : 0}
            status={statusFilter}
            isLoading={isLoading}
            isFetching={isFetching}
            colorClass='bg-red-50 text-red-600'
          />
        </div>
      </motion.div>
      <Card className='px-2 py-3 md:p-5'>
        <div className='mb-4 flex w-full flex-col gap-4 md:mb-5 md:flex-row md:items-center md:justify-between'>
          <div className='flex w-full items-center gap-2'>
            <div className='relative w-full md:max-w-96'>
              <Input
                placeholder='Search Order/Payment ID, Email, Phone'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-l-md rounded-r-full ${searchQuery ? 'pr-16' : 'pr-10'}`}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <div className='absolute right-0 top-0 flex h-full items-center gap-1 bg-transparent pr-3'>
                {searchQuery && (
                  <button
                    className='bg-transparent text-gray-400 transition-colors hover:text-gray-600'
                    onClick={handleReset}
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  className={`translate-x-2 rounded-full p-1.5 ${searchQuery.trim() ? 'bg-primary text-white hover:bg-blue-600' : 'cursor-not-allowed bg-gray-200 text-gray-400'}`}
                  onClick={handleSearch}
                  disabled={!searchQuery.trim()}
                >
                  <IoSearchSharp size={16} />
                </button>
              </div>
            </div>
          </div>
          <div className='flex w-full flex-row gap-2 md:items-center md:justify-end md:gap-3'>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant='outline'
              size={'sm'}
              className='flex w-full items-center justify-center gap-2 duration-300 hover:bg-primary hover:text-white md:w-auto'
            >
              <SlidersHorizontal className='h-4 w-4' />
              Filters
            </Button>
            <Button
              onClick={handleReset}
              variant='secondary'
              size={'sm'}
              className='w-full text-gray-500 hover:text-gray-700 md:w-auto'
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        <div
          className={`overflow-hidden duration-300 ${showFilters ? 'h-[272px] sm:h-28' : 'h-0'}`}
        >
          <div className='mb-4 grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-3'>
            <div>
              <p className='mb-2 text-[13px] font-medium text-black'>
                Transactions Per Page
              </p>
              <Select
                value={limit.toString()}
                onValueChange={(value) => {
                  setLimit(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className='rounded-none'>
                  <SelectValue placeholder='Limit' />
                </SelectTrigger>
                <SelectContent>
                  {limitOptions.map((limitOption) => (
                    <SelectItem
                      key={limitOption}
                      value={limitOption.toString()}
                    >
                      {limitOption} per page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className='mb-2 text-[13px] font-medium text-black'>
                Transaction Status
              </p>
              <Select
                onValueChange={(value) => {
                  setStatusFilter(value === 'all' ? '' : value);
                  setPage(1);
                }}
                value={statusFilter}
              >
                <SelectTrigger
                  className={`rounded-none ${statusFilter !== '' ? 'border-blue-500 bg-blue-100' : ''}`}
                >
                  <SelectValue
                    className='text-muted-foreground'
                    placeholder='all'
                  />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className='mb-2 text-[13px] font-medium text-black'>
                Transaction Date Range
              </p>
              <OrderDateRangePicker
                datePickerUpdate={datePickerUpdate}
                value={dateRange}
                onChange={handleDateRangeChange}
                resetSignal={resetDatePicker}
                className={`rounded-none ${
                  singleDateFilter || (startDateFilter && endDateFilter)
                    ? 'border-blue-500 bg-blue-100'
                    : ''
                }`}
              />
            </div>
          </div>
        </div>

        <Table className='rounded-md border text-xs sm:text-sm'>
          <TableHeader>
            <TableRow className='divide-x whitespace-nowrap bg-muted'>
              {[
                '#',
                'Order Date',
                'Order ID',
                'DIN',
                'Status',
                'User Email',
                'User Phone',
                // 'User Name',
                'Payment ID',
                'Transaction Value',
              ].map((label) => (
                <TableHead
                  key={label}
                  className={`px-2 py-3 ${['Transaction Value', 'Total Price'].includes(label) ? 'text-center' : 'text-left'}`}
                >
                  {label === 'Order Date' ? (
                    <button
                      onClick={handleSort}
                      className='flex items-center gap-1 whitespace-nowrap'
                    >
                      {label} {sortDirection === 'asc' ? '↑' : '↓'}
                    </button>
                  ) : (
                    label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isFetching ? (
              <TableRow>
                <TableCell colSpan={9} className='h-[400px] text-center'>
                  <LoadingWithSpinner />
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className='p-4 text-center'>
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction: ITransaction, index: number) => (
                <TableRow key={transaction._id} className='divide-x'>
                  <TableCell className='p-3 text-start'>
                    {(page - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell className='whitespace-nowrap'>
                    <div className='flex flex-col gap-0.5'>
                      <span className='font-medium text-gray-900'>
                        {formatInTimeZone(
                          transaction.createdAt,
                          'Asia/Kolkata',
                          'MMM-dd-yyyy'
                        )}
                      </span>
                      <span className='text-[10px] text-muted-foreground'>
                        {formatInTimeZone(
                          transaction.createdAt,
                          'Asia/Kolkata',
                          'hh:mm aa'
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className='px-2 py-3'>
                    {transaction.orderId}
                  </TableCell>
                  <TableCell className='px-2 py-3'>
                    {transaction.serviceId}
                  </TableCell>
                  <TableCell className='px-2 py-3'>
                    {' '}
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        transaction.status === 'paid'
                          ? 'bg-green-50 text-green-600'
                          : transaction.status === 'created'
                            ? 'bg-yellow-50 text-yellow-600'
                            : transaction.status === 'UNKNOWN'
                              ? 'bg-purple-50 text-purple-600'
                              : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </TableCell>

                  <TableCell className='px-2 py-3'>
                    {transaction.email ? transaction.email : '-'}
                  </TableCell>
                  <TableCell className='px-2 py-3'>
                    {transaction.phone ? transaction.phone : '-'}
                  </TableCell>
                  {/* <TableCell className='px-2 py-3'>
                    {transaction.name ? transaction.name : '-'}
                  </TableCell> */}
                  <TableCell className='px-2 py-3'>
                    {transaction.paymentId ? transaction.paymentId : 'N/A'}
                  </TableCell>

                  <TableCell className='px-2 py-3 text-right'>
                    {formatCurrency(
                      transaction.amount / 100,
                      transaction.currency
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
      <Pagination className='mt-4'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href='#'
              onClick={(e) => {
                e.preventDefault();
                setPage(Math.max(page - 1, 1));
              }}
              className={`p-1 text-[10px] sm:p-2 sm:text-sm ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => {
            const pageNumber = i + 1;
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= page - 1 && pageNumber <= page + 1)
            ) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    className='h-auto w-auto px-1.5 py-1 text-[10px] sm:px-2.5 sm:py-1.5 sm:text-sm'
                    href='#'
                    isActive={page === pageNumber}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            }

            if (pageNumber === page - 2 || pageNumber === page + 2) {
              return (
                <PaginationItem key={`ellipsis-${pageNumber}`}>
                  <span className='pointer-events-none text-xs text-gray-500 sm:text-sm'>
                    ...
                  </span>
                </PaginationItem>
              );
            }

            return null;
          })}

          <PaginationItem>
            <PaginationNext
              href='#'
              onClick={(e) => {
                e.preventDefault();
                setPage(Math.min(page + 1, totalPages));
              }}
              className={`p-1 text-[10px] sm:p-2 sm:text-sm ${
                page === totalPages ? 'pointer-events-none opacity-50' : ''
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default DirectorSales;
