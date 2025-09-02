'use client';
import Link from 'next/link';
import { IRecentSearchTags } from '../_types/types';
import { AnimatedDiv } from './AnimatedDiv';

interface PopularTagSearchProps {
  popularSearches: IRecentSearchTags[];
  isSearchResultsOpen: boolean;
  searchQuery: string;
}

const PopularTagSearch = ({
  popularSearches,
  isSearchResultsOpen,
  searchQuery,
}: PopularTagSearchProps) => {
  return (
    <AnimatedDiv
      className={`mt-4 flex flex-wrap items-center justify-center gap-2 px-4 sm:mt-6 sm:gap-3
    ${!popularSearches.length || (isSearchResultsOpen && searchQuery) ? 'invisible' : 'visible'}
  `}
      initial={{ opacity: 0, y: 10 }}
      animate={
        !popularSearches.length || (isSearchResultsOpen && searchQuery)
          ? { opacity: 0, y: 10 }
          : { opacity: 1, y: 0 }
      }
      transition={{ delay: 0.5 }}
    >
      <span className='text-xs text-slate-500 sm:text-sm'>
        Popular Searches:
      </span>
      {popularSearches.map((search, index) => (
        <Link
          key={`${search.slug}-${index}`}
          href={`/docs/tags/${search.slug}?page=1`}
          className=' rounded-full bg-slate-50 px-2 py-1 text-[10px] font-medium text-primary shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-slate-100 hover:text-blue-900 hover:shadow-xl sm:px-3 sm:py-1 sm:text-xs'
        >
          #{search.name}
        </Link>
      ))}
    </AnimatedDiv>
  );
};

export default PopularTagSearch;
