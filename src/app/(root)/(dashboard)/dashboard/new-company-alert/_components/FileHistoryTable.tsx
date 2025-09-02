'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { DateRangePicker } from '@/components/vpd-date-range-picker/date-range-picker';
import { cn } from '@/lib/utils';
import { format as formatDateFns } from 'date-fns';
import {
  AlertCircle,
  Download,
  Files,
  FileX,
  Loader2,
  RefreshCw,
  X,
} from 'lucide-react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import useNcaEmailHistory, {
  INcaEmailHistoryItem,
} from '../_hooks/useNcaEmailHistory';

const LIMIT_OPTIONS = [10, 20, 50];

// Utility: Convert a Date to UTC midnight ISO string (YYYY-MM-DDT00:00:00.000Z)
// This ensures the backend receives unambiguous, timezone-safe date strings
function toUTCMidnightISOString(date: Date): string {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
  ).toISOString();
}

// Memoized Table Row
const MemoTableRow = React.memo(function MemoTableRow({
  row,
  columns,
  idx,
}: {
  row: INcaEmailHistoryItem;
  columns: any[];
  idx: number;
}) {
  return (
    <TableRow
      key={row._id}
      className={cn((idx + 1) % 2 === 0 && 'bg-muted bg-opacity-5')}
    >
      {columns.map((col) => (
        <TableCell key={col.id}>
          {col.cell(col.id === 'serialNo' ? undefined : row, idx)}
        </TableCell>
      ))}
    </TableRow>
  );
});
MemoTableRow.displayName = 'MemoTableRow';

