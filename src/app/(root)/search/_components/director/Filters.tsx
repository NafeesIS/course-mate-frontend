'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { directorStatus } from '@/constants/directorSearchFilters';
import { cn } from '@/lib/utils';
import {
  TDirectorSearchFacets,
  TDirectorSearchParams,
} from '@/types/DirectorSearchTypes';
import React, { useTransition } from 'react';
import FilterBox from './FilterBox';

interface FiltersProps {
  searchParams: TDirectorSearchParams;
  searchFacets: TDirectorSearchFacets;
  className?: string;
}

const Filters: React.FC<FiltersProps> = ({
  searchParams,
  searchFacets,
  className,
}) => {
  const facets = searchFacets?.data && searchFacets?.data[0]?.facet;
  const [isPending, startTransition] = useTransition();

  return (
    <aside className={cn(className)}>
      <Card className='divide-y overflow-hidden rounded-md p-0'>
        <CardHeader className='flex-row items-center p-4 font-bold'>
          Filters{' '}
          {isPending && (
            <div
              className='ml-auto inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-primary/50 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'
              role='status'
            ></div>
          )}
        </CardHeader>
        <CardContent className='divide-y p-0'>
          {/* DIRECTOR STATUS */}
          <FilterBox
            title='Status'
            options={directorStatus}
            paramName='status'
            searchParams={searchParams}
            searchFacets={facets?.statusFacet?.buckets}
            isPending={isPending}
            startTransition={startTransition}
          />
        </CardContent>
      </Card>
    </aside>
  );
};

export default Filters;
