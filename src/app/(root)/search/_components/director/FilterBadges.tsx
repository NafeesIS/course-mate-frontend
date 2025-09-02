'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TDirectorSearchParams } from '@/types/DirectorSearchTypes';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { RiCloseFill, RiFilterOffFill } from 'react-icons/ri';

interface FilterBadgesProps {
  searchParams: TDirectorSearchParams;
  className?: string;
}

const FilterBadges: React.FC<FilterBadgesProps> = ({
  searchParams,
  className,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  // eslint-disable-next-line no-unused-vars
  const { query, page, limit, ...otherFilters } = searchParams;

  // FOR LOADING
  const [isPending, startTransition] = useTransition();
  const [removingBadgeIndex, setRemovingBadgeIndex] = useState<number | null>(
    null
  );

  // COMBINE ALL FILTERS INTO A SINGLE ARRAY
  const allFilters = Object.entries(otherFilters).flatMap(([key, value]) =>
    (value || '').split(',').map((filterValue) => ({ key, value: filterValue }))
  );

  const handleRemoveFilter = (
    key: string,
    value: string | undefined,
    index: number
  ) => {
    setRemovingBadgeIndex(index);

    // REMOVE THE FILTER FROM THE ARRAY
    const updatedFilters = allFilters.filter(
      (filter) => !(filter.key === key && filter.value === value)
    );

    // BUILD THE NEW URLSEARCHPARAMS
    const newSearchParams = new URLSearchParams();
    updatedFilters.forEach((filter) => {
      if (filter.value) {
        const existingValues = newSearchParams.getAll(filter.key);
        existingValues.push(filter.value);
        newSearchParams.set(filter.key, existingValues.join(','));
      }
    });

    // REPLACE THE URL WITH THE UPDATED PARAMETERS
    startTransition(() => {
      router.push(`${pathname}?query=${query}&${newSearchParams.toString()}`, {
        scroll: false,
      });
    });
  };

  const handleRemoveAllFilters = () => {
    router.push(`${pathname}?query=${query}`, {
      scroll: false,
    });
  };

  return (
    <>
      {allFilters && allFilters.length > 0 && (
        <div className={cn('', className)}>
          <div className='flex flex-wrap gap-2'>
            {allFilters.length > 1 && (
              <Button
                title='Remove all filters'
                variant='outline'
                size='icon'
                className=''
                onClick={handleRemoveAllFilters}
              >
                <RiFilterOffFill className='text-xl' />
              </Button>
            )}
            {allFilters.map((filter, index) => (
              <Badge
                key={index}
                variant='secondary'
                className='gap-1 whitespace-nowrap py-1 pl-2 pr-0.5 text-xs sm:text-sm'
              >
                {filter.value}

                {isPending && removingBadgeIndex === index ? (
                  <div
                    className='mx-1 my-auto inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-primary/50 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'
                    role='status'
                  ></div>
                ) : (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-6 w-6 rounded-full p-1'
                    onClick={() =>
                      handleRemoveFilter(filter.key, filter.value, index)
                    }
                  >
                    <RiCloseFill className='text-xl' />
                  </Button>
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default FilterBadges;
