import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}

interface DocsPaginationProps {
  meta: PaginationMeta;
  basePath: string;
  currentPerPage?: number;
}

export default function DocsPagination({
  meta,
  basePath,
  currentPerPage = 9,
}: DocsPaginationProps) {
  const { page: currentPage, pageCount: totalPages } = meta;

  // Calculate hasNextPage and hasPrevPage
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    if (currentPerPage !== 9) {
      params.set('perPage', currentPerPage.toString());
    }
    return `${basePath}?${params.toString()}`;
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination
      if (currentPage <= 3) {
        // Show first 3 pages + ellipsis + last page
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first page + ellipsis + last 4 pages
        pages.push(
          1,
          '...',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        // Show first page + ellipsis + current-1, current, current+1 + ellipsis + last page
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <nav className='flex items-center justify-center' aria-label='Pagination'>
      <div className='flex items-center'>
        {/* Previous Button */}
        <div>
          {hasPrevPage ? (
            <Link
              href={createPageUrl(currentPage - 1)}
              className='flex items-center gap-2 rounded border border-slate-300 bg-white px-1.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50 md:rounded-lg md:px-3 md:py-2 md:text-sm'
              scroll={true}
            >
              <ChevronLeft size={16} />
              <span className='hidden sm:inline'>Previous</span>
            </Link>
          ) : (
            <div className='flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-1.5 py-1 text-xs font-medium text-slate-400 md:rounded-lg md:px-3 md:py-2 md:text-sm'>
              <ChevronLeft size={16} />
              <span className='hidden sm:inline'>Previous</span>
            </div>
          )}
        </div>

        {/* Page Numbers */}
        <div className='mx-2 flex items-center gap-1 lg:gap-3'>
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className='px-1.5 py-1 text-xs text-slate-400 md:px-3 md:py-2 md:text-sm'
                >
                  ...
                </span>
              );
            }

            const pageNumber = page as number;
            const isActive = pageNumber === currentPage;

            return (
              <Link
                key={pageNumber}
                href={createPageUrl(pageNumber)}
                scroll={true}
                className={`min-w-6 rounded px-2.5 py-1.5 text-center text-xs font-medium transition-colors md:min-w-10 md:rounded-lg md:px-3 md:py-2 md:text-sm ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                {pageNumber}
              </Link>
            );
          })}
        </div>

        {/* Next Button */}
        <div>
          {hasNextPage ? (
            <Link
              href={createPageUrl(currentPage + 1)}
              className='flex items-center gap-2 rounded border border-slate-300 bg-white px-1.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50 md:rounded-lg md:px-3 md:py-2 md:text-sm'
              scroll={true}
            >
              <span className='hidden sm:inline'>Next</span>
              <ChevronRight size={16} />
            </Link>
          ) : (
            <div className='flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-1.5 py-1.5 text-xs font-medium text-slate-400 md:rounded-lg md:px-3 md:py-2 md:text-sm'>
              <span className='hidden sm:inline'>Next</span>
              <ChevronRight size={16} />
            </div>
          )}
        </div>
      </div>

      {/* Page Info */}
      {/* <div className='ml-4 hidden text-sm text-slate-600 sm:block'>
        Page {currentPage} of {totalPages} ({total} total items)
      </div> */}
    </nav>
  );
}
