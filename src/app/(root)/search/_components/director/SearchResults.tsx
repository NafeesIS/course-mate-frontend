import NoResultsFound from '@/components/shared/SearchBar/NoResultsFound';
import { cn } from '@/lib/utils';
import { getDirectorSearchData } from '@/services/search/getDirectorSearchData';
import { TCompanySearchParams } from '@/types/CompanySearchTypes';
import { TDirectorSearchResult } from '@/types/DirectorSearchTypes';
import SearchResultsPagination from '../SearchResultsPagination';
import DirectorCard from './DirectorCard';

interface SearchResultsProps {
  searchParams: TCompanySearchParams;
  className?: string;
}

const SearchResults: React.FC<SearchResultsProps> = async ({
  searchParams,
  className,
}) => {
  const { query, page = 1 } = searchParams;

  const directorData: TDirectorSearchResult | undefined =
    await getDirectorSearchData(searchParams);

  const directors = directorData?.data || [];
  const totalDirectors = directors.length || 0;
  const itemsPerPage = 20;
  const totalPages = Math.ceil(totalDirectors / itemsPerPage);
  const currentPage = Number(page);

  // Calculate the directors to display based on the current page
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = Math.min(startIdx + itemsPerPage, totalDirectors);
  const directorsToDisplay = directors.slice(startIdx, endIdx);

  // Calculate start and end results
  // const startResult = Math.min(
  //   (directorData?.data?.currentPage - 1) * directorData?.data?.limit + 1,
  //   directorData?.data?.totalResults
  // );
  // const endResult = Math.min(
  //   (directorData?.data?.currentPage - 1) * directorData?.data?.limit +
  //     directorData?.data?.limit,
  //   directorData?.data?.totalResults
  // );

  return (
    <>
      <div className={cn(className)}>
        {/* IF NO DATA FOUND */}
        {!directorData || !directorData?.data || directors?.length === 0 ? (
          // <p className='text-sm text-gray-500'>No results found</p>
          <NoResultsFound />
        ) : (
          <div>
            {/* <h1 className='mt-4 text-sm md:mt-0 md:text-base'>
              Showing <strong>{startResult}</strong> to{' '}
              <strong>{endResult}</strong> of the{' '}
              <strong>{directorData?.data?.totalResults}</strong> directors for{' '}
              <strong>&quot;{query}&quot;</strong>
            </h1> */}
            <ul className='mt-2 space-y-2 md:mt-0 md:space-y-3'>
              {directorsToDisplay?.map((director) => (
                <li key={director?._id}>
                  <DirectorCard query={query} director={director} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* PAGINATION */}
      {directors && directors?.length > 0 && (
        <SearchResultsPagination
          totalPages={totalPages}
          currentPage={currentPage}
        />
      )}
    </>
  );
};

export default SearchResults;
