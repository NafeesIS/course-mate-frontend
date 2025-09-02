'use client';

import useDirectorSearchFacets from '@/services/search/useDirectorSearchFacets';
import { TCompanySearchParams } from '@/types/CompanySearchTypes';
import Filters from './Filters';
import FiltersSidebar from './FiltersSidebar';

interface FilterSectionProps {
  searchParams: TCompanySearchParams;
}

const FilterSection: React.FC<FilterSectionProps> = ({ searchParams }) => {
  const { data: searchFacets } = useDirectorSearchFacets(searchParams);

  return (
    <>
      <Filters
        searchParams={searchParams}
        searchFacets={searchFacets}
        className='hidden md:block md:w-1/3 md:max-w-80'
      />
      {/* FILTERS: FOR SMALL DEVICE */}
      <FiltersSidebar
        searchParams={searchParams}
        searchFacets={searchFacets}
        className='md:hidden'
      />
    </>
  );
};

export default FilterSection;
