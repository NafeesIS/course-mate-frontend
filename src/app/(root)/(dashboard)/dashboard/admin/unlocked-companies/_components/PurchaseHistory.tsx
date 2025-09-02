/* eslint-disable camelcase */
'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import { formatToUrl } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { useUserSignInDetails } from '@/store/userStore';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Filter,
  Loader2,
  RotateCw,
  Search,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useFetchUnlockedCompanies } from '../_hooks/useFetchUnlockedCompanies';

type SortField = 'unlockedAt' | 'expiryDate' | 'companyName';
type SortOrder = 'asc' | 'desc';
type UnlockType = 'all' | 'report' | 'documents';
type CompanyType = 'all' | 'company' | 'llp';

const PurchaseHistory = () => {
  const { userSignInDetails } = useUserSignInDetails();

  const userId = userSignInDetails?.data?._id;

  // Filter and pagination state
  const [page, setPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<SortField>('unlockedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [unlockType, setUnlockType] = useState<UnlockType>('all');
  const [userEmail, setUserEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [companyType, setCompanyType] = useState<CompanyType>('all');
  const [isFiltering, setIsFiltering] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Add these state variables for temporary filter values
  const [tempFilters, setTempFilters] = useState({
    searchTerm: '',
    userEmail: '',
    unlockType: 'all' as UnlockType,
    companyType: 'all' as CompanyType,
    dateRange: undefined as DateRange | undefined,
  });

  const queryClient = useQueryClient();

  // Fetch data with filters
  const { data, isLoading, isError, error, refetch } =
    useFetchUnlockedCompanies(userId, {
      page,
      limit,
      sortBy,
      sortOrder,
      unlockType,
      userEmail: userEmail.trim() || undefined,
      searchTerm: searchTerm.trim() || undefined,
      companyType,
      // Convert local dates to UTC while maintaining exact day boundaries in user's timezone
      // Example: For a user in Bangladesh (UTC+6) selecting April 2nd:
      // - Start: April 2nd 00:00:00 Bangladesh time = April 1st 18:00:00 UTC
      // - End: April 2nd 23:59:59 Bangladesh time = April 2nd 17:59:59 UTC
      // This ensures we get exactly one full day's data in the user's local timezone
      startDate: dateRange?.from
        ? new Date(dateRange.from.setHours(0, 0, 0, 0)).toISOString()
        : undefined,
      endDate: dateRange?.to
        ? new Date(dateRange.to.setHours(23, 59, 59, 999)).toISOString()
        : undefined,
    });

  const companies = data?.unlockedCompanies || [];
  const totalPages = data?.totalPages || 1;

  // Handle sort toggle
  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd-MMM-yyyy');
  };

  // Apply filters
  const applyFilters = () => {
    setIsFiltering(true);
    setPage(1);
    setIsFilterApplied(true);

    // Apply the temporary filters to the actual filter states
    setSearchTerm(tempFilters.searchTerm);
    setUserEmail(tempFilters.userEmail);
    setUnlockType(tempFilters.unlockType);
    setCompanyType(tempFilters.companyType);
    setDateRange(tempFilters.dateRange);

    setIsFiltering(false);
  };

  useEffect(() => {
    // When filters change, we want to make sure we're not showing stale data
    if (!isLoading && !isFiltering) {
      queryClient.invalidateQueries({
        queryKey: ['unlockedCompanies'],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sortOrder, page, limit]);

  // Reset filters
  const resetFilters = () => {
    setTempFilters({
      searchTerm: '',
      userEmail: '',
      unlockType: 'all',
      companyType: 'all',
      dateRange: undefined,
    });
    setSearchTerm('');
    setUserEmail('');
    setUnlockType('all');
    setCompanyType('all');
    setDateRange(undefined);
    setPage(1);
    setSortBy('unlockedAt');
    setSortOrder('desc');
    setIsFilterApplied(false);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(null);
        pageNumbers.push(totalPages);
      } else if (page >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push(null);
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push(null);
        pageNumbers.push(page - 1);
        pageNumbers.push(page);
        pageNumbers.push(page + 1);
        pageNumbers.push(null);
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Add this function to handle search
  const handleSearch = () => {
    setSearchTerm(tempFilters.searchTerm);
    setPage(1);
  };

  // Add this function to handle search reset
  const resetSearch = () => {
    setTempFilters((prev) => ({ ...prev, searchTerm: '' }));
    setSearchTerm('');
    setPage(1);
    // setIsFilterApplied(false);
  };

  // Add this near your other handler functions
  const handleRefresh = () => {
    // Remove the cache and fetch fresh data
    queryClient.removeQueries({ queryKey: ['unlockedCompanies'] });
    refetch();
  };

  // Add function to count applied filters
  const getAppliedFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (userEmail) count++;
    if (unlockType !== 'all') count++;
    if (companyType !== 'all') count++;
    if (dateRange?.from) count++;
    return count;
  };

  // Add functions to remove individual filters
  const removeSearchFilter = () => {
    setSearchTerm('');
    setTempFilters((prev) => ({ ...prev, searchTerm: '' }));
  };

  const removeEmailFilter = () => {
    setUserEmail('');
    setTempFilters((prev) => ({ ...prev, userEmail: '' }));
  };

  const removeUnlockTypeFilter = () => {
    setUnlockType('all');
    setTempFilters((prev) => ({ ...prev, unlockType: 'all' }));
  };

  const removeCompanyTypeFilter = () => {
    setCompanyType('all');
    setTempFilters((prev) => ({ ...prev, companyType: 'all' }));
  };

  const removeDateRangeFilter = () => {
    setDateRange(undefined);
    setTempFilters((prev) => ({ ...prev, dateRange: undefined }));
  };

  return (
    <div>
      <Card className='overflow-hidden bg-white shadow-lg'>
        <CardHeader className='flex flex-col justify-between gap-2 pb-0 md:flex-row md:items-center'>
          <div>
            <CardTitle className='text-lg font-semibold md:text-xl'>
              Unlocked Companies
            </CardTitle>
            <CardDescription className='text-xs md:text-sm'>
              Companies unlocked by users: {data?.totalCount || 0}
            </CardDescription>
          </div>

          <div className='flex flex-col items-center gap-2 md:flex-row md:items-center'>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='icon'
                onClick={handleRefresh}
                className='h-9 w-9'
                disabled={isLoading}
              >
                <RotateCw
                  className={cn('h-4 w-4', isLoading && 'animate-spin')}
                />
              </Button>

              <div className='relative flex w-60 md:w-80'>
                <Input
                  placeholder='Search by company name or CIN...'
                  value={tempFilters.searchTerm}
                  onChange={(e) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      searchTerm: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  className='pr-16'
                />
                <div className='absolute right-0 top-0 flex h-full items-center space-x-1 px-2'>
                  {tempFilters.searchTerm && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-7 w-7'
                      onClick={resetSearch}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-7 w-7'
                    onClick={handleSearch}
                  >
                    <Search className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>

            <Button
              variant='outline'
              className={cn(
                'h-9 px-3',
                showFilters &&
                  '-mb-4 h-14 w-full rounded-b-none border-b-0 bg-muted px-8 text-muted-foreground hover:bg-muted'
              )}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className='mr-1.5 h-4 w-4 flex-shrink-0' />
              <span className='text-xs'>
                Advanced Filters{' '}
                {getAppliedFiltersCount() > 0 && (
                  <span className='ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-white'>
                    {getAppliedFiltersCount()}
                  </span>
                )}
              </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className='pt-0'>
          {/* Filters Section */}
          {showFilters && (
            <div className='mb-6 mt-3 rounded-lg rounded-tr-none border bg-muted p-4 shadow-sm'>
              <div className='space-y-4'>
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='email' className='text-[10px] sm:text-xs'>
                      User Email
                    </Label>
                    <Input
                      id='email'
                      value={tempFilters.userEmail}
                      onChange={(e) =>
                        setTempFilters((prev) => ({
                          ...prev,
                          userEmail: e.target.value,
                        }))
                      }
                      className='h-8 bg-white text-xs sm:text-sm'
                    />
                  </div>

                  <div className='grid gap-2'>
                    <Label htmlFor='type' className='text-[10px] sm:text-xs'>
                      Unlock Type
                    </Label>
                    <Select
                      value={tempFilters.unlockType}
                      onValueChange={(value) =>
                        setTempFilters((prev) => ({
                          ...prev,
                          unlockType: value as UnlockType,
                        }))
                      }
                    >
                      <SelectTrigger className='h-8 bg-white text-xs sm:text-sm'>
                        <SelectValue placeholder='Select type' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Types</SelectItem>
                        <SelectItem value='report'>Report</SelectItem>
                        <SelectItem value='documents'>Documents</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='grid gap-2'>
                    <Label
                      htmlFor='companyType'
                      className='text-[10px] sm:text-xs'
                    >
                      Company Type
                    </Label>
                    <Select
                      value={tempFilters.companyType}
                      onValueChange={(value) =>
                        setTempFilters((prev) => ({
                          ...prev,
                          companyType: value as CompanyType,
                        }))
                      }
                    >
                      <SelectTrigger className='h-8 bg-white text-xs sm:text-sm'>
                        <SelectValue placeholder='Select company type' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All</SelectItem>
                        <SelectItem value='company'>Company</SelectItem>
                        <SelectItem value='llp'>LLP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='grid gap-2'>
                    <Label
                      htmlFor='dateRange'
                      className='text-[10px] sm:text-xs'
                    >
                      Unlocked At
                    </Label>
                    <Popover
                      open={isDatePickerOpen}
                      onOpenChange={setIsDatePickerOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          className={cn(
                            'h-8 w-full justify-start bg-white px-2 text-left font-normal text-muted-foreground',
                            !tempFilters.dateRange && 'text-muted-foreground'
                          )}
                        >
                          <Calendar className='mr-1.5 h-4 w-4 flex-shrink-0' />
                          <span className='text-[10px] sm:text-xs'>
                            {tempFilters.dateRange?.from ? (
                              tempFilters.dateRange.to ? (
                                <>
                                  {format(
                                    tempFilters.dateRange.from,
                                    'dd MMM yyyy'
                                  )}{' '}
                                  -{' '}
                                  {format(
                                    tempFilters.dateRange.to,
                                    'dd MMM yyyy'
                                  )}
                                </>
                              ) : (
                                format(
                                  tempFilters.dateRange.from,
                                  'dd MMM yyyy'
                                )
                              )
                            ) : (
                              <span>Pick a date range</span>
                            )}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='end'>
                        <CalendarComponent
                          initialFocus
                          mode='range'
                          defaultMonth={tempFilters.dateRange?.from}
                          selected={tempFilters.dateRange}
                          onSelect={(range) =>
                            setTempFilters((prev) => ({
                              ...prev,
                              dateRange: range,
                            }))
                          }
                          numberOfMonths={2}
                          classNames={{
                            selected: 'bg-gray-200',
                            range_start:
                              'bg-sky-600 rounded-none text-white hover:bg-sky-600 hover:text-white',
                            range_end:
                              'bg-sky-600 rounded-none text-white hover:bg-sky-600 hover:text-white',
                            range_middle:
                              'bg-gray-100 rounded-none text-gray-700 hover:bg-gray-100 hover:text-gray-800',
                            today: 'border',
                            day: 'h-7 w-7',
                            weekday:
                              'text-muted-foreground rounded-md w-7 font-normal text-[0.8rem]',
                            day_button: 'h-7 w-7 text-xs',
                            month: 'last:hidden md:last:block md:last:ml-4',
                            month_caption: 'pb-3 text-center',
                          }}
                        />
                        <div className='flex justify-end gap-2 border-t p-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              setTempFilters((prev) => ({
                                ...prev,
                                dateRange: dateRange,
                              }));
                              setIsDatePickerOpen(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size='sm'
                            onClick={() => {
                              setIsDatePickerOpen(false);
                            }}
                          >
                            Update
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
                  {isFilterApplied && (
                    <div className='flex items-center gap-2'>
                      <div className='flex flex-wrap gap-1'>
                        {searchTerm && (
                          <Badge
                            variant='secondary'
                            className='flex items-center gap-1 rounded-full border border-sky-300 bg-white px-3 text-[10px] text-sky-500'
                          >
                            Search: {searchTerm}
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-4 w-4 hover:bg-transparent'
                              onClick={removeSearchFilter}
                            >
                              <X className='h-3 w-3' />
                            </Button>
                          </Badge>
                        )}
                        {userEmail && (
                          <Badge
                            variant='secondary'
                            className='flex items-center gap-1 rounded-full border border-sky-300 bg-white px-3 text-[10px] text-sky-500'
                          >
                            {userEmail}
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-4 w-4 hover:bg-transparent'
                              onClick={removeEmailFilter}
                            >
                              <X className='h-3 w-3' />
                            </Button>
                          </Badge>
                        )}
                        {unlockType !== 'all' && (
                          <Badge
                            variant='secondary'
                            className='flex items-center gap-1 rounded-full border border-sky-300 bg-white px-3 text-[10px] text-sky-500'
                          >
                            {unlockType}
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-4 w-4 hover:bg-transparent'
                              onClick={removeUnlockTypeFilter}
                            >
                              <X className='h-3 w-3' />
                            </Button>
                          </Badge>
                        )}
                        {companyType !== 'all' && (
                          <Badge
                            variant='secondary'
                            className='flex items-center gap-1 rounded-full border border-sky-300 bg-white px-3 text-[10px] text-sky-500'
                          >
                            {companyType}
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-4 w-4 hover:bg-transparent'
                              onClick={removeCompanyTypeFilter}
                            >
                              <X className='h-3 w-3' />
                            </Button>
                          </Badge>
                        )}
                        {dateRange?.from && (
                          <Badge
                            variant='secondary'
                            className='flex items-center gap-1 rounded-full border border-sky-300 bg-white px-3 text-[10px] text-sky-500'
                          >
                            {format(dateRange.from, 'dd MMM yyyy')}
                            {dateRange.to &&
                              ` - ${format(dateRange.to, 'dd MMM yyyy')}`}
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-4 w-4 hover:bg-transparent'
                              onClick={removeDateRangeFilter}
                            >
                              <X className='h-3 w-3' />
                            </Button>
                          </Badge>
                        )}

                        {userEmail ||
                        unlockType !== 'all' ||
                        companyType !== 'all' ||
                        dateRange?.from ? (
                          <Button
                            variant='ghost'
                            onClick={resetFilters}
                            className='h-6 rounded-full bg-white px-3 text-[10px] text-red-500'
                          >
                            <X className='mr-1.5 h-3.5 w-3.5' />
                            Clear Filters
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  )}
                  <div className='ml-auto flex gap-2'>
                    <Button
                      variant='outline'
                      onClick={() => setShowFilters(false)}
                      className='h-8 px-4 text-xs'
                    >
                      Cancel
                    </Button>
                    <Button onClick={applyFilters} className='h-8 px-4 text-xs'>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error state */}
          {isError && (
            <Alert variant='destructive' className='mb-6 mt-8'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                {error?.message || 'Failed to fetch unlocked companies'}
              </AlertDescription>
            </Alert>
          )}

          {/* Table */}
          <div className='mt-4 rounded-md border bg-white shadow'>
            <Table className='text-xs font-medium'>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[60px] pl-4'>#</TableHead>

                  <TableHead
                    className='cursor-pointer'
                    onClick={() => handleSort('unlockedAt')}
                  >
                    <div className='flex items-center gap-1'>
                      Unlocked At
                      {sortBy === 'unlockedAt' &&
                        (sortOrder === 'asc' ? (
                          <ChevronUp className='h-4 w-4' />
                        ) : (
                          <ChevronDown className='h-4 w-4' />
                        ))}
                    </div>
                  </TableHead>

                  <TableHead
                    className='cursor-pointer'
                    onClick={() => handleSort('companyName')}
                  >
                    <div className='flex items-center gap-1'>
                      Company
                      {sortBy === 'companyName' &&
                        (sortOrder === 'asc' ? (
                          <ChevronUp className='h-4 w-4' />
                        ) : (
                          <ChevronDown className='h-4 w-4' />
                        ))}
                    </div>
                  </TableHead>

                  <TableHead>Unlocked By</TableHead>

                  <TableHead
                    className='cursor-pointer'
                    onClick={() => handleSort('expiryDate')}
                  >
                    <div className='flex items-center gap-1'>
                      Valid Till
                      {sortBy === 'expiryDate' &&
                        (sortOrder === 'asc' ? (
                          <ChevronUp className='h-4 w-4' />
                        ) : (
                          <ChevronDown className='h-4 w-4' />
                        ))}
                    </div>
                  </TableHead>

                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className='h-80 text-center'>
                      <Loader2 className='mx-auto h-6 w-6 animate-spin' />
                      <p className='mt-2'>Loading data...</p>
                    </TableCell>
                  </TableRow>
                ) : companies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className='h-24 text-center'>
                      No unlocked companies found
                    </TableCell>
                  </TableRow>
                ) : (
                  companies.map((company, index) => (
                    <TableRow
                      key={`${company.companyId}-${company.unlockedAt}-${company.userId._id}`}
                    >
                      <TableCell className='pl-4 font-medium'>
                        {(page - 1) * limit + index + 1}
                      </TableCell>

                      <TableCell className='whitespace-nowrap'>
                        <div className='flex flex-col gap-0.5'>
                          <span className='font-medium text-gray-900'>
                            {format(
                              new Date(company.unlockedAt),
                              'dd-MMM-yyyy'
                            )}
                          </span>
                          <span className='text-[10px] text-muted-foreground'>
                            {format(new Date(company.unlockedAt), 'hh:mm aa')}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className='min-w-96'>
                        <Link
                          href={`/dashboard/admin/unlocked-companies/company-details/${formatToUrl(company.companyName)}/${company.companyId}/${company.userId._id}`}
                          target='_blank'
                          prefetch={false}
                          className='hover:underline'
                        >
                          <div className='space-y-1'>
                            <div className='font-medium'>
                              {company.companyName}
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              {company.companyId}
                            </div>
                          </div>
                        </Link>
                      </TableCell>

                      <TableCell>
                        {company.userId?.emails?.[0] || 'N/A'}
                      </TableCell>

                      <TableCell className='whitespace-nowrap'>
                        {formatDate(company.expiryDate)}
                      </TableCell>

                      <TableCell>
                        {company.unlockType === 'report'
                          ? 'Report'
                          : 'Documents'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {!isLoading && companies.length > 0 && (
            <div className='mt-4 flex flex-col items-center justify-between gap-4 md:mt-6 md:flex-row'>
              <div className='order-2 text-center text-xs text-muted-foreground md:order-1 md:text-left'>
                Showing {(page - 1) * limit + 1} to{' '}
                {Math.min(page * limit, data?.totalCount || 0)} of{' '}
                {data?.totalCount || 0} entries
              </div>

              <Pagination className='order-1 w-full md:order-2 md:ml-auto md:w-fit md:justify-end'>
                <PaginationContent className='flex flex-wrap justify-center gap-1'>
                  <PaginationItem className='hidden md:inline-block'>
                    <PaginationPrevious
                      onClick={() => setPage(Math.max(1, page - 1))}
                      className={
                        page === 1
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer hover:ring-1'
                      }
                    />
                  </PaginationItem>

                  {/* Mobile Previous Button */}
                  <PaginationItem className='md:hidden'>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className='h-8 w-8 hover:ring-1'
                    >
                      <ChevronLeft className='h-4 w-4' />
                    </Button>
                  </PaginationItem>

                  {/* Simplified mobile pagination */}
                  <div className='md:hidden'>
                    <select
                      value={page}
                      onChange={(e) => setPage(Number(e.target.value))}
                      className='h-8 rounded-md border border-input bg-background px-2 text-sm'
                    >
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        )
                      )}
                    </select>
                    <span className='mx-2 text-sm text-muted-foreground'>
                      of {totalPages}
                    </span>
                  </div>

                  {/* Desktop pagination numbers */}
                  <div className='hidden md:flex md:gap-1'>
                    {getPageNumbers().map((pageNum, i) =>
                      pageNum === null ? (
                        <PaginationItem key={`ellipsis-${i}`}>
                          <span className='px-2'>...</span>
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={`page-${pageNum}`}>
                          <PaginationLink
                            isActive={page === pageNum}
                            onClick={() => setPage(pageNum as number)}
                            className={cn(
                              'hover:ring-1',
                              page === pageNum && 'ring-2 hover:ring-2'
                            )}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                  </div>

                  {/* Mobile Next Button */}
                  <PaginationItem className='md:hidden'>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className='h-8 w-8 hover:ring-1'
                    >
                      <ChevronRight className='h-4 w-4' />
                    </Button>
                  </PaginationItem>

                  <PaginationItem className='hidden md:inline-block'>
                    <PaginationNext
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      className={
                        page === totalPages
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer hover:ring-1'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseHistory;
