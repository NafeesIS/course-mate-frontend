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
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { ChevronRight, RefreshCw, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { BsClipboardData } from 'react-icons/bs';
import { IoSearchSharp } from 'react-icons/io5';
import { OrderDateRangePicker } from '../../../order-management/_components/OrderDateRangePicker';
import { getAllCampaignDetails } from '../_services/services';

const ManageCampaignList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [expandedCompany, setExpandedCompany] = useState(new Set());
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [resetDatePicker, setResetDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  // Replace dateFilter state with separate states for different date filter types
  const [singleDateFilter, setSingleDateFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const toggleRow = (companyID: string) => {
    const newExpandedRows = new Set(expandedCompany);
    if (expandedCompany.has(companyID)) {
      newExpandedRows.delete(companyID);
    } else {
      newExpandedRows.add(companyID);
    }
    setExpandedCompany(newExpandedRows);
  };
  const handleDateRangeChange = (startDate?: string, endDate?: string) => {
    if (startDate && endDate && startDate === endDate) {
      // Single date selection
      setSingleDateFilter(startDate);
      setStartDateFilter('');
      setEndDateFilter('');
    } else if (startDate && endDate) {
      // Date range selection
      setSingleDateFilter('');
      setStartDateFilter(startDate);
      setEndDateFilter(endDate);
    } else {
      // Reset all date filters
      setSingleDateFilter('');
      setStartDateFilter('');
      setEndDateFilter('');
    }
    setPage(1);
  };

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: [
      'campaigns',
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
      getAllCampaignDetails({
        page,
        limit,
        companyName: debouncedSearch,
        directorName: debouncedSearch,
        directorEmail: debouncedSearch,
        companyCIN: debouncedSearch,
        directorDIN: debouncedSearch,
        funnelStatus: statusFilter,
        sort: sortDirection || undefined,
        dateOfIncorporation: singleDateFilter,
        startDate: startDateFilter,
        endDate: endDateFilter,
      }),
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch on component mount
  });

  const totalPages = data?.totalPages || 1;
  const campaigns = useMemo(() => data?.campaigns || [], [data]);
  const limitOptions = [5, 10, 20, 50];
  const handleSearch = () => {
    const firstWord = searchQuery.split(' ')[0];
    setPage(1);
    setDebouncedSearch(firstWord);
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
    setEndDateFilter('');
    setStartDateFilter('');
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

  const statusOptions = ['ALL', 'active', 'inactive'];

  return (
    <motion.div initial='hidden' animate='visible' variants={containerVariants}>
      <div className='mb-4 flex flex-row items-center justify-between gap-4'>
        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.5 }}
          className='flex items-center gap-2 py-3'
        >
          <div className='rounded-lg bg-blue-50 p-2'>
            <BsClipboardData className='h-6 w-6 text-blue-600' />
          </div>
          <div>
            <h1 className='text-lg font-semibold text-gray-900 sm:text-2xl'>
              Manage Campaigns
            </h1>
            <p className='text-sm text-gray-500'>
              Total Campaigns: {data?.totalCampaigns || 0}
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
            {/* <Button
              size='icon'
              variant='outline'
              onClick={handleReset}
              className='h-9 duration-300 hover:bg-primary hover:text-white'
            >
              <RxReset />
            </Button> */}
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
          <div className='mb-4 grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-3'>
            <div>
              <p className='mb-2 text-[13px] font-medium text-black'>
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
              <p className='mb-2 text-[13px] font-medium text-black'>
                Funnel Status
              </p>
              <Select
                onValueChange={(value) => {
                  setStatusFilter(value === 'ALL' ? '' : value);
                  setPage(1);
                }}
                value={statusFilter}
              >
                <SelectTrigger
                  className={`rounded-none ${statusFilter !== '' ? 'border-blue-500 bg-blue-100' : ''}`}
                >
                  <SelectValue
                    className='text-muted-foreground'
                    placeholder='ALL'
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
                Incorporation Date Range
              </p>
              <OrderDateRangePicker
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
        )}

        <Table className='rounded-md border text-xs sm:text-sm'>
          <TableHeader>
            <TableRow className='divide-x whitespace-nowrap bg-muted'>
              <TableHead>Director</TableHead>
              <TableHead>DIN</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>CIN</TableHead>
              <TableHead onClick={handleSort} className='cursor-pointer'>
                Incorporation {sortDirection === 'asc' ? '↑' : '↓'}
              </TableHead>

              <TableHead>Total</TableHead>
              <TableHead>Funnel Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isFetching ? (
              <TableRow>
                <TableCell colSpan={9} className='h-[400px] text-center'>
                  <LoadingWithSpinner />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={9} className='text-center text-red-500'>
                  Failed to load campaign data. Please try again.
                </TableCell>
              </TableRow>
            ) : campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className='text-center'>
                  No campaigns found.
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((company: any, index: number) => (
                <>
                  <TableRow
                    key={company._id}
                    onClick={() => toggleRow(company._id)}
                    className={`divide-x ${index % 2 !== 0 ? 'bg-muted/50' : 'hover:bg-card'}`}
                  >
                    <TableCell className='whitespace-nowrap p-4'>
                      <div className='flex items-center gap-2'>
                        <ChevronRight
                          className={`transition-transform ${
                            expandedCompany.has(company._id) ? 'rotate-90' : ''
                          }`}
                        />
                        {company.directorFirstName} {company.directorLastName}
                      </div>
                    </TableCell>
                    <TableCell>{company.directorDIN}</TableCell>
                    <TableCell>{company.directorEmail}</TableCell>
                    <TableCell>{company.companyName}</TableCell>
                    <TableCell>{company.companyCIN}</TableCell>
                    <TableCell>
                      {' '}
                      {format(
                        new Date(company.dateOfIncorporation),
                        'dd-MMM-yyyy'
                      )}
                      {}
                    </TableCell>
                    <TableCell>{company.campaigns.length}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          company.funnelStatus === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {company.funnelStatus}
                      </span>
                    </TableCell>
                  </TableRow>

                  {expandedCompany.has(company._id) && (
                    <TableRow className='text-xs shadow-inner sm:text-sm'>
                      <TableCell colSpan={9} className='p-0'>
                        <div
                          className={`space-y-4 ${
                            index % 2 !== 0 ? 'bg-muted/50' : 'hover:bg-card'
                          } p-4`}
                        >
                          <h4 className='font-semibold'>Scheduled Campaigns</h4>
                          <Table className='text-xs sm:text-sm'>
                            <TableHeader>
                              <TableRow className='divide-x'>
                                <TableHead className='whitespace-nowrap p-4'>
                                  #
                                </TableHead>
                                <TableHead className='whitespace-nowrap p-4'>
                                  Scheduled Date
                                </TableHead>
                                <TableHead className='whitespace-nowrap p-4'>
                                  Sent Date
                                </TableHead>
                                <TableHead className='whitespace-nowrap p-4'>
                                  Campaign Status
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {company.campaigns.map(
                                (camp: any, index: number) => (
                                  <TableRow key={index} className='divide-x'>
                                    <TableCell className='p-4'>
                                      {index + 1}
                                    </TableCell>
                                    <TableCell className='p-4'>
                                      {format(
                                        new Date(camp.scheduledDate),
                                        'dd MMM yyyy'
                                      )}
                                    </TableCell>
                                    <TableCell className='p-4'>
                                      {camp.sentDate
                                        ? format(
                                            new Date(camp.sentDate),
                                            'dd MMM yyyy'
                                          )
                                        : 'Not Sent'}
                                    </TableCell>
                                    <TableCell className='p-4'>
                                      <span
                                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                          camp.status === 'sent'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                      >
                                        {camp.status}
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
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
    </motion.div>
  );
};

export default ManageCampaignList;
