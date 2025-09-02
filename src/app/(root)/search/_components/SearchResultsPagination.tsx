'use client';

import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RiArrowLeftDoubleLine, RiArrowRightDoubleLine } from 'react-icons/ri';

interface SearchResultsPaginationProps {
  className?: string;
  totalPages: number;
  currentPage?: number;
}

const SearchResultsPagination: React.FC<SearchResultsPaginationProps> = ({
  className,
  totalPages,
  currentPage,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageNumberParam = 'page';

  const [currentPageState, setCurrentPageState] = useState(currentPage || 1);

  useEffect(() => {
    const pageNumber = parseInt(searchParams.get(pageNumberParam) || '1', 10);
    if (!isNaN(pageNumber) && pageNumber > 0) {
      setCurrentPageState(pageNumber);
    }
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    if (page === currentPageState) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set(pageNumberParam, String(page));

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const renderPaginationItems = () => {
    const items = [];

    if (totalPages > 1) {
      items.push(
        <PaginationItem key='previous'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => handlePageChange(currentPageState - 1)}
            disabled={currentPageState === 1}
            className={cn(currentPageState === 1 && 'pointer-events-none')}
          >
            <RiArrowLeftDoubleLine className='text-lg' />
          </Button>
        </PaginationItem>
      );

      items.push(
        <PaginationItem key='1'>
          <Button
            variant='secondary'
            size='sm'
            onClick={() => handlePageChange(1)}
            disabled={currentPageState === 1}
            className={cn(
              'bg-background text-foreground',
              currentPageState === 1 && 'border !opacity-100'
            )}
          >
            1
          </Button>
        </PaginationItem>
      );

      if (currentPageState > 3) {
        items.push(
          <PaginationItem key='ellipsis-start'>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const startPage = Math.max(2, currentPageState - 1);
      const endPage = Math.min(totalPages, currentPageState + 1);

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <Button
              variant='secondary'
              size='sm'
              onClick={() => handlePageChange(i)}
              disabled={currentPageState === i}
              className={cn(
                'bg-background text-foreground',
                currentPageState === i && 'border !opacity-100'
              )}
            >
              {i}
            </Button>
          </PaginationItem>
        );
      }

      if (currentPageState < totalPages - 2) {
        items.push(
          <PaginationItem key='ellipsis-end'>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key='next'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => handlePageChange(currentPageState + 1)}
            disabled={currentPageState === totalPages}
            className={cn(
              currentPageState === totalPages && 'pointer-events-none'
            )}
          >
            <RiArrowRightDoubleLine className='text-lg' />
          </Button>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className={cn(className)}>
      <Pagination>
        <PaginationContent>{renderPaginationItems()}</PaginationContent>
      </Pagination>
    </div>
  );
};

export default SearchResultsPagination;
