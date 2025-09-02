'use client';

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
import { IBulkUnlockCredit } from '../_types/types';

export default function BulkUnlockDetailsDialog({
  data,
  userId,
  title,
}: {
  data: IBulkUnlockCredit[];
  userId: string;
  title: string;
}) {
  const [searchCreditType, setSearchCreditType] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sortColumn, setSortColumn] = useState<string | null>('expiryDate');
  const [currentPage, setCurrentPage] = useState(1);

  const creditsPerPage = 5;

  // Reset filters
  const resetFilters = () => {
    setSearchCreditType('');
    setSortColumn(null);
    setSortDirection('asc');
    setCurrentPage(1);
  };

  // Reset current page when filters, search, or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchCreditType, sortColumn, sortDirection]);

  // Filter data
  const filteredData = data.filter(
    (item) =>
      !searchCreditType ||
      item.creditType.toLowerCase().includes(searchCreditType.toLowerCase())
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn as keyof typeof a];
    const bValue = b[sortColumn as keyof typeof b];

    return sortDirection === 'asc'
      ? new Date(aValue as string).getTime() -
          new Date(bValue as string).getTime()
      : new Date(bValue as string).getTime() -
          new Date(aValue as string).getTime();
  });

  // Pagination logic
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / creditsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * creditsPerPage,
    currentPage * creditsPerPage
  );

  const handleSort = (column: string) => {
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
          {data.length}
        </Button>
      </DialogTrigger>
      <DialogContent className='h-auto max-h-screen sm:w-[640px] lg:w-[1024px] lg:min-w-[1024px] xl:w-[1124px] xl:min-w-[1124px]'>
        <DialogHeader>
          <DialogTitle>
            <DialogDescription className='flex flex-wrap items-center justify-center gap-1 text-sm font-semibold text-black md:justify-start lg:text-lg'>
              <span className='whitespace-nowrap'>Bulk Unlock:</span>{' '}
              <span className='flex items-center whitespace-nowrap'>
                {title}{' '}
                <Link
                  href={`user-management/${userId}?tab=bulk-unlock-credits`}
                  className='p-2 text-primary transition-colors duration-200 hover:text-blue-600'
                >
                  <FcInfo className='h-5 w-5' />
                </Link>
              </span>
            </DialogDescription>
          </DialogTitle>
        </DialogHeader>
        <div className='ml-auto flex w-full items-center justify-end gap-4 lg:w-1/2'>
          {/* Search by Credit Type */}
          <Input
            placeholder='Search by Credit Type'
            value={searchCreditType}
            onChange={(e) => setSearchCreditType(e.target.value)}
            className='w-full'
          />
          {/* Reset Button */}
          <Button variant='secondary' onClick={resetFilters} className='w-full'>
            Reset
          </Button>
        </div>

        <Card className='no-scrollbar mx-auto w-full overflow-scroll rounded-md border-none shadow-none sm:max-w-6xl'>
          {paginatedData.length > 0 ? (
            <>
              <Table className='min-w-4xl mb-4 rounded-md border text-[10px] shadow lg:text-xs'>
                <TableHeader>
                  <TableRow className='divide-x bg-muted p-4'>
                    {[
                      '#',
                      'Credit Type',
                      'Available Credits',
                      'Created At',
                      'Expiry Date',
                    ].map((header) => (
                      <TableHead
                        key={header}
                        className={`whitespace-nowrap p-4 text-left font-semibold text-foreground ${header === 'Available Credits' ? 'text-center' : ''} ${
                          header === 'Created At' || header === 'Expiry Date'
                            ? 'cursor-pointer'
                            : ''
                        }`}
                        onClick={() =>
                          header === 'Created At'
                            ? handleSort('createdAt')
                            : header === 'Expiry Date'
                              ? handleSort('expiryDate')
                              : undefined
                        }
                      >
                        {header}
                        {(header === 'Created At' ||
                          header === 'Expiry Date') && (
                          <span className='ml-2'>
                            {sortColumn ===
                            (header === 'Created At'
                              ? 'createdAt'
                              : 'expiryDate')
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
                  {paginatedData.map((item, index) => (
                    <TableRow
                      key={`${item.creditType}-${index}`}
                      className={`divide-x text-left ${
                        index % 2 !== 0 ? 'bg-muted/50' : 'hover:bg-card'
                      }`}
                    >
                      <TableCell className='p-4'>
                        {currentPage * creditsPerPage -
                          creditsPerPage +
                          index +
                          1}
                      </TableCell>
                      <TableCell className='p-4 capitalize'>
                        {item.creditType}
                      </TableCell>
                      <TableCell className='p-4 text-center'>
                        {item.availableCredits}
                      </TableCell>
                      <TableCell className='whitespace-nowrap p-4'>
                        {format(new Date(item.createdAt), 'dd-MMM-yyyy')}
                      </TableCell>
                      <TableCell className='whitespace-nowrap p-4'>
                        <span
                          className={`font-semibold ${
                            new Date(item.expiryDate) >= new Date()
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {format(new Date(item.expiryDate), 'dd-MMM-yyyy')}
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
                No credit details available
              </p>
            </div>
          )}
        </Card>
      </DialogContent>
    </Dialog>
  );
}
