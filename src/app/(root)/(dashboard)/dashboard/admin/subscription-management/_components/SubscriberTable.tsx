'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  differenceInDays,
  isWithinInterval,
  parseISO,
  startOfDay,
} from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import {
  ISubscriberTableProps,
  IUserServiceSubscription,
} from '../_types/types';
import { DateRangePicker } from './DateRangePicker';
import SubscriberColumnVisibilitySelector from './SubscriberColumnVisibilitySelector';

const OrderIdCell = ({ orderId }: { orderId: string }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`cursor-pointer truncate whitespace-nowrap hover:text-primary ${expanded ? 'max-w-full' : 'max-w-28'}`}
      title={!expanded ? orderId : undefined}
      onClick={() => setExpanded(!expanded)} // Toggle on click
    >
      {orderId}
    </div>
  );
};

const FILTER_FIELDS = {
  plan: ['monthly', 'annually', 'quarterly', 'trial'],
  options: ['All', 'West', 'East', 'North', 'South'].map(
    (option) => `${option} India`
  ),
  status: ['active', 'inactive', 'trial', 'expired', 'grace'],
  product: [
    'New Company Alert - Email Only',
    'New Company Alert - Email and Phone',
  ],
};

export const columns: ColumnDef<IUserServiceSubscription>[] = [
  {
    accessorFn: (row) =>
      `${row.userId?.meta_data?.firstName || ''} ${row.userId?.meta_data?.lastName || ''}`.trim(),
    id: 'Name',
    header: 'Name',
    cell: ({ row }) => {
      const { firstName, lastName } = row.original.userId.meta_data || {};
      return (
        <div className='whitespace-nowrap'>
          {`${firstName || ''} ${lastName || ''}`.trim() || 'N/A'}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.userId?.emails?.[0] || 'N/A',
    id: 'Email',
    header: 'Email',
    cell: ({ row }) => <div>{row.original.userId?.emails?.[0] || 'N/A'}</div>,
  },
  {
    accessorFn: (row) => row.userId?.meta_data?.mobileNumber || 'N/A',
    id: 'Phone',
    header: 'Phone',
    cell: ({ row }) => (
      <div>{row.original.userId?.meta_data?.mobileNumber || 'N/A'}</div>
    ),
    meta: { isVisible: false },
  },
  {
    accessorFn: (row) => row.orderId || 'N/A',
    id: 'Order Id',
    header: 'Order Id',
    cell: ({ row }) => <OrderIdCell orderId={row.original.orderId || 'N/A'} />,
  },
  {
    accessorFn: (row) => row.serviceId?.name || 'N/A',
    id: 'Product',
    header: 'Product',
    cell: ({ row }) => {
      const productName = row.original.serviceId?.name || 'N/A';

      // Remove "New Company Alert -" and replace " and " with " & "
      const formattedName = productName
        .replace('New Company Alert -', '') // Remove prefix
        .replace(/ and /g, ' & '); // Replace " and " with " & "

      return <div className='whitespace-nowrap'>{formattedName}</div>;
    },
  },

  {
    accessorKey: 'plan',
    header: 'Plan',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('plan')}</div>,
  },
  {
    accessorKey: 'Options',
    header: 'Options',
    cell: ({ row }) => {
      const options = row.original?.options;
      const optionsText =
        options && options.length > 0 ? options.join(' + ') + ' India' : 'N/A';
      return <div className='whitespace-nowrap'>{optionsText}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <span
        className={`${
          row.getValue('status') === 'active'
            ? 'text-green-600'
            : row.getValue('status') === 'inactive'
              ? 'text-yellow-600'
              : row.getValue('status') === 'trial'
                ? 'text-purple-600'
                : 'text-red-600'
        } font-medium capitalize`}
      >
        {row.getValue('status')}
      </span>
    ),
  },
  {
    accessorFn: (row) => (row.startDate ? new Date(row.startDate) : null),
    id: 'startDate',
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='flex cursor-pointer items-center space-x-2'
      >
        <span>Start Date</span>
        {column.getIsSorted() === 'asc' && <span>↑</span>}
        {column.getIsSorted() === 'desc' && <span>↓</span>}
        {!column.getIsSorted() && <span>↕</span>} {/* Default unsorted icon */}
      </div>
    ),
    sortingFn: 'datetime',
    cell: ({ row }) => (
      <div className='whitespace-nowrap'>
        {row.original?.startDate
          ? formatInTimeZone(
              row.original.startDate,
              'Asia/Kolkata',
              'dd-MMM-yyyy'
            )
          : 'N/A'}
      </div>
    ),
  },
  {
    accessorFn: (row) => (row.endDate ? new Date(row.endDate) : null),
    id: 'endDate',
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='flex cursor-pointer items-center space-x-2'
      >
        <span>End Date</span>
        {column.getIsSorted() === 'asc' && <span>↑</span>}
        {column.getIsSorted() === 'desc' && <span>↓</span>}
        {!column.getIsSorted() && <span>↕</span>} {/* Default unsorted icon */}
      </div>
    ),
    sortingFn: 'datetime',
    cell: ({ row }) => (
      <div className='whitespace-nowrap'>
        {row.original?.endDate
          ? formatInTimeZone(
              row.original.endDate,
              'Asia/Kolkata',
              'dd-MMM-yyyy'
            )
          : 'N/A'}
      </div>
    ),
  },
  {
    accessorKey: 'Actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className='flex justify-center'>
        <Button
          variant='outline'
          className='h-6 duration-300 hover:bg-primary hover:text-white'
          size='sm'
        >
          <Link
            href={`user-management/${row.original.userId?._id}?tab=subscriptions`}
          >
            view
          </Link>
        </Button>
      </div>
    ),
  },
];

