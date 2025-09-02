'use client';

import useMediaQuery from '@/hooks/useMediaQuery';
import useCompanySearchFacets from '@/services/search/useCompanySearchFacets';
import { TCompanySearchParams } from '@/types/CompanySearchTypes';
import Filters from './Filters';
import FiltersSidebar from './FiltersSidebar';

interface FilterSectionProps {
  searchParams: TCompanySearchParams;
}

const FilterSection: React.FC<FilterSectionProps> = ({ searchParams }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const { data: searchFacets } = useCompanySearchFacets(searchParams);

  return (
    <>
      {isDesktop ? (
        <Filters
          searchParams={searchParams}
          searchFacets={searchFacets}
          className='hidden md:block md:w-1/3 md:max-w-80'
        />
      ) : (
        <FiltersSidebar
          searchParams={searchParams}
          searchFacets={searchFacets}
          className='md:hidden'
        />
      )}
    </>
  );
};

export default FilterSection;
