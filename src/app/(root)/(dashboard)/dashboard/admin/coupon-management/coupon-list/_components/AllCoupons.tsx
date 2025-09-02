'use client';

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
import { format } from 'date-fns';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { TCoupon } from '../_types/types';
import { ActionDeleteDialog } from './ActionDeleteDialog';
import { ActionUpdateDialog } from './ActionUpdateDialog';
import CouponColumnVisibilitySelector from './ColumnVisibilitySelector';
import { DateInput } from './DateInput';
import ValidServicesDialog from './ValidServicesDialog';
import ValidUsersDialog from './ValidUsersDialog';

const booleanFilterFn = (row: any, columnId: string, filterValue: string) => {
  if (filterValue === 'true') return row.getValue(columnId) === true;
  if (filterValue === 'false') return row.getValue(columnId) === false;
  return true; // Show all rows if filterValue is 'all' or empty
};

const FILTER_FIELDS = {
  type: ['flat', 'percentage'],
  isActive: ['true', 'false'],
};

export default function AllCoupons({
  data,
  fetchCoupons,
}: {
  data: TCoupon[];
  fetchCoupons: () => void;
}) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'expiryDate', desc: true },
  ]);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState({
    createdDate: '',
    expiryDate: '',
    type: '',
    isActive: '',
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      createdDate: '',
      expiryDate: '',
      type: '',
      isActive: '',
    });
    setGlobalFilter('');
  };

  const filteredData = useMemo(() => {
    return data.filter((coupon) => {
      const createdDateMatch =
        !filters.createdDate ||
        format(coupon.createdAt, 'yyyy-MM-dd') === filters.createdDate;
      const expiryDateMatch =
        !filters.expiryDate ||
        format(coupon.expiryDate, 'yyyy-MM-dd') === filters.expiryDate;

      return (
        createdDateMatch &&
        expiryDateMatch &&
        (!filters.type || coupon.type === filters.type) &&
        (!filters.isActive || coupon.isActive.toString() === filters.isActive)
      );
    });
  }, [filters, data]);

  const columns: ColumnDef<TCoupon>[] = [
    {
      id: 'serial',
      header: '#',
      cell: ({ table, row }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        const currentRows = table.getRowModel().rows;
        const visibleRowIndex = currentRows.findIndex((r) => r.id === row.id);
        return (
          <span className='font-normal text-foreground'>
            {pageIndex * pageSize + visibleRowIndex + 1}
          </span>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => (
        <span className='font-normal text-foreground'>
          {row.getValue('code')}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <span className='capitalize text-foreground'>
          {row.getValue('type')}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'value',
      header: 'Value',
      cell: ({ row }) => (
        <span className='text-foreground'>
          {row.original.type === 'percentage'
            ? `${row.getValue('value')}%`
            : `₹${row.getValue('value')}`}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'minimumOrderValue',
      header: 'Min Order Value',
      cell: ({ row }) => (
        <span className='text-foreground'>
          {row.getValue('minimumOrderValue')
            ? `₹${row.getValue('minimumOrderValue')}`
            : '-'}
        </span>
      ),
      meta: { isVisible: false },
      enableSorting: false,
    },
    {
      accessorKey: 'maxRedemptions',
      header: 'Max Redemptions',
      cell: ({ row }) => (
        <span className='text-foreground'>
          {row.getValue('maxRedemptions')}
        </span>
      ),
      meta: { isVisible: false },
      enableSorting: false,
    },
    {
      accessorKey: 'redemptions',
      header: 'Redemptions Count',
      cell: ({ row }) => (
        <span className='text-center text-foreground'>
          {row.getValue('redemptions')}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'maxRedemptionsPerUser',
      header: 'Per User Limit',
      cell: ({ row }) => (
        <span className='text-foreground'>
          {row.getValue('maxRedemptionsPerUser')}
        </span>
      ),
      meta: { isVisible: false },
      enableSorting: true,
    },
    {
      accessorKey: 'isActive',
      header: 'Active Coupon',
      cell: ({ row }) => (
        <span className='text-foreground'>
          {row.getValue('isActive') ? 'Yes' : 'No'}
        </span>
      ),
      enableSorting: false,
      filterFn: booleanFilterFn,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => (
        <span className='text-foreground'>
          {format(row.getValue('createdAt'), 'dd-MMM-yyyy')}
        </span>
      ),
      meta: { isVisible: false },
      enableSorting: true,
    },
    {
      accessorKey: 'expiryDate',
      header: 'Expiry Date',
      cell: ({ row }) => (
        <span className='text-foreground'>
          {format(row.getValue('expiryDate'), 'dd-MMM-yyyy')}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'isFirstTimeUser',
      header: 'First Time User',
      cell: ({ row }) => (
        <span className='text-foreground'>
          {row.getValue('isFirstTimeUser') ? 'Yes' : 'No'}
        </span>
      ),
      meta: { isVisible: false },
      filterFn: booleanFilterFn,
      enableSorting: false,
    },
    {
      accessorKey: 'createdBy',
      header: 'Created By',
      cell: ({ row }) => (
        <span className='font-normal text-foreground'>
          {row.getValue('createdBy')}
        </span>
      ),
      meta: { isVisible: false },
      enableSorting: false,
    },
    {
      accessorKey: 'validUsers',
      header: 'Eligible Users',
      cell: ({ row }) => (
        <span className='text-foreground'>
          {row.original.validUsers && row.original.validUsers.length > 0 ? (
            <ValidUsersDialog
              title='Applicable Users Information'
              validUsers={row.original.validUsers}
            />
          ) : (
            'All Users'
          )}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'usedBy',
      header: 'Coupon Users',
      cell: ({ row }) => (
        <span className='text-foreground'>
          {row.original.usedBy && row.original.usedBy.length > 0 ? (
            <ValidUsersDialog
              title='Users Who Applied This Coupon Code'
              validUsers={row.original.usedBy}
            />
          ) : (
            '-'
          )}
        </span>
      ),
      meta: { isVisible: false },
      enableSorting: false,
    },
    {
      accessorKey: 'validServices',
      header: 'Applicable Services',
      cell: ({ row }) => (
        <span className='text-foreground'>
          {row.original.validServices &&
          row.original.validServices.length > 0 ? (
            <ValidServicesDialog validServices={row.original.validServices} />
          ) : (
            'All Services'
          )}
        </span>
      ),
      meta: { isVisible: false },
      enableSorting: false,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className='flex gap-2'>
          <ActionDeleteDialog
            data={{
              code: row.original.code,
              redemptions: row.original.redemptions,
            }}
            fetchCoupons={fetchCoupons}
          />
          <ActionUpdateDialog data={row.original} fetchCoupons={fetchCoupons} />
        </div>
      ),
      enableSorting: false,
    },
  ];

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
    <Card className='px-2 py-3 md:p-5'>
      {/* Search and Filter Controls */}
      <div className='mb-1 flex flex-col gap-4'>
        <div className='flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          {/* Search Input - Full width on all screens */}
          <div className='relative w-full md:max-w-md'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              placeholder='Search by coupon code, type, value...'
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className='h-9 w-full border-gray-200 bg-gray-50 pl-10 pr-10 focus:ring-blue-500'
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
            <CouponColumnVisibilitySelector table={table} />
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
          className={`overflow-hidden duration-300 ${showFilters ? 'mb-4 h-80 sm:mb-2 sm:h-44 lg:-mb-1 lg:h-28' : 'h-0'}`}
        >
          <div className='grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-4'>
            {/* Created Date Filter */}
            <div className='flex flex-col gap-2'>
              <p className='text-xs font-medium capitalize text-black xl:text-[13px]'>
                Select Created Date
              </p>
              <DateInput
                selected={filters.createdDate}
                onSelect={(date) =>
                  handleFilterChange('createdDate', date || '')
                }
                placeholderText='Pick Created Date'
                className={`w-full ${filters.createdDate ? 'border-blue-500 bg-blue-100' : 'bg-transparent'}`}
              />
            </div>

            {/* Expiry Date Filter */}
            <div className='flex flex-col gap-2'>
              <p className='text-xs font-medium capitalize text-black xl:text-[13px]'>
                Select Expiry Date
              </p>
              <DateInput
                selected={filters.expiryDate}
                onSelect={(date) =>
                  handleFilterChange('expiryDate', date || '')
                }
                placeholderText='Pick Expiry Date'
                className={`w-full ${filters.expiryDate ? 'border-blue-500 bg-blue-100' : 'bg-transparent'}`}
              />
            </div>

            {/* Other Filters */}
            {Object.keys(FILTER_FIELDS).map((field) => (
              <div key={field}>
                <p className='mb-2 text-xs font-medium capitalize text-black xl:text-[13px]'>
                  Select Coupon {field}
                </p>
                <Select
                  value={filters[field as keyof typeof filters] || ''}
                  onValueChange={(value) => handleFilterChange(field, value)}
                >
                  <SelectTrigger
                    className={cn(
                      'bg-white capitalize',
                      filters[field as keyof typeof filters]
                        ? 'border-blue-500 bg-blue-100' // Highlight when a non-default option is selected
                        : 'bg-transparent text-muted-foreground hover:bg-white'
                    )}
                  >
                    <SelectValue placeholder={`Coupon ${field}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {FILTER_FIELDS[field as keyof typeof FILTER_FIELDS].map(
                      (option) => (
                        <SelectItem
                          key={option}
                          value={option}
                          className='capitalize'
                        >
                          {option}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}

      <Table className='rounded-md border text-xs sm:text-sm'>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className='divide-x whitespace-nowrap bg-muted hover:bg-gray-50'
            >
              {headerGroup.headers.map((header) => {
                // Determine alignment based on column header or ID
                const headerText = header.column.columnDef.header;
                const alignmentClass =
                  headerText === 'Redemptions Count' ||
                  headerText === 'Max Redemptions' ||
                  headerText === 'Per User Limit' ||
                  headerText === 'Active Coupon' ||
                  headerText === 'First Time User'
                    ? 'text-center'
                    : headerText === 'Value' || headerText === 'Min Order Value'
                      ? 'text-right'
                      : 'text-left';

                return (
                  <TableHead
                    key={header.id}
                    className={`px-3 py-2.5 text-xs font-medium text-gray-700 sm:text-sm ${alignmentClass}`}
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    style={{
                      cursor: header.column.getCanSort()
                        ? 'pointer'
                        : 'default',
                    }}
                  >
                    <div className='flex items-center justify-between'>
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                      {header.column.getCanSort() && (
                        <div className='ml-1'>
                          {header.column.getIsSorted() === 'asc' && (
                            <span>↑</span>
                          )}
                          {header.column.getIsSorted() === 'desc' && (
                            <span>↓</span>
                          )}
                          {!header.column.getIsSorted() && <span>↕</span>}
                        </div>
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                className={`divide-x whitespace-nowrap border-t border-gray-200 hover:bg-gray-50 ${index % 2 !== 0 ? 'bg-muted/50' : 'hover:bg-card'}`}
              >
                {row.getVisibleCells().map((cell) => {
                  // Determine alignment based on column header or ID
                  const headerText = cell.column.columnDef.header;
                  const alignmentClass =
                    headerText === 'Redemptions Count' ||
                    headerText === 'Max Redemptions' ||
                    headerText === 'Per User Limit' ||
                    headerText === 'Active Coupon' ||
                    headerText === 'First Time User'
                      ? 'text-center'
                      : headerText === 'Value' ||
                          headerText === 'Min Order Value'
                        ? 'text-right'
                        : 'text-left';

                  return (
                    <TableCell
                      key={cell.id}
                      className={`px-3 py-2.5 text-xs text-gray-900 sm:text-sm ${alignmentClass}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
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
                  !table.getCanNextPage() ? 'cursor-not-allowed opacity-50' : ''
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </Card>
  );
}
