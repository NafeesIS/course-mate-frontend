'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ChevronRight, Circle, FileText, ShoppingBag } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { OrderDatePicker } from '../../_components/OrderDatePicker';
import { formatUnlockCredits } from '../../_components/OrderDetailsDialog';
import { ISingleUserData } from '../../_types/types';

export function formatCurrency(
  amount: number,
  currency: string = 'INR',
  locale: string = 'en-IN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

const OrdersTab = ({ userData }: { userData: ISingleUserData }) => {
  const { orders } = userData;
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOrderId, setSearchOrderId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [createdAtFilter, setCreatedAtFilter] = useState<Date | undefined>();
  type SortableOrderField = 'createdAt';
  const [sortColumn, setSortColumn] = useState<SortableOrderField>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [ordersPerPage] = useState(5);

  const toggleRow = (orderId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(orderId)) {
      newExpandedRows.delete(orderId);
    } else {
      newExpandedRows.add(orderId);
    }
    setExpandedRows(newExpandedRows);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'text-green-500';
      case 'CREATED':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const filteredAndSortedOrders = useMemo(() => {
    let filteredOrders = orders;

    // Filter by Order ID
    if (searchOrderId) {
      filteredOrders = filteredOrders.filter((order) =>
        order.orderId.toLowerCase().includes(searchOrderId.toLowerCase())
      );
    }

    // Filter by Status
    if (statusFilter) {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === statusFilter
      );
    }

    // Filter by Created Date
    if (createdAtFilter) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          format(new Date(order.createdAt), 'yyyy-MM-dd') ===
          format(createdAtFilter, 'yyyy-MM-dd')
      );
    }

    // Sort by selected column
    if (sortColumn) {
      if (sortColumn === 'createdAt') {
        filteredOrders.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        });
      }
    }

    return filteredOrders;
  }, [
    orders,
    searchOrderId,
    statusFilter,
    createdAtFilter,
    sortColumn,
    sortDirection,
  ]);

  const totalOrders = filteredAndSortedOrders.length;
  const totalPages = Math.ceil(totalOrders / ordersPerPage);
  const paginatedOrders = filteredAndSortedOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const resetFilters = () => {
    setSearchOrderId('');
    setStatusFilter('');
    setCreatedAtFilter(undefined);
    setSortColumn('createdAt');
    setSortDirection('desc');
    setCurrentPage(1);
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [searchOrderId, statusFilter, createdAtFilter, sortDirection, sortColumn]);

  if (!orders || orders.length === 0) {
    return (
      <Card className='mx-auto mt-10 max-w-3xl'>
        <CardContent className='p-6 text-center'>
          <FileText className='mx-auto h-12 w-12 text-muted-foreground opacity-50' />
          <h3 className='mt-4 text-lg font-semibold'>No orders Found</h3>
          <p className='text-sm text-muted-foreground'>
            The user has not ordered anything yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='w-full'>
      <CardHeader className='p-0 px-2 pb-0 pt-3 md:p-0 md:px-5 md:pt-4'>
        <CardTitle className='flex items-center justify-start gap-2 text-lg font-bold md:text-xl'>
          <ShoppingBag className='h-5 w-5' /> Orders
        </CardTitle>
      </CardHeader>
      <CardContent className='px-2 py-3 md:p-5'>
        {/* Filters */}
        <div className='mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4'>
          <Input
            placeholder='Search by Order ID'
            value={searchOrderId}
            onChange={(e) => setSearchOrderId(e.target.value)}
          />
          <Select
            onValueChange={(value) =>
              setStatusFilter(value === 'ALL' ? '' : value)
            }
            value={statusFilter || 'ALL'}
          >
            <SelectTrigger>
              <SelectValue placeholder='Filter by Status' />
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
          <OrderDatePicker
            selected={createdAtFilter}
            onSelect={(date) => setCreatedAtFilter(date)}
          />
          <Button onClick={resetFilters} variant='secondary' className='h-9'>
            Reset
          </Button>
        </div>

        <Table className='border text-xs sm:text-sm'>
          <TableHeader>
            <TableRow className='divide-x bg-muted'>
              <TableHead
                className='translate-x-8 cursor-pointer whitespace-nowrap p-4 font-semibold'
                onClick={() => {
                  setSortColumn('createdAt');
                  setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                }}
              >
                Order Date{' '}
                {sortColumn === 'createdAt'
                  ? sortDirection === 'asc'
                    ? '↑'
                    : '↓'
                  : '↕'}
              </TableHead>
              <TableHead className='whitespace-nowrap p-4 font-semibold'>
                Order ID
              </TableHead>

              <TableHead className='whitespace-nowrap p-4 font-semibold'>
                Status
              </TableHead>
              <TableHead className='whitespace-nowrap p-4 font-semibold'>
                GST Number
              </TableHead>
              <TableHead className='whitespace-nowrap p-4 font-semibold'>
                Currency
              </TableHead>
              <TableHead
                className='cursor-pointer whitespace-nowrap p-4 text-right font-semibold'
                // onClick={() => {
                //   setSortColumn('value');
                //   setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                // }}
              >
                Value{' '}
                {/* {sortColumn === 'value'
                  ? sortDirection === 'asc'
                    ? '↑'
                    : '↓'
                  : '↕'} */}
              </TableHead>
              <TableHead
                className='cursor-pointer whitespace-nowrap p-4 text-right font-semibold'
                // onClick={() => {
                //   setSortColumn('gst');
                //   setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                // }}
              >
                GST{' '}
                {/* {sortColumn === 'gst'
                  ? sortDirection === 'asc'
                    ? '↑'
                    : '↓'
                  : '↕'} */}
              </TableHead>
              <TableHead className='whitespace-nowrap p-4 text-right font-semibold'>
                Discount
              </TableHead>
              <TableHead className='whitespace-nowrap p-4 text-right font-semibold'>
                Total Price
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order, index: number) => (
                <React.Fragment key={order._id}>
                  <TableRow
                    className={`cursor-pointer divide-x hover:bg-muted/50 ${
                      index % 2 !== 0 ? 'bg-muted/50' : ''
                    }`}
                    onClick={() => toggleRow(order.orderId)}
                  >
                    <TableCell className='whitespace-nowrap p-4'>
                      <div className='flex items-center gap-2'>
                        <ChevronRight
                          className={`transition-transform ${
                            expandedRows.has(order.orderId) ? 'rotate-90' : ''
                          }`}
                        />
                        {format(
                          new Date(order.createdAt),
                          'dd MMM yyyy, hh:mm a'
                        )}
                      </div>
                    </TableCell>
                    <TableCell className='p-4'>{order.orderId}</TableCell>

                    <TableCell className='p-4'>
                      <div className='flex items-center gap-2'>
                        <Circle
                          className={`h-2 w-2 fill-current ${getStatusColor(
                            order.status
                          )}`}
                        />
                        {order.status}
                      </div>
                    </TableCell>
                    <TableCell className='p-4'>
                      {order.gstNumber || '-'}
                    </TableCell>
                    <TableCell className='p-4'>{order.currency}</TableCell>
                    <TableCell className='p-4 text-right'>
                      {formatCurrency(order.value, order.currency)}
                    </TableCell>
                    <TableCell className='p-4 text-right'>
                      {formatCurrency(order.gst, order.currency)}
                    </TableCell>
                    <TableCell className='p-4 text-right'>
                      {formatCurrency(order.discount_amount, order.currency)}
                    </TableCell>
                    <TableCell className='p-4 text-right'>
                      {formatCurrency(order.gst + order.value, order.currency)}
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(order.orderId) && (
                    <TableRow className='text-xs shadow-inner sm:text-sm'>
                      <TableCell colSpan={9} className='p-0'>
                        <div
                          className={`space-y-4 ${
                            index % 2 !== 0 ? 'bg-muted/50' : 'hover:bg-card'
                          } p-4`}
                        >
                          <h4 className='font-semibold'>Order Items</h4>
                          <Table className='text-xs sm:text-sm'>
                            <TableHeader>
                              <TableRow className='divide-x'>
                                <TableHead className='whitespace-nowrap p-4'>
                                  #
                                </TableHead>
                                <TableHead className='whitespace-nowrap p-4'>
                                  Service Name
                                </TableHead>
                                <TableHead className='whitespace-nowrap p-4'>
                                  Type
                                </TableHead>
                                <TableHead className='whitespace-nowrap p-4'>
                                  Unlocked Credits
                                </TableHead>
                                <TableHead className='whitespace-nowrap p-4'>
                                  Plan
                                </TableHead>
                                <TableHead className='whitespace-nowrap p-4'>
                                  Quantity
                                </TableHead>
                                <TableHead className='whitespace-nowrap p-4 text-right'>
                                  Item Price
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {order.items.map((item, index: number) => (
                                <TableRow key={index} className='divide-x'>
                                  <TableCell className='p-4'>
                                    {index + 1}
                                  </TableCell>
                                  <TableCell className='p-4'>
                                    {item.serviceName}
                                  </TableCell>
                                  <TableCell className='p-4'>
                                    {item.serviceType || '-'}
                                  </TableCell>
                                  <TableCell className='flex flex-col justify-start gap-1 p-4'>
                                    <span>
                                      {formatUnlockCredits(
                                        item.customAttributes
                                          ?.bulkUnlockCredits,
                                        item.customAttributes
                                          ?.companyUnlockCredits
                                      )}
                                    </span>
                                    <span className='text-[10px] text-muted-foreground'>
                                      {item.customAttributes?.companyId
                                        ? `CIN: ${item.customAttributes?.companyId}`
                                        : ''}
                                    </span>
                                  </TableCell>

                                  <TableCell className='p-4'>
                                    {item.customAttributes
                                      ? item?.customAttributes?.plan
                                        ? item?.customAttributes?.plan
                                        : '-'
                                      : '-'}
                                  </TableCell>
                                  <TableCell className='p-4'>
                                    {item.quantity}
                                  </TableCell>
                                  <TableCell className='p-4 text-right'>
                                    {formatCurrency(item.price, item.currency)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          {/* Coupon Details */}
                          {order.coupon && (
                            <div className='mt-4'>
                              <h5 className='mb-2 font-semibold'>
                                Coupon Details
                              </h5>
                              <div className='flex items-center justify-start gap-4 text-xs sm:text-sm'>
                                <p>
                                  <span className='text-muted-foreground'>
                                    Code:
                                  </span>{' '}
                                  {order.coupon.code}
                                </p>
                                <p className='capitalize'>
                                  <span className='text-muted-foreground'>
                                    Type:
                                  </span>{' '}
                                  {order.coupon.type}
                                </p>
                                <p>
                                  <span className='text-muted-foreground'>
                                    Value:
                                  </span>{' '}
                                  {order.coupon.type === 'percentage'
                                    ? `${order.coupon.value}%`
                                    : formatCurrency(
                                        order.coupon.value,
                                        order?.currency
                                      )}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className='p-6 text-center'>
                  <p className='mb-4 text-muted-foreground'>
                    No orders available
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
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
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
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
      </CardContent>
    </Card>
  );
};

export default OrdersTab;
