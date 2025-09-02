'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import HeroWrapper from '../../../../components/shared/HeroWrapper';
import AdvanceSearchBar from './AdvanceSearchBar';
import HeroBreadcrumb from './HeroBreadcrumb';

const Hero = () => {
  const pathname = usePathname(); // /search/director or /search/company
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('query') ?? '';
  const defaultTab = pathname.includes('company') ? 'company' : 'director';

  return (
    <HeroWrapper className='flex-col-bottom min-h-60 overflow-hidden p-4 sm:min-h-52'>
      <HeroBreadcrumb className='mt-2' />
      {/* SEARCH BAR */}
      <AdvanceSearchBar
        defaultTab={defaultTab}
        defaultSearchTerm={searchTerm}
        className='mt-6'
      />
    </HeroWrapper>
  );
};

export default Hero;