function FileHistoryTable({
  userId,
  hasActiveSubscriptions,
}: {
  userId: string;
  hasActiveSubscriptions: boolean;
}) {
  // --- 1. State for table controls (pagination, sorting, date filter) ---
  // These control the API query and table rendering
  const [page, setPage] = useState(1); // Current page number
  const [limit, setLimit] = useState(10); // Rows per page
  const [sortBy, setSortBy] = useState<'processDate' | 'fileName'>(
    'processDate'
  ); // Sort column
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // Sort direction
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({}); // Date filter
  const [resetSignal, setResetSignal] = useState(false); // Signal to reset DateRangePicker

  // --- 2. Memoize date params for API (step: always send ISO UTC) ---
  // This ensures the API only refetches when the date filter changes
  const { processDate, processEndDate } = useMemo(() => {
    let processDate: string | undefined = undefined;
    let processEndDate: string | undefined = undefined;
    if (dateRange.from) {
      processDate = toUTCMidnightISOString(dateRange.from);
      if (dateRange.to && dateRange.to.getTime() !== dateRange.from.getTime()) {
        const fromUTC = new Date(processDate);
        const toUTC = new Date(toUTCMidnightISOString(dateRange.to));
        if (toUTC >= fromUTC) {
          processEndDate = toUTCMidnightISOString(dateRange.to);
        }
      }
    }
    return { processDate, processEndDate };
  }, [dateRange]);

  // --- 3. Memoized event handlers for table controls ---
  // These are stable and prevent unnecessary rerenders
  const handleSort = useCallback((col: 'processDate' | 'fileName') => {
    setSortBy(col);
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  const handleDateRangeUpdate = useCallback(
    ({ range }: { range: { from?: Date; to?: Date } }) => {
      setDateRange(range || {});
      setPage(1); // Reset to first page on filter change
    },
    []
  );

  // Check if any filters are applied
  const hasActiveFilters = useMemo(() => {
    return dateRange.from || dateRange.to;
  }, [dateRange]);

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    setDateRange({});
    setPage(1);
    setResetSignal(true);
    // Reset the signal after a short delay to allow the DateRangePicker to process it
    setTimeout(() => setResetSignal(false), 100);
  }, []);

  // --- 4. Fetch file history data using React Query ---
  // keepPreviousData: true prevents flicker when paginating/sorting
  const {
    data: fileHistory,
    // isPending: isLoading,
    isFetching: isLoading,
    error,
    refetch: refetchNcaEmailHistory,
  } = useNcaEmailHistory({
    userId,
    page,
    limit,
    sortBy,
    sortOrder,
    processDate,
    ...(processEndDate ? { processEndDate } : {}),
  });

  // --- 5. Memoize table data and meta for performance ---
  // Only recalculated when fileHistory changes
  const tableData: INcaEmailHistoryItem[] = useMemo(
    () => fileHistory?.data.data || [],
    [fileHistory]
  );
  const meta = useMemo(() => fileHistory?.data.meta, [fileHistory]);

  // --- 6. Memoize column definitions ---
  // Columns are stable unless meta, sortBy, sortOrder, or handleSort changes
  const columns = useMemo(
    () => [
      {
        id: 'serialNo',
        header: <span className='pl-2'>#</span>,
        // Serial number is calculated based on page and limit for correct numbering
        cell: (_: any, rowIndex: number) => {
          const pageNum = meta?.page ?? 1;
          const pageLimit = meta?.limit ?? 10;
          return (
            <span className='pl-2'>
              {(pageNum - 1) * pageLimit + rowIndex + 1}
            </span>
          );
        },
      },
      {
        id: 'processDate',
        header: (
          // Sortable column header for Processing Date
          <button
            className='flex items-center gap-1 whitespace-nowrap'
            onClick={() => handleSort('processDate')}
          >
            Incorporation Date
            <span>
              {sortBy === 'processDate'
                ? sortOrder === 'asc'
                  ? '↑'
                  : '↓'
                : '↕'}
            </span>
          </button>
        ),
        cell: (row: INcaEmailHistoryItem | undefined) =>
          row ? formatDateFns(new Date(row.processDate), 'dd-MMM-yyyy') : '',
      },
      {
        id: 'dataType',
        header: <span className='block'>Type</span>,
        cell: (row: INcaEmailHistoryItem | undefined) => (
          <span className='block w-fit rounded-md border bg-muted px-2 py-0.5 text-xs ring-1'>
            {row ? (row.dataType === 'companies' ? 'Company' : 'LLP') : ''}
          </span>
        ),
      },
      {
        id: 'companyOrLlpCount',
        header: <span className='block text-right'>Companies/LLPs</span>,
        cell: (row: INcaEmailHistoryItem | undefined) => {
          if (!row) return <span className='block text-right'></span>;
          const total =
            row.stateWiseData &&
            Array.isArray(row.stateWiseData) &&
            row.stateWiseData.length > 0
              ? row.stateWiseData.find((s) => s.state === 'Total')
              : { entityCount: 0, personCount: 0 };
          let value: string = '-';
          if (row.dataType === 'companies') {
            value =
              total?.entityCount !== undefined
                ? String(total.entityCount)
                : '-';
          } else if (row.dataType === 'llps') {
            value =
              total?.entityCount !== undefined
                ? String(total.entityCount)
                : '-';
          }
          return <span className='block text-right'>{value}</span>;
        },
      },
      {
        id: 'directorOrPartnerCount',
        header: <span className='block text-right'>Directors/Partners</span>,
        cell: (row: INcaEmailHistoryItem | undefined) => {
          if (!row) return <span className='block text-right'></span>;
          const total =
            row.stateWiseData &&
            Array.isArray(row.stateWiseData) &&
            row.stateWiseData.length > 0
              ? row.stateWiseData.find((s) => s.state === 'Total')
              : { entityCount: 0, personCount: 0 };
          let value: string = '-';
          if (row.dataType === 'companies') {
            value =
              total?.personCount !== undefined
                ? String(total.personCount)
                : '-';
          } else if (row.dataType === 'llps') {
            value =
              total?.personCount !== undefined
                ? String(total.personCount)
                : '-';
          }
          return <span className='block text-right'>{value}</span>;
        },
      },
      {
        id: 'download',
        header: <span className='block w-40 text-center'></span>,
        cell: (row: INcaEmailHistoryItem | undefined) =>
          row ? (
            <div className='flex justify-end'>
              <a
                href={row.blobUrl}
                target='_blank'
                rel='noopener noreferrer'
                download
                title={`Download ${row.fileName ?? ''}`}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'gap-2 border bg-accent text-xs hover:ring-2'
                )}
              >
                <Download className='size-3' /> Download
              </a>
            </div>
          ) : null,
      },
    ],
    [meta, sortBy, sortOrder, handleSort]
  );

  // Memoize table data
  const memoTableData = useMemo(() => tableData, [tableData]);

  // Memoize pagination rendering
  const renderPagination = useMemo(() => {
    if (!meta || meta.totalPages <= 1) return null;
    const totalPages = meta.totalPages;
    const pages = [];
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={page === i}
              onClick={() => setPage(i)}
              className='cursor-pointer text-xs hover:bg-gray-100 sm:text-sm'
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else if (totalPages === 5) {
      for (let i = 1; i <= 5; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={page === i}
              onClick={() => setPage(i)}
              className='cursor-pointer text-xs hover:bg-gray-100 sm:text-sm'
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            isActive={page === 1}
            onClick={() => setPage(1)}
            className='cursor-pointer text-xs hover:bg-gray-100 sm:text-sm'
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      pages.push(
        <PaginationItem key={2}>
          <PaginationLink
            isActive={page === 2}
            onClick={() => setPage(2)}
            className='cursor-pointer text-xs hover:bg-gray-100 sm:text-sm'
          >
            2
          </PaginationLink>
        </PaginationItem>
      );
      if (page > 3 && page < totalPages) {
        pages.push(
          <PaginationItem key='start-ellipsis'>
            <span className='px-2'>...</span>
          </PaginationItem>
        );
        pages.push(
          <PaginationItem key={page}>
            <PaginationLink
              isActive
              onClick={() => setPage(page)}
              className='cursor-pointer text-xs hover:bg-gray-100 sm:text-sm'
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        );
        pages.push(
          <PaginationItem key='end-ellipsis'>
            <span className='px-2'>...</span>
          </PaginationItem>
        );
      } else if (page === 3) {
        pages.push(
          <PaginationItem key={3}>
            <PaginationLink
              isActive
              onClick={() => setPage(3)}
              className='cursor-pointer text-xs hover:bg-gray-100 sm:text-sm'
            >
              3
            </PaginationLink>
          </PaginationItem>
        );
        pages.push(
          <PaginationItem key='end-ellipsis'>
            <span className='px-2'>...</span>
          </PaginationItem>
        );
      } else {
        pages.push(
          <PaginationItem key='end-ellipsis'>
            <span className='px-2'>...</span>
          </PaginationItem>
        );
      }
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={page === totalPages}
            onClick={() => setPage(totalPages)}
            className='cursor-pointer text-xs hover:bg-gray-100 sm:text-sm'
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return (
      <div className='mt-4 flex justify-center'>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && setPage(page - 1)}
                aria-disabled={page === 1}
                tabIndex={page === 1 ? -1 : 0}
                className={
                  page === 1
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer text-xs hover:bg-gray-100 sm:text-sm'
                }
              />
            </PaginationItem>
            {pages}
            <PaginationItem>
              <PaginationNext
                onClick={() => page < meta.totalPages && setPage(page + 1)}
                aria-disabled={page === meta.totalPages}
                tabIndex={page === meta.totalPages ? -1 : 0}
                className={
                  page === meta.totalPages
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer text-xs hover:bg-gray-100 sm:text-sm'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  }, [meta, page, setPage]);

  // Memoize handlers
  const handleSetLimit = useCallback(
    (l: number | string) => setLimit(Number(l)),
    [setLimit]
  );

  // --- 7. Only show spinner on initial load, not on every page/sort ---
  const initialLoad = useRef(true);
  if (fileHistory || error) initialLoad.current = false;

  return (
    <Card className='rounded-lg border shadow-none'>
      <CardHeader className='flex-row justify-between gap-2 p-2 pt-4 sm:p-4'>
        <div className='flex items-center gap-2'>
          <div className='flex size-7 items-center justify-center rounded-lg bg-blue-100'>
            <Files className='size-4 text-blue-600' />
          </div>
          <CardTitle className='text-sm font-semibold'>File History</CardTitle>
        </div>

        {/* Filter controls: date range picker and limit selector */}
        <div className='mb-4 flex flex-row items-center gap-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => {
              refetchNcaEmailHistory();
            }}
            className='size-9'
          >
            <RefreshCw className='size-4' />
            <span className='sr-only'>Refresh</span>
          </Button>
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            onUpdate={handleDateRangeUpdate}
            showCompare={false}
            locale='en-US'
            align='start'
            filterLabel='Filter by Processing Date'
            resetSignal={resetSignal}
          />
          {hasActiveFilters && (
            <Button
              variant='outline'
              size='sm'
              onClick={handleResetFilters}
              className='gap-2 text-xs'
            >
              <X className='size-3' />
              Reset Filters
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className='p-2 sm:p-4 sm:pt-0'>
        {/* Table rendering */}
        <div className='overflow-x-auto rounded border'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted'>
                {columns.map((col) => (
                  <TableHead key={col.id} className='text-xs'>
                    {col.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialLoad.current && isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='py-8 text-center'
                  >
                    <div className='flex items-center justify-center gap-2 rounded-lg bg-muted'>
                      <Loader2 className='size-4 animate-spin' />
                      <span>Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <div className='flex h-20 items-center justify-center gap-2 rounded-lg bg-muted'>
                      <AlertCircle className='size-6 text-destructive' />
                      <p className='text-sm text-destructive'>
                        {error?.message ?? 'Error loading files'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : memoTableData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <div className='flex h-20 flex-col items-center justify-center gap-2 rounded-lg bg-muted text-center text-xs text-muted-foreground'>
                      <FileX className='size-4' />
                      {hasActiveSubscriptions ? (
                        <span>
                          You have an active subscription.
                          <br />
                          Your data will appear here as soon as it&apos;s
                          available.
                        </span>
                      ) : (
                        <span>No file history found</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                memoTableData.map((row: INcaEmailHistoryItem, idx: number) => {
                  if (!row.blobUrl) return null;
                  return (
                    <MemoTableRow
                      row={row}
                      columns={columns}
                      idx={idx}
                      key={row._id}
                    />
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        <div className='flex flex-col items-center justify-between gap-2 sm:flex-row'>
          {meta && meta.totalPages > 1 && (
            <>
              <Select value={limit.toString()} onValueChange={handleSetLimit}>
                <SelectTrigger className='mt-4 w-32 text-xs sm:text-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LIMIT_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt.toString()}>
                      {opt} / page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {renderPagination}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default React.memo(FileHistoryTable);
