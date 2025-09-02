'use client';

import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BASE_URL_BACKEND } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { formatFinancialsCurrency } from '../Financials/utils/formatters';

interface Charge {
  chargeHolderName: string;
  status: string;
  createdOn: string;
  modifiedOn: string;
  closedOn: string;
  amount: number;
}

// Memoized date formatter
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString || dateString === '-') {
    return '-';
  }

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '-';
  }
};

// Memoized currency formatter
const formatCurrency = (amount: number): string => {
  return `₹${formatFinancialsCurrency(amount, 'raw')}`;
};

// Search Input with Clear Button Component
const SearchInput = ({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) => {
  return (
    <div className={`relative ${className}`}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className='pr-8'
      />
      {value && (
        <Button
          variant='ghost'
          size='sm'
          onClick={() => onChange('')}
          className='absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-muted'
          type='button'
        >
          <X className='h-3 w-3' />
          <span className='sr-only'>Clear search</span>
        </Button>
      )}
    </div>
  );
};

// Memoized pagination component
const TablePagination = ({ table }: { table: any }) => {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  // Memoize page numbers generation
  const pageNumbers = useMemo(() => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex pagination logic
      if (currentPage <= 4) {
        // Show first 3 pages, ellipsis, last page
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Show first page, ellipsis, last 3 pages
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className='flex items-center justify-center space-x-1'>
      <Button
        variant='outline'
        size='sm'
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        className='h-8 w-8 p-0'
      >
        <ChevronLeft className='h-4 w-4' />
      </Button>

      {pageNumbers.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
              className='px-2 text-sm text-muted-foreground'
            >
              ...
            </span>
          );
        }

        const pageNumber = page as number;
        const isCurrentPage = pageNumber === currentPage;

        return (
          <Button
            key={pageNumber}
            variant={isCurrentPage ? 'default' : 'outline'}
            size='sm'
            onClick={() => table.setPageIndex(pageNumber - 1)}
            className='h-8 w-8 p-0'
          >
            {pageNumber}
          </Button>
        );
      })}

      <Button
        variant='outline'
        size='sm'
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        className='h-8 w-8 p-0'
      >
        <ChevronRight className='h-4 w-4' />
      </Button>
    </div>
  );
};

interface ChargesTableProps {
  cin: string;
}

export function ChargesTable({ cin }: ChargesTableProps) {
  const { data, isLoading, error } = useQuery<any, Error>({
    queryKey: ['chargeData', cin],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL_BACKEND}/api/v1/companies/chargeDetails?cin=${cin}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch charge data');
      }
      return response.json();
    },
    enabled: !!cin,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Memoize processed data with formatted dates and currency
  const processedData = useMemo(() => {
    const rawData = data?.data?.[0]?.chargesDetails || [];
    return rawData.map((charge: Charge, index: number) => ({
      ...charge,
      serialNo: index + 1, // Add serial number starting from 1
      formattedCreatedOn: formatDate(charge.createdOn),
      formattedModifiedOn: formatDate(charge.modifiedOn),
      formattedClosedOn: formatDate(charge.closedOn),
      formattedAmount: formatCurrency(charge.amount),
    }));
  }, [data]);

  // Memoized column definitions with serial number
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'serialNo',
        header: '#',
        cell: ({ row, table }) => {
          const pageIndex = table.getState().pagination.pageIndex;
          const pageSize = table.getState().pagination.pageSize;
          // Get the row's position within the current page
          const currentPageRows = table.getRowModel().rows;
          const rowIndexInPage = currentPageRows.findIndex(
            (r) => r.id === row.id
          );
          return (
            <div className='text-center text-muted-foreground'>
              {pageIndex * pageSize + rowIndexInPage + 1}
            </div>
          );
        },
        enableSorting: false,
        size: 20,
      },
      {
        accessorKey: 'chargeHolderName',
        header: ({ column }) => {
          return (
            <Button
              variant='ghost'
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Charge Holder
              <ArrowUpDown className='ml-2 h-4 w-4' />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.getValue('chargeHolderName')}</div>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <div>{row.getValue('status')}</div>,
      },
      {
        accessorKey: 'formattedCreatedOn',
        header: 'Created On',
        cell: ({ row }) => <div>{row.getValue('formattedCreatedOn')}</div>,
      },
      {
        accessorKey: 'formattedModifiedOn',
        header: 'Modified On',
        cell: ({ row }) => <div>{row.getValue('formattedModifiedOn')}</div>,
      },
      {
        accessorKey: 'formattedClosedOn',
        header: 'Closed On',
        cell: ({ row }) => <div>{row.getValue('formattedClosedOn')}</div>,
      },
      {
        accessorKey: 'formattedAmount',
        header: ({ column }) => {
          return (
            <Button
              variant='ghost'
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Amount
              <ArrowUpDown className='ml-2 h-4 w-4' />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.getValue('formattedAmount')}</div>,
      },
    ],
    []
  );

  const table = useReactTable({
    data: processedData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Memoized filter handler
  const handleFilterChange = useCallback(
    (value: string) => {
      table.getColumn('chargeHolderName')?.setFilterValue(value);
    },
    [table]
  );

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className='h-24'>
            <LoadingWithSpinner className='h-full' />
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell
            colSpan={columns.length}
            className='h-24 text-center text-red-500'
          >
            Error: {error.message}
          </TableCell>
        </TableRow>
      );
    }

    if (processedData.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={columns.length}
            className='h-24 text-center text-muted-foreground'
          >
            No charge data available for this company.
          </TableCell>
        </TableRow>
      );
    }

    return table.getRowModel().rows.map((row) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  const totalPages = table.getPageCount();
  const startIndex =
    table.getState().pagination.pageIndex *
      table.getState().pagination.pageSize +
    1;
  const endIndex = Math.min(
    startIndex + table.getRowModel().rows.length - 1,
    processedData.length
  );

  // Get current filter value
  const filterValue =
    (table.getColumn('fullName')?.getFilterValue() as string) ?? '';

  return (
    <Card className='w-full'>
      <CardHeader className='flex flex-row items-center justify-between gap-4 p-4 md:p-6'>
        <CardTitle className='text-sm md:text-base'>
          Charges ({processedData.length})
        </CardTitle>
        <SearchInput
          placeholder='Search by Charge Holder'
          value={filterValue}
          onChange={handleFilterChange}
          className='w-full max-w-32 md:max-w-60'
        />
      </CardHeader>
      <CardContent className='p-4 pt-0 md:p-6 md:pt-0'>
        <Table className='text-xs md:text-sm'>
          <TableHeader className='text-balance text-xs md:text-sm'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>{renderTableContent()}</TableBody>
        </Table>
      </CardContent>
      {totalPages > 1 && (
        <CardFooter className='flex flex-col space-y-4 py-4'>
          <div className='flex w-full flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-between'>
            <div>
              Showing {startIndex} to {endIndex} of {processedData.length}{' '}
              charges
            </div>
            <TablePagination table={table} />
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