export default function SubscriberTable({
  subscribers,
  filters,
  setFilters,
  setSelectedStatus,
}: ISubscriberTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [resetSignal, setResetSignal] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'startDate', desc: true },
  ]);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      plan: '',
      product: '',
      options: '',
      status: '',
      startDate: '',
      endDate: '',
      expirationDays: '',
      startRange: '',
      endRange: '',
    });
    setGlobalFilter('');
    setSelectedStatus('');
    setResetSignal(true);
    setTimeout(() => setResetSignal(false), 0);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setFilters((prev) => ({
      ...prev,
      startRange: range?.from ? range.from.toISOString() : '',
      endRange: range?.to ? range.to.toISOString() : '',
    }));
  };

  const filteredData = useMemo(() => {
    const today = startOfDay(new Date());
    return subscribers.filter((subscriber) => {
      const endDate = subscriber.endDate
        ? startOfDay(parseISO(subscriber.endDate))
        : null;
      const startRange = filters.startRange
        ? startOfDay(parseISO(filters.startRange))
        : null;
      const endRange = filters.endRange
        ? startOfDay(parseISO(filters.endRange))
        : null;
      const expiresInDays =
        filters.expirationDays && endDate
          ? differenceInDays(endDate, today)
          : null;
      const inRange =
        endDate && startRange && endRange
          ? isWithinInterval(endDate, { start: startRange, end: endRange })
          : endDate && startRange
            ? endDate <= startRange
            : true;

      return (
        (!filters.plan || subscriber.plan === filters.plan) &&
        (!filters.product || subscriber.serviceId.name === filters.product) &&
        (!filters.options ||
          subscriber.options.includes(filters.options.replace(' India', ''))) &&
        (!filters.status || subscriber.status === filters.status) &&
        (!filters.expirationDays ||
          (expiresInDays !== null &&
            expiresInDays <= Number(filters.expirationDays))) &&
        (!endDate || inRange)
      );
    });
  }, [filters, subscribers]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter, sorting, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <Card className='w-full bg-white shadow-sm'>
      <CardContent className='p-4 sm:p-6'>
        {/* Search and Filter Controls */}
        <div className='mb-1 flex flex-col gap-4'>
          <div className='flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            {/* Search Input - Full width on all screens */}
            <div className='relative w-full md:max-w-md'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
              <Input
                placeholder='Search by name, email, phone, orderId...'
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className='w-full border-gray-200 bg-gray-50 pl-10 pr-10 focus:border-blue-500 focus:ring-blue-500'
              />
              {globalFilter && (
                <button
                  onClick={() => setGlobalFilter('')}
                  className='absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-100'
                  aria-label='Clear search'
                >
                  <X className='h-4 w-4 text-gray-400' />
                </button>
              )}
            </div>

            {/* Buttons Container - Full width on mobile, auto width on md+ screens */}
            <div className='flex w-full flex-row gap-2 md:items-center md:justify-end md:gap-3'>
              <SubscriberColumnVisibilitySelector table={table} />
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant='outline'
                size={'sm'}
                className='flex w-full items-center justify-center gap-2 duration-300 hover:bg-primary hover:text-white md:w-auto'
              >
                <SlidersHorizontal className='h-4 w-4' />
                Filters
                {activeFiltersCount > 0 && (
                  <span className='ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600'>
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
              <Button
                onClick={resetFilters}
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
            className={`overflow-hidden duration-300 ${showFilters ? 'h-[410px] md:h-[185px] lg:h-28' : 'h-0'}`}
          >
            <div className='grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-3 lg:grid-cols-5'>
              {Object.keys(FILTER_FIELDS).map((field) => (
                <div key={field}>
                  <p className='mb-2 text-xs font-medium capitalize text-black xl:text-[13px]'>
                    Select {field}
                  </p>
                  <Select
                    value={filters[field as keyof typeof filters] || 'all'}
                    onValueChange={(value) =>
                      handleFilterChange(field, value === 'all' ? '' : value)
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        'bg-white capitalize',
                        filters[field as keyof typeof filters] &&
                          filters[field as keyof typeof filters] !== 'all'
                          ? 'border-blue-500 bg-blue-100' // Highlight when a non-default option is selected
                          : 'bg-transparent text-muted-foreground hover:bg-white'
                      )}
                    >
                      <SelectValue placeholder={`All ${field}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>{`All ${field}`}</SelectItem>
                      {FILTER_FIELDS[field as keyof typeof FILTER_FIELDS].map(
                        (option) => (
                          <SelectItem
                            key={option}
                            value={option}
                            className='capitalize'
                          >
                            {option
                              .replace('New Company Alert -', '') // Remove prefix
                              .replace(/ and /g, ' & ')}{' '}
                            {/* Replace " and " with " & " */}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              ))}
              <div>
                <p className='mb-2 text-xs font-medium text-black xl:text-[13px]'>
                  Select Date Range
                </p>
                <DateRangePicker
                  value={{
                    from: filters.startRange
                      ? new Date(filters.startRange)
                      : undefined,
                    to: filters.endRange
                      ? new Date(filters.endRange)
                      : undefined,
                  }}
                  onChange={handleDateRangeChange}
                  resetSignal={resetSignal}
                  onApplySort={(field, order) => {
                    setSorting([{ id: field, desc: order === 'asc' }]);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className='overflow-hidden rounded-lg border border-gray-200'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className='bg-muted hover:bg-gray-50'
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className='px-4 py-4 text-xs font-medium text-gray-700 sm:text-sm'
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={`border-t border-gray-200 hover:bg-gray-50 ${index % 2 !== 0 ? 'bg-muted/50' : 'hover:bg-card'}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className='px-4 py-4 text-xs text-gray-900 sm:text-sm'
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center text-gray-500'
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className='mt-4 text-xs'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    table.previousPage();
                  }}
                  className={`p-1 text-[10px] sm:p-2 sm:text-sm ${
                    !table.getCanPreviousPage()
                      ? 'cursor-not-allowed opacity-50'
                      : ''
                  }`}
                />
              </PaginationItem>
              {Array.from({ length: table.getPageCount() }, (_, i) => {
                if (
                  i === 0 ||
                  i === table.getPageCount() - 1 ||
                  (i >= table.getState().pagination.pageIndex - 1 &&
                    i <= table.getState().pagination.pageIndex + 1)
                ) {
                  return (
                    <PaginationItem key={i}>
                      <PaginationLink
                        className='h-auto w-auto px-1.5 py-1 text-[10px] sm:px-2.5 sm:py-1.5 sm:text-sm'
                        href='#'
                        isActive={table.getState().pagination.pageIndex === i}
                        onClick={(e) => {
                          e.preventDefault();
                          table.setPageIndex(i);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                if (
                  i === table.getState().pagination.pageIndex - 2 ||
                  i === table.getState().pagination.pageIndex + 2
                ) {
                  return (
                    <PaginationItem key={`ellipsis-${i}`}>
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
                    table.nextPage();
                  }}
                  className={`p-1 text-[10px] sm:p-2 sm:text-sm ${
                    !table.getCanNextPage()
                      ? 'cursor-not-allowed opacity-50'
                      : ''
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}
