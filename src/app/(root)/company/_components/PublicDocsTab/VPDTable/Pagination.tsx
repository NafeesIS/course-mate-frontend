import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { IDocument } from '../../../_types/PublicDocsTypes';

interface PaginationProps {
  table: Table<IDocument>;
}

export function Pagination({ table }: PaginationProps) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const pageNumbers = [];

  // Always show first page
  pageNumbers.push(1);

  // Calculate range of pages to show around current page
  const range = 1; // Reduced range for mobile
  let startPage = Math.max(2, currentPage - range);
  let endPage = Math.min(totalPages - 1, currentPage + range);

  // Adjust start and end if we're near the edges
  if (currentPage - range <= 2) {
    endPage = Math.min(3, totalPages - 1);
  }
  if (currentPage + range >= totalPages - 1) {
    startPage = Math.max(totalPages - 2, 2);
  }

  // Add ellipsis and page numbers
  if (startPage > 2) {
    pageNumbers.push('...');
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  if (endPage < totalPages - 1) {
    pageNumbers.push('...');
  }

  // Always show last page if there is more than one page
  if (totalPages > 1) {
    pageNumbers.push(totalPages);
  }

  return (
    <div className='flex items-center justify-end space-x-1 py-4 sm:space-x-2'>
      <div className='flex items-center space-x-1 sm:space-x-2'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className='h-8 w-8 hover:ring-1 sm:h-9 sm:w-9'
        >
          <ChevronLeft className='h-3 w-3 sm:h-4 sm:w-4' />
        </Button>
        {pageNumbers.map((page, index) => (
          <Button
            key={index}
            variant={page === currentPage ? 'default' : 'outline'}
            size='icon'
            onClick={() => {
              if (typeof page === 'number') {
                table.setPageIndex(page - 1);
              }
            }}
            disabled={page === '...'}
            className={cn(
              'h-8 w-8 hover:ring-1 sm:h-9 sm:w-9',
              page === '...' ? 'cursor-default' : '',
              page === currentPage ? 'bg-primary text-primary-foreground' : ''
            )}
          >
            {page === '...' ? (
              <MoreHorizontal className='h-3 w-3 sm:h-4 sm:w-4' />
            ) : (
              <span className='text-xs sm:text-sm'>{page}</span>
            )}
          </Button>
        ))}
        <Button
          variant='outline'
          size='icon'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className='h-8 w-8 hover:ring-1 sm:h-9 sm:w-9'
        >
          <ChevronRight className='h-3 w-3 sm:h-4 sm:w-4' />
        </Button>
      </div>
    </div>
  );
}
