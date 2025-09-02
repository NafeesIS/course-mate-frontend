/* eslint-disable camelcase */
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { FileText } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FaUnlockKeyhole } from 'react-icons/fa6';
import { ISingleUserData } from '../../_types/types';

export default function BulkUnlockCreditsTab({
  userData,
}: {
  userData: ISingleUserData;
}) {
  const { bulk_unlock_credits } = userData;

  const creditsPerPage = 5; // Number of credits per page
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>('expiryDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredAndSortedData = useMemo(() => {
    if (!bulk_unlock_credits || bulk_unlock_credits.length === 0) return [];

    let filteredData = bulk_unlock_credits;

    // Filter by search query
    if (searchQuery) {
      filteredData = filteredData.filter((credit) =>
        credit.creditType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort data
    if (sortColumn) {
      filteredData = [...filteredData].sort((a, b) => {
        const aValue = a[sortColumn as keyof typeof a];
        const bValue = b[sortColumn as keyof typeof b];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        const dateA = new Date(aValue as string).getTime();
        const dateB = new Date(bValue as string).getTime();

        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }

    return filteredData;
  }, [bulk_unlock_credits, searchQuery, sortColumn, sortDirection]);

  // Pagination logic
  const totalItems = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalItems / creditsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * creditsPerPage,
    currentPage * creditsPerPage
  );

  const resetFilters = () => {
    setSearchQuery('');
    setSortColumn('expiryDate');
    setSortDirection('asc');
    setCurrentPage(1);
  };

  if (!bulk_unlock_credits || bulk_unlock_credits.length === 0) {
    return (
      <Card className='mx-auto mt-10 max-w-3xl'>
        <CardContent className='p-6 text-center'>
          <FileText className='mx-auto h-12 w-12 text-muted-foreground opacity-50' />
          <h3 className='mt-4 text-lg font-semibold'>No Bulk Unlock Credits</h3>
          <p className='text-sm text-muted-foreground'>
            The user has no bulk unlock credits available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='mx-auto'>
      <Card className='p-3 md:p-4 lg:p-6'>
        <h2 className='flex items-center gap-2 text-base font-semibold lg:text-xl'>
          <FaUnlockKeyhole className='h-5 w-5' /> Bulk Unlock Credits
        </h2>

        <div className='mb-4 mt-3 flex items-center justify-end gap-4 lg:ml-auto lg:mt-0'>
          <Input
            placeholder='Search by Credit Type'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full sm:w-44'
          />
          <Button variant='secondary' onClick={resetFilters} className='h-9'>
            Reset
          </Button>
        </div>

        <Table className='w-full whitespace-nowrap border text-xs sm:text-sm'>
          <TableHeader>
            <TableRow className='bg-muted'>
              <TableHead className='p-4'>#</TableHead>
              <TableHead className='p-4'>
                <button
                  className='flex items-center gap-1'
                  onClick={() => {
                    setSortColumn('creditType');
                    setSortDirection((prev) =>
                      prev === 'asc' ? 'desc' : 'asc'
                    );
                  }}
                >
                  Credit Type{' '}
                  {/* {sortColumn === 'creditType'
                    ? sortDirection === 'asc'
                      ? '↑'
                      : '↓'
                    : '↕'} */}
                </button>
              </TableHead>
              <TableHead className='p-4'>Available Credits</TableHead>

              <TableHead className='p-4'>
                <button
                  className='flex items-center gap-1'
                  onClick={() => {
                    setSortColumn('createdAt');
                    setSortDirection((prev) =>
                      prev === 'asc' ? 'desc' : 'asc'
                    );
                  }}
                >
                  Created At{' '}
                  {sortColumn === 'createdAt'
                    ? sortDirection === 'asc'
                      ? '↑'
                      : '↓'
                    : '↕'}
                </button>
              </TableHead>
              <TableHead className='p-4'>
                <button
                  className='flex items-center gap-1'
                  onClick={() => {
                    setSortColumn('expiryDate');
                    setSortDirection((prev) =>
                      prev === 'asc' ? 'desc' : 'asc'
                    );
                  }}
                >
                  Expiry Date{' '}
                  {sortColumn === 'expiryDate'
                    ? sortDirection === 'asc'
                      ? '↑'
                      : '↓'
                    : '↕'}
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((credit, index: number) => (
              <TableRow key={index} className='hover:bg-muted/50'>
                <TableCell className='p-4'>
                  {(currentPage - 1) * creditsPerPage + index + 1}
                </TableCell>

                <TableCell className='p-4 capitalize'>
                  {credit.creditType}
                </TableCell>
                <TableCell className='p-4'>
                  {credit.availableCredits || '-'}
                </TableCell>
                <TableCell className='p-4'>
                  {format(new Date(credit.createdAt), 'dd-MMM-yyyy')}
                </TableCell>
                <TableCell className='p-4'>
                  <span
                    className={`font-semibold ${
                      new Date(credit.expiryDate) >= new Date()
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {format(new Date(credit.expiryDate), 'dd-MMM-yyyy')}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

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
    </div>
  );
}
