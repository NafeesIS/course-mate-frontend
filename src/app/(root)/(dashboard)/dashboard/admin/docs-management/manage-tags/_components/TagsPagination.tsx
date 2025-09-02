import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface TagsPaginationProps {
  meta: PaginationMeta;
  // eslint-disable-next-line no-unused-vars
  onPageChange: (page: number) => void;
}

export default function TagsPagination({
  meta,
  onPageChange,
}: TagsPaginationProps) {
  const { page: currentPage, totalPages: totalPages } = meta;

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          '...',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
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
            <button
              type='button'
              onClick={() => onPageChange(currentPage - 1)}
              className='flex items-center gap-2 rounded border border-slate-300 bg-white px-1.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50 md:rounded-lg md:px-3 md:py-2 md:text-sm'
            >
              <ChevronLeft size={16} />
              <span className='hidden sm:inline'>Previous</span>
            </button>
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
              <button
                type='button'
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                disabled={isActive}
                className={`min-w-6 rounded px-2.5 py-1.5 text-center text-xs font-medium transition-colors md:min-w-10 md:rounded-lg md:px-3 md:py-2 md:text-sm ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                }`}
                style={isActive ? { cursor: 'default' } : {}}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <div>
          {hasNextPage ? (
            <button
              type='button'
              onClick={() => onPageChange(currentPage + 1)}
              className='flex items-center gap-2 rounded border border-slate-300 bg-white px-1.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50 md:rounded-lg md:px-3 md:py-2 md:text-sm'
            >
              <span className='hidden sm:inline'>Next</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <div className='flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-1.5 py-1.5 text-xs font-medium text-slate-400 md:rounded-lg md:px-3 md:py-2 md:text-sm'>
              <span className='hidden sm:inline'>Next</span>
              <ChevronRight size={16} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
