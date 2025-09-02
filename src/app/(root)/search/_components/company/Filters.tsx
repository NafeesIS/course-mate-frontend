'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  companyLLPStatusLabels,
  companyTypesLabels,
  paidUpCapitalLabels,
  stateLabels,
  whetherListedOrNotLabels,
} from '@/constants/companySearchFilters';
import { cn } from '@/lib/utils';
import {
  TCompanySearchFacets,
  TCompanySearchParams,
} from '@/types/CompanySearchTypes';
import React, { useTransition } from 'react';
import FilterBox from './FilterBox';

interface FiltersProps {
  searchParams: TCompanySearchParams;
  searchFacets: TCompanySearchFacets;
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
          {/* COMPANY TYPE */}
          <FilterBox
            title='Company Type'
            options={companyTypesLabels}
            paramName='companyType'
            searchParams={searchParams}
            searchBar={false}
            searchFacets={facets?.companyTypeFacet?.buckets}
            isPending={isPending}
            startTransition={startTransition}
          />

          {/* LISTING STATUS */}
          <FilterBox
            title='Listing Status'
            options={whetherListedOrNotLabels}
            paramName='whetherListedOrNot'
            searchParams={searchParams}
            searchBar={false}
            searchFacets={facets?.whetherListedOrNotFacet?.buckets}
            isPending={isPending}
            startTransition={startTransition}
          />

          {/* COMPANY/LLP STATUS */}
          <FilterBox
            title='Company/LLP Status'
            options={companyLLPStatusLabels}
            paramName='llpStatus'
            searchParams={searchParams}
            searchFacets={facets?.llpStatusFacet?.buckets}
            isPending={isPending}
            startTransition={startTransition}
          />

          {/* INDUSTRY */}
          {/* <FilterBox
            title='Industry'
            options={mainDivisionDescription}
            paramName='mainDivisionDescription'
            searchParams={searchParams}
            searchFacets={facets?.mainDivisionDescriptionFacet?.buckets}
          /> */}

          {/* PAID UP CAPITAL */}
          <FilterBox
            type='radio'
            title='Paid Up Capital'
            options={paidUpCapitalLabels}
            paramName='paidUpCapital'
            searchParams={searchParams}
            searchFacets={facets?.paidUpCapitalFacet?.buckets}
            isPending={isPending}
            startTransition={startTransition}
          />

          {/* STATE */}
          <FilterBox
            title='State'
            options={stateLabels}
            paramName='state'
            searchParams={searchParams}
            searchFacets={facets?.stateFacet?.buckets}
            isPending={isPending}
            startTransition={startTransition}
          />

          {/* CITY */}
          {/* <FilterBox
            title='City'
            options={city}
            paramName='city'
            searchParams={searchParams}
            searchFacets={facets?.cityFacet?.buckets}
          /> */}
        </CardContent>
      </Card>
    </aside>
  );
};

export default Filters;
