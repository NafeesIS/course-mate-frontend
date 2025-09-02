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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Calendar,
  CalendarCheck,
  CalendarX,
  LucideClipboardList,
  RefreshCw,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { IoSearchSharp } from 'react-icons/io5';
import { DateRangePicker } from '../../campaign-overview/_components/DateRangePicker';
import { getDashboardCampaignTracker } from '../_services/services';

const CampaignStatusTables = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [limit, setLimit] = useState(10);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [incorporationStartDate, setIncorporationStartDate] = useState('');
  const [incorporationEndDate, setIncorporationEndDate] = useState('');
  const [scheduledStartDate, setScheduledStartDate] = useState('');
  const [scheduledEndDate, setScheduledEndDate] = useState('');
  const [sentStartDate, setSentStartDate] = useState('');
  const [sentEndDate, setSentEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [resetDatePicker, setResetDatePicker] = useState(false);
  const [page, setPage] = useState(1);
  const [statusCategory, setStatusCategory] = useState<
    'upcoming' | 'sent' | 'overdue'
  >('upcoming');
  const [sortField, setSortField] = useState<
    'dateOfIncorporation' | 'scheduledDate' | 'sentDate'
  >('dateOfIncorporation');
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: [
      'campaigns',
      page,
      limit,
      debouncedSearch,
      statusCategory,
      sortDirection,
      sortField,
      incorporationStartDate,
      incorporationEndDate,
      scheduledStartDate,
      scheduledEndDate,
      sentStartDate,
      sentEndDate,
    ],
    queryFn: () =>
      getDashboardCampaignTracker({
        page,
        limit,
        companyName: debouncedSearch,
        directorName: debouncedSearch,
        directorEmail: debouncedSearch,
        companyCIN: debouncedSearch,
        directorDIN: debouncedSearch,
        statusCategory,
        sortOrder: sortDirection,
        sortField,
        incorporationStartDate,
        incorporationEndDate,
        scheduledStartDate,
        scheduledEndDate,
        sentStartDate,
        sentEndDate,
      }),
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const handleIncorporationDateRangeChange = (
    startDate?: string,
    endDate?: string
  ) => {
    if (startDate && endDate) {
      setIncorporationStartDate(startDate);
      setIncorporationEndDate(endDate);
    } else {
      setIncorporationStartDate('');
      setIncorporationEndDate('');
    }
    setPage(1);
  };
  const handleScheduleDateRangeChange = (
    startDate?: string,
    endDate?: string
  ) => {
    if (startDate && endDate) {
      setScheduledStartDate(startDate);
      setScheduledEndDate(endDate);
    } else {
      setScheduledStartDate('');
      setScheduledEndDate('');
    }
    setPage(1);
  };
  const handleSentDateDateRangeChange = (
    startDate?: string,
    endDate?: string
  ) => {
    if (startDate && endDate) {
      setSentStartDate(startDate);
      setSentEndDate(endDate);
    } else {
      setSentStartDate('');
      setSentEndDate('');
    }
    setPage(1);
  };

  const handleSearch = () => {
    const firstWord = searchQuery.split(' ')[0];
    setDebouncedSearch(firstWord);
  };
  const handleSort = (
    sortField: 'dateOfIncorporation' | 'scheduledDate' | 'sentDate'
  ) => {
    setSortField(sortField);
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleReset = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setPage(1);
    setLimit(10);
    setIncorporationStartDate('');
    setIncorporationEndDate('');
    setScheduledStartDate('');
    setScheduledEndDate('');
    setSentStartDate('');
    setSentEndDate('');
    setDateRange(undefined);
    setSortDirection('desc');
    setResetDatePicker(true);
    setTimeout(() => setResetDatePicker(false), 0);
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const renderCampaignTable = (campaigns: any, emptyMessage: string) => {
    if (isLoading || isFetching) {
      return (
        <TableRow>
          <TableCell colSpan={8} className='h-32 text-center'>
            <LoadingWithSpinner />
          </TableCell>
        </TableRow>
      );
    }

    if (isError) {
      return (
        <TableRow>
          <TableCell colSpan={8} className='text-center text-red-500'>
            Failed to load campaign data. Please try again.
          </TableCell>
        </TableRow>
      );
    }

    if (!campaigns || campaigns.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8} className='text-center'>
            {emptyMessage}
          </TableCell>
        </TableRow>
      );
    }

    return campaigns.map((campaign: any, index: number) => (
      <TableRow
        key={`${campaign._id}-${index}`}
        className={`divide-x ${index % 2 !== 0 ? 'bg-muted/50' : 'hover:bg-card'}`}
      >
        <TableCell className='whitespace-nowrap p-4'>
          <div className='flex items-center gap-2'>
            {campaign.directorFirstName} {campaign.directorLastName}
          </div>
        </TableCell>
        <TableCell>{campaign.directorDIN}</TableCell>
        <TableCell>{campaign.directorEmail}</TableCell>
        <TableCell>{campaign.companyName}</TableCell>
        <TableCell>{campaign.companyCIN}</TableCell>
        <TableCell className='whitespace-nowrap'>
          {format(new Date(campaign.dateOfIncorporation), 'dd-MMM-yyyy')}
        </TableCell>
        <TableCell className='whitespace-nowrap'>
          {format(new Date(campaign.scheduledDate), 'dd-MMM-yyyy')}
        </TableCell>
        <TableCell className='whitespace-nowrap'>
          {campaign.sentDate
            ? format(new Date(campaign.sentDate), 'dd-MMM-yyyy')
            : 'Not Sent'}
        </TableCell>
      </TableRow>
    ));
  };

  // Calculate the counts for tabs
  const upcomingCount = data?.totalNumberOfUpcomingCampaigns;
  const upcomingCountTotalPage = data?.totalNumberOfUpcomingCampaignsPage;
  const recentCount = data?.totalNumberOfRecentCampaigns;
  const recentCountTotalPage = data?.totalNumberOfRecentCampaignsPage;
  const overdueCount = data?.totalNumberOfOverdueCampaigns;
  const overdueCountTotalPage = data?.totalNumberOfOverdueCampaignsPage;

  let totalPages = 0;

  if (statusCategory === 'upcoming') {
    totalPages = upcomingCountTotalPage ?? 0;
  } else if (statusCategory === 'sent') {
    totalPages = recentCountTotalPage ?? 0;
  } else {
    totalPages = overdueCountTotalPage ?? 0;
  }
  const limitOptions = [5, 10, 20, 50];
  return (
    <motion.div initial='hidden' animate='visible' variants={containerVariants}>
      <div className='mb-4 flex flex-row items-center justify-between gap-4'>
        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.5 }}
          className='flex items-center gap-2 py-3'
        >
          <div className='rounded-lg bg-blue-50 p-2'>
            <LucideClipboardList className='h-6 w-6 text-blue-600' />
          </div>
          <div>
            <h1 className='text-lg font-semibold text-gray-900 sm:text-2xl'>
              Campaign Tracker
            </h1>
            <p className='text-sm text-gray-500'>
              Total Campaigns: {upcomingCount + recentCount + overdueCount || 0}
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

      <Card className='px-2 py-3 md:p-5'>
        <div className='mb-4 flex w-full flex-col gap-4 md:mb-5 md:flex-row md:items-center md:justify-between'>
          <div className='flex w-full items-center gap-2'>
            <div className='relative w-60 sm:w-64 lg:w-96'>
              <Input
                placeholder='Search Company/Director Name, Email, DIN, CIN'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-l-md rounded-r-full ${searchQuery ? 'pr-20' : 'pr-10'}`}
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
                  className={`translate-x-2 rounded-full p-1.5 ${
                    searchQuery.trim()
                      ? 'cursor-pointer bg-primary hover:bg-blue-600'
                      : 'cursor-not-allowed bg-gray-200'
                  }`}
                  onClick={handleSearch}
                  disabled={!searchQuery.trim()}
                >
                  <IoSearchSharp
                    className={
                      searchQuery.trim() ? 'text-white' : 'text-gray-400'
                    }
                    size={16}
                  />
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
        {showFilters && (
          <div className='mb-4 grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-4'>
            <div>
              <p className='mb-2 text-xs font-medium text-black'>
                Campaigns Per Page
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
              <p className='mb-2 text-xs font-medium text-black'>
                Incorporation Date Range
              </p>
              <DateRangePicker
                value={dateRange}
                onChange={handleIncorporationDateRangeChange}
                resetSignal={resetDatePicker}
                className={`rounded-none ${
                  incorporationStartDate && incorporationEndDate
                    ? 'border-blue-500 bg-blue-100'
                    : ''
                }`}
              />
            </div>
            <div>
              <p className='mb-2 text-xs font-medium text-black'>
                Scheduled Date Range
              </p>
              <DateRangePicker
                value={dateRange}
                onChange={handleScheduleDateRangeChange}
                resetSignal={resetDatePicker}
                className={`rounded-none ${
                  scheduledStartDate && scheduledEndDate
                    ? 'border-blue-500 bg-blue-100'
                    : ''
                }`}
              />
            </div>
            <div>
              <p className='mb-2 text-xs font-medium text-black'>
                Sent Date Range
              </p>
              <DateRangePicker
                value={dateRange}
                onChange={handleSentDateDateRangeChange}
                resetSignal={resetDatePicker}
                className={`rounded-none ${
                  sentStartDate && sentEndDate
                    ? 'border-blue-500 bg-blue-100'
                    : ''
                }`}
              />
            </div>
          </div>
        )}

        <Tabs defaultValue='upcoming' className='w-full'>
          <ScrollArea>
            <TabsList className='mb-4 w-full sm:grid sm:grid-cols-3'>
              <TabsTrigger
                value='upcoming'
                onClick={() => {
                  setPage(1);
                  setStatusCategory('upcoming');
                }}
                className='flex items-center gap-2'
              >
                <Calendar className='h-4 w-4' />
                <span className=''>Upcoming</span>
                <span className='rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700'>
                  {isLoading ? (
                    <RefreshCw className='h-4 w-4 animate-spin text-blue-700' />
                  ) : (
                    upcomingCount
                  )}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value='recent'
                onClick={() => {
                  setPage(1);
                  setStatusCategory('sent');
                }}
                className='flex items-center gap-2'
              >
                <CalendarCheck className='h-4 w-4' />
                <span className=''>Recently Sent</span>
                <span className='rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700'>
                  {isLoading ? (
                    <RefreshCw className='h-4 w-4 animate-spin text-green-700' />
                  ) : (
                    recentCount
                  )}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value='overdue'
                onClick={() => {
                  setPage(1);
                  setStatusCategory('overdue');
                }}
                className='flex items-center gap-2'
              >
                <CalendarX className='h-4 w-4' />
                <span className=''>Overdue</span>
                <span className='rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700'>
                  {isLoading ? (
                    <RefreshCw className='h-4 w-4 animate-spin text-red-700' />
                  ) : (
                    overdueCount
                  )}
                </span>
              </TabsTrigger>
            </TabsList>
            <ScrollBar
              orientation='horizontal'
              className='h-2 opacity-50 lg:hidden'
            />
          </ScrollArea>

          <TabsContent value='upcoming'>
            <Table className='rounded-md border text-xs sm:text-sm'>
              <TableHeader>
                <TableRow className='divide-x whitespace-nowrap bg-muted'>
                  <TableHead>Director</TableHead>
                  <TableHead>DIN</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company Name</TableHead>
                  <TableHead>CIN</TableHead>
                  <TableHead
                    onClick={() => handleSort('dateOfIncorporation')}
                    className='cursor-pointer'
                  >
                    Incorporation{' '}
                    {sortField === 'dateOfIncorporation'
                      ? sortDirection === 'asc'
                        ? '↑'
                        : '↓'
                      : '↕'}
                  </TableHead>

                  <TableHead
                    onClick={() => handleSort('scheduledDate')}
                    className='cursor-pointer'
                  >
                    Scheduled Date{' '}
                    {sortField === 'scheduledDate'
                      ? sortDirection === 'asc'
                        ? '↑'
                        : '↓'
                      : '↕'}
                  </TableHead>

                  <TableHead
                    onClick={() => handleSort('sentDate')}
                    className='cursor-pointer'
                  >
                    Sent Date{' '}
                    {sortField === 'sentDate'
                      ? sortDirection === 'asc'
                        ? '↑'
                        : '↓'
                      : '↕'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderCampaignTable(
                  data?.campaigns ? data?.campaigns : [],
                  'No upcoming campaigns found.'
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value='recent'>
            <Table className='rounded-md border text-xs sm:text-sm'>
              <TableHeader>
                <TableRow className='divide-x whitespace-nowrap bg-muted'>
                  <TableHead>Director</TableHead>
                  <TableHead>DIN</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company Name</TableHead>
                  <TableHead>CIN</TableHead>
                  <TableHead
                    onClick={() => handleSort('dateOfIncorporation')}
                    className='cursor-pointer'
                  >
                    Incorporation{' '}
                    {sortField === 'dateOfIncorporation'
                      ? sortDirection === 'asc'
                        ? '↑'
                        : '↓'
                      : '↕'}
                  </TableHead>

                  <TableHead
                    onClick={() => handleSort('scheduledDate')}
                    className='cursor-pointer'
                  >
                    Scheduled Date{' '}
                    {sortField === 'scheduledDate'
                      ? sortDirection === 'asc'
                        ? '↑'
                        : '↓'
                      : '↕'}
                  </TableHead>

                  <TableHead
                    onClick={() => handleSort('sentDate')}
                    className='cursor-pointer'
                  >
                    Sent Date{' '}
                    {sortField === 'sentDate'
                      ? sortDirection === 'asc'
                        ? '↑'
                        : '↓'
                      : '↕'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderCampaignTable(
                  data?.campaigns ? data?.campaigns : [],
                  'No recently sent campaigns found.'
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value='overdue'>
            <Table className='rounded-md border text-xs sm:text-sm'>
              <TableHeader>
                <TableRow className='divide-x whitespace-nowrap bg-muted'>
                  <TableHead>Director</TableHead>
                  <TableHead>DIN</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company Name</TableHead>
                  <TableHead>CIN</TableHead>
                  <TableHead
                    onClick={() => handleSort('dateOfIncorporation')}
                    className='cursor-pointer'
                  >
                    Incorporation{' '}
                    {sortField === 'dateOfIncorporation'
                      ? sortDirection === 'asc'
                        ? '↑'
                        : '↓'
                      : '↕'}
                  </TableHead>

                  <TableHead
                    onClick={() => handleSort('scheduledDate')}
                    className='cursor-pointer'
                  >
                    Scheduled Date{' '}
                    {sortField === 'scheduledDate'
                      ? sortDirection === 'asc'
                        ? '↑'
                        : '↓'
                      : '↕'}
                  </TableHead>

                  <TableHead
                    onClick={() => handleSort('sentDate')}
                    className='cursor-pointer'
                  >
                    Sent Date{' '}
                    {sortField === 'sentDate'
                      ? sortDirection === 'asc'
                        ? '↑'
                        : '↓'
                      : '↕'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderCampaignTable(
                  data?.campaigns ? data?.campaigns : [],
                  'No overdue campaigns found.'
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
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
    </motion.div>
  );
};

export default CampaignStatusTables;
