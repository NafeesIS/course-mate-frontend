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
import React, { useEffect, useState } from 'react';
import { FcInfo } from 'react-icons/fc';
import { IUserOrder } from '../_types/types';
import { OrderDatePicker } from './OrderDatePicker';

// Helper function to determine unlock credits type
export const formatUnlockCredits = (
  bulkCredits: number | null | undefined,
  companyCredits: number | null | undefined
) => {
  if (bulkCredits) return `${bulkCredits} (Director)`;
  if (companyCredits) return `${companyCredits} (Company)`;
  return '-';
};

const OrderDetailsDialog = ({
  orders,
  userId,
  title,
}: {
  orders: IUserOrder[];
  userId: string;
  title: string;
}) => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchOrderId, setSearchOrderId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [createdAtSearch, setCreatedAtSearch] = useState<Date | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 3;
  // Helper function to format price with currency
  const formatPrice = (price: number, currency?: string): string => {
    // Map currency codes to symbols
    const currencySymbols: { [key: string]: string } = {
      INR: '₹',
      USD: '$',
    };

    // Format the price with commas for thousands
    const formattedPrice = price.toLocaleString();

    // Get the currency symbol or fall back to an empty string
    const currencySymbol = currency ? currencySymbols[currency] || '' : '';

    // Return the formatted price
    return currency
      ? `${currencySymbol}${formattedPrice} ${currency}`
      : formattedPrice;
  };
  const formatDiscountAmount = (price: number, currency?: string): string => {
    // Map currency codes to symbols
    const currencySymbols: { [key: string]: string } = {
      INR: '₹',
      USD: '$',
    };

    // Format the price with commas for thousands
    const formattedPrice = price.toLocaleString();

    // Get the currency symbol or fall back to an empty string
    const currencySymbol = currency ? currencySymbols[currency] || '' : '';

    // Return the formatted price
    return currency ? `${currencySymbol}${formattedPrice}` : formattedPrice;
  };

  const determineCurrencyLabel = (items: { currency?: string }[]): string => {
    // Extract unique currencies from the items array
    const uniqueCurrencies = Array.from(
      new Set(items.map((item) => item.currency).filter(Boolean)) // Filter out undefined or null values
    );

    // Return an empty string if no currencies exist
    if (uniqueCurrencies.length === 0) {
      return '';
    }

    // Combine the unique currencies in a readable format
    return uniqueCurrencies.length > 1
      ? `${uniqueCurrencies.join('/')}`
      : `${uniqueCurrencies[0]}`;
  };

  const resetFilters = () => {
    setSearchOrderId('');
    setStatusFilter('');
    setCreatedAtSearch(undefined);
    setCurrentPage(1);
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [searchOrderId, statusFilter, createdAtSearch, sortDirection]);
  // Apply filters and sorting to the full dataset
  const filteredAndSortedOrders = orders
    .filter((order) => {
      // Filter by Order ID
      if (searchOrderId && !order.orderId.includes(searchOrderId)) {
        return false;
      }
      // Filter by Status
      if (statusFilter && order.status !== statusFilter) {
        return false;
      }
      // Filter by Created Date
      if (
        createdAtSearch &&
        format(new Date(order.createdAt), 'yyyy-MM-dd') !==
          format(createdAtSearch, 'yyyy-MM-dd')
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      // Sort by Created Date
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });

  // Pagination logic
  const totalOrders = filteredAndSortedOrders.length;
  const totalPages = Math.ceil(totalOrders / ordersPerPage);
  const paginatedOrders = filteredAndSortedOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  // };

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='h-6 duration-300 hover:bg-primary hover:text-white'
          size='sm'
        >
          {orders.length}
        </Button>
      </DialogTrigger>
      <DialogContent className='h-auto max-h-screen p-3 sm:w-[640px] lg:w-[1024px] lg:min-w-[1024px] xl:w-[1150px] xl:min-w-[1150px]'>
        <DialogHeader>
          <DialogTitle>
            <DialogDescription className='flex flex-wrap items-center justify-center gap-1 text-sm font-semibold text-black md:justify-start lg:text-lg'>
              <span className='whitespace-nowrap'>Order Details:</span>{' '}
              <span className='flex items-center whitespace-nowrap'>
                {title}{' '}
                <Link
                  href={`user-management/${userId}?tab=orders`}
                  className='p-2 text-primary transition-colors duration-200 hover:text-blue-600'
                >
                  <FcInfo className='h-5 w-5' />
                </Link>
              </span>
            </DialogDescription>
          </DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
          {/* Search by Order ID */}
          <Input
            placeholder='Search by Order ID'
            value={searchOrderId}
            onChange={(e) => setSearchOrderId(e.target.value)}
            className='w-full'
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
              {['CREATED', 'PENDING', 'PAID', 'FAILED', 'UNKNOWN'].map(
                (status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>

          {/* Search by Created At Date */}
          <OrderDatePicker
            selected={createdAtSearch}
            onSelect={(date) => setCreatedAtSearch(date)}
            className='w-full'
          />

          {/* Reset Button */}
          <Button variant='secondary' onClick={resetFilters} className='w-full'>
            Reset
          </Button>
        </div>

        <Card className='no-scrollbar mx-auto w-full overflow-scroll rounded-md border-none p-0 shadow-none sm:w-full sm:max-w-full'>
          {paginatedOrders.length > 0 ? (
            <>
              <Table className='min-w-4xl mb-4 rounded-md border text-[10px] shadow lg:text-xs'>
                <TableHeader>
                  <TableRow className='divide-x bg-muted p-3'>
                    {[
                      '#',
                      'Order ID',
                      'Service Name',
                      'Service Type',
                      'Quantity',
                      'Unlocked Credits',
                      'Price',
                      'Discount',
                      'Total Price (incl. gst)',
                      'Created At',
                      'Status',
                    ].map((header) => (
                      <TableHead
                        key={header}
                        className={`whitespace-nowrap p-3 text-left font-semibold text-foreground ${header === 'Price' ? 'text-center' : ''} ${
                          header === 'Created At' ? 'cursor-pointer' : ''
                        }`}
                        onClick={
                          header === 'Created At'
                            ? toggleSortDirection
                            : undefined
                        }
                      >
                        {header}
                        {header === 'Created At' && (
                          <span className='ml-2'>
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map((order, index) => (
                    <React.Fragment key={order.orderId}>
                      {order.items.map((item, itemIndex: number) => (
                        <TableRow
                          key={`${order._id}-item-${itemIndex}`}
                          className={`divide-x text-left ${
                            index % 2 !== 0 ? 'bg-muted/50' : 'hover:bg-card'
                          }`}
                        >
                          {itemIndex === 0 && (
                            <TableCell
                              className='p-3'
                              rowSpan={order.items.length}
                            >
                              {currentPage * ordersPerPage -
                                ordersPerPage +
                                index +
                                1}
                            </TableCell>
                          )}
                          {itemIndex === 0 && (
                            <TableCell
                              className='p-3'
                              rowSpan={order.items.length}
                            >
                              {order.orderId}
                            </TableCell>
                          )}
                          <TableCell className='border-l p-3'>
                            {item.serviceName}
                          </TableCell>
                          <TableCell className='p-3'>
                            {item.serviceType}
                          </TableCell>
                          <TableCell className='p-3 text-center'>
                            {item.quantity}
                          </TableCell>
                          <TableCell className='flex flex-col justify-start gap-1 p-3'>
                            <span>
                              {formatUnlockCredits(
                                item.customAttributes?.bulkUnlockCredits,
                                item.customAttributes?.companyUnlockCredits
                              )}
                            </span>
                            <span className='text-[10px] text-muted-foreground'>
                              {item.customAttributes?.companyId
                                ? `CIN: ${item.customAttributes?.companyId}`
                                : ''}
                            </span>
                          </TableCell>

                          <TableCell className='whitespace-nowrap p-3 text-right'>
                            {formatPrice(item.price, item.currency)}
                          </TableCell>
                          {itemIndex === 0 && (
                            <TableCell
                              className='whitespace-nowrap p-3 text-right'
                              rowSpan={order.items.length}
                            >
                              {formatDiscountAmount(
                                order.discount_amount,
                                item.currency
                              )}
                            </TableCell>
                          )}
                          {itemIndex === 0 && (
                            <TableCell
                              className='whitespace-nowrap p-3 text-right'
                              rowSpan={order.items.length}
                            >
                              {determineCurrencyLabel(order.items) === 'USD'
                                ? '$'
                                : '₹'}
                              {(order.value + order.gst).toLocaleString()}{' '}
                              {determineCurrencyLabel(order.items)}
                            </TableCell>
                          )}

                          {itemIndex === 0 && (
                            <TableCell
                              className='whitespace-nowrap p-3'
                              rowSpan={order.items.length}
                            >
                              {format(new Date(order.createdAt), 'dd-MMM-yyyy')}
                            </TableCell>
                          )}
                          {itemIndex === 0 && (
                            <TableCell
                              className='p-3'
                              rowSpan={order.items.length}
                            >
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                  order.status === 'PAID'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {order.status}
                              </span>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </React.Fragment>
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
            <div className='flex flex-col items-center p-3'>
              <p className='mb-4 text-center text-muted-foreground'>
                No orders available
              </p>
            </div>
          )}
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
