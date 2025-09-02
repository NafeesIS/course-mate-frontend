import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { format } from 'date-fns';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FcInfo } from 'react-icons/fc';
import { IUserSubscription } from '../_types/types';

const SubscriptionDetailsDialog = ({
  subscriptions,
  userId,
  title,
}: {
  subscriptions: IUserSubscription[];
  userId: string;
  title: string;
}) => {
  const [searchOrderId, setSearchSubscriptionId] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  type SortableColumn = 'startDate' | 'endDate' | null;
  const [sortColumn, setSortColumn] = useState<SortableColumn>('startDate');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const subscriptionsPerPage = 5;

  // Reset filters
  const resetFilters = () => {
    setSearchSubscriptionId('');
    setStatusFilter('');
    setSortColumn(null);
    setSortDirection('asc');
    setCurrentPage(1);
  };

  // Reset current page when filters, search, or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchOrderId, statusFilter, sortColumn, sortDirection]);

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter((subscription) => {
    if (searchOrderId && !subscription.orderId.includes(searchOrderId)) {
      return false;
    }
    if (statusFilter && subscription.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Sort subscriptions
  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    if (!sortColumn) return 0; // No sorting if no column is selected
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    // Handle date columns
    if (sortColumn === 'startDate' || sortColumn === 'endDate') {
      return sortDirection === 'asc'
        ? new Date(aValue).getTime() - new Date(bValue).getTime()
        : new Date(bValue).getTime() - new Date(aValue).getTime();
    }

    // Default string comparison
    return sortDirection === 'asc'
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  // Pagination logic
  const totalSubscriptions = sortedSubscriptions.length;
  const totalPages = Math.ceil(totalSubscriptions / subscriptionsPerPage);
  const paginatedSubscriptions = sortedSubscriptions.slice(
    (currentPage - 1) * subscriptionsPerPage,
    currentPage * subscriptionsPerPage
  );

  const handleSort = (column: Exclude<SortableColumn, null>) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='h-6 duration-300 hover:bg-primary hover:text-white'
          size='sm'
        >
          {subscriptions.length}
        </Button>
      </DialogTrigger>
      <DialogContent className='h-auto max-h-screen sm:w-[640px] lg:w-[1024px] lg:min-w-[1024px] xl:w-[1124px] xl:min-w-[1124px]'>
        <DialogHeader>
          <DialogTitle>
            <DialogDescription className='flex flex-wrap items-center justify-center gap-1 text-sm font-semibold text-black md:justify-start lg:text-lg'>
              <span className='whitespace-nowrap'>Subscriptions:</span>{' '}
              <span className='flex items-center whitespace-nowrap'>
                {title}{' '}
                <Link
                  href={`user-management/${userId}?tab=subscriptions`}
                  className='p-2 text-primary transition-colors duration-200 hover:text-blue-600'
                >
                  <FcInfo className='h-5 w-5' />
                </Link>
              </span>
            </DialogDescription>
          </DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
          {/* Search by Subscription ID */}
          <Input
            placeholder='Search by Order ID'
            value={searchOrderId}
            onChange={(e) => setSearchSubscriptionId(e.target.value)}
            className='col-span-2 w-full md:col-span-1 lg:col-span-2'
          />

          {/* Filter by Status */}
          <Select
            onValueChange={(value) =>
              setStatusFilter(value === 'ALL' ? '' : value)
            }
            value={statusFilter || 'ALL'}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='All Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ALL'>All Status</SelectItem>
              {['active', 'inactive', 'expired', 'pending'].map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reset Button */}
          <Button variant='secondary' onClick={resetFilters} className='w-full'>
            Reset
          </Button>
        </div>

        <Card className='no-scrollbar mx-auto w-full overflow-scroll rounded-md border-none shadow-none sm:max-w-6xl'>
          {paginatedSubscriptions.length > 0 ? (
            <>
              <Table className='min-w-4xl mb-4 rounded-md border text-[10px] shadow lg:text-xs'>
                <TableHeader>
                  <TableRow className='divide-x bg-muted p-4'>
                    {[
                      '#',
                      'Order ID',
                      'Plan',
                      'Included Zone',
                      'Amount Paid',
                      'Payment ID',
                      'Start Date',
                      'End Date',

                      'Status',
                    ].map((header) => (
                      <TableHead
                        key={header}
                        className={`whitespace-nowrap p-4 text-left font-semibold text-foreground ${header === 'Amount Paid' ? 'text-center' : ''} ${
                          header === 'Start Date' || header === 'End Date'
                            ? 'cursor-pointer'
                            : ''
                        }`}
                        onClick={() =>
                          header === 'Start Date'
                            ? handleSort('startDate')
                            : header === 'End Date'
                              ? handleSort('endDate')
                              : undefined
                        }
                      >
                        {header}
                        {(header === 'Start Date' || header === 'End Date') && (
                          <span className='ml-2'>
                            {sortColumn ===
                            (header === 'Start Date' ? 'startDate' : 'endDate')
                              ? sortDirection === 'asc'
                                ? '↑'
                                : '↓'
                              : '↕'}
                          </span>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSubscriptions.map((subscription, index) => (
                    <TableRow
                      key={subscription.orderId}
                      className={`divide-x text-left ${
                        index % 2 !== 0 ? 'bg-muted/50' : 'hover:bg-card'
                      }`}
                    >
                      <TableCell className='p-4'>
                        {' '}
                        {currentPage * subscriptionsPerPage -
                          subscriptionsPerPage +
                          index +
                          1}
                      </TableCell>
                      <TableCell className='p-4'>
                        {subscription.orderId}
                      </TableCell>
                      <TableCell className='p-4 capitalize'>
                        {subscription.plan}
                      </TableCell>
                      <TableCell className='p-4'>
                        {subscription.options.join('+ ')} India
                      </TableCell>
                      <TableCell className='p-4 text-right'>
                        ₹{subscription.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className='p-4 text-left'>
                        {subscription.paymentId}
                      </TableCell>
                      <TableCell className='whitespace-nowrap p-4'>
                        {format(
                          new Date(subscription?.startDate),
                          'dd-MMM-yyyy'
                        )}
                      </TableCell>
                      <TableCell className='whitespace-nowrap p-4'>
                        {format(new Date(subscription?.endDate), 'dd-MMM-yyyy')}
                      </TableCell>

                      <TableCell className='p-4'>
                        <span
                          className={`font-semibold capitalize ${
                            subscription.status === 'active'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {subscription.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination Component */}
              <Pagination className='mt-4'>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href='#'
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(Math.max(currentPage - 1, 1));
                      }}
                      className={`p-1 text-[10px] sm:p-2 sm:text-sm ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => {
                    const pageNumber = i + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            className='h-auto w-auto px-1.5 py-1 text-[10px] sm:px-2.5 sm:py-1.5 sm:text-sm'
                            href='#'
                            isActive={currentPage === pageNumber}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(pageNumber);
                            }}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }

                    if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
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
                        setCurrentPage(Math.min(currentPage + 1, totalPages));
                      }}
                      className={`p-1 text-[10px] sm:p-2 sm:text-sm ${
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          ) : (
            <div className='flex flex-col items-center p-4'>
              <p className='mb-4 text-center text-muted-foreground'>
                No subscriptions available
              </p>
            </div>
          )}
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDetailsDialog;
