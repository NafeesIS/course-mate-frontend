import NoResultsFound from '@/components/shared/SearchBar/NoResultsFound';
import { cn } from '@/lib/utils';
import { getCompanySearchData } from '@/services/search/getCompanySearchData';
import {
  TCompanySearchParams,
  TCompanySearchResult,
} from '@/types/CompanySearchTypes';
import SearchResultsPagination from '../SearchResultsPagination';
import CompanyCard from './CompanyCard';

interface SearchResultsProps {
  searchParams: TCompanySearchParams;
  className?: string;
}

const SearchResults: React.FC<SearchResultsProps> = async ({
  searchParams,
  className,
}) => {
  const { query, page = 1 } = searchParams;

  const companyData: TCompanySearchResult | undefined =
    await getCompanySearchData(searchParams);

  const companies = companyData?.data || [];
  const totalCompanies = companies.length || 0;
  const itemsPerPage = 20;
  const totalPages = Math.ceil(totalCompanies / itemsPerPage);
  const currentPage = Number(page);

  // Calculate the companies to display based on the current page
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = Math.min(startIdx + itemsPerPage, totalCompanies);
  const companiesToDisplay = companies.slice(startIdx, endIdx);

  // Calculate start and end results
  // const startResult = Math.min(
  //   (companyData?.data?.currentPage - 1) * companyData?.data?.limit + 1,
  //   companyData?.data?.totalResults
  // );
  // const endResult = Math.min(
  //   (companyData?.data?.currentPage - 1) * companyData?.data?.limit +
  //     companyData?.data?.limit,
  //   companyData?.data?.totalResults
  // );

  return (
    <>
      <div className={cn(className)}>
        {/* IF NO DATA FOUND */}
        {companies?.length === 0 ? (
          // <p className='text-sm text-gray-500'>No results found</p>
          <NoResultsFound />
        ) : (
          <div>
            {/* <h1 className='mt-4 text-sm md:mt-0 md:text-base'>
              Showing <strong>{startResult}</strong> to{' '}
              <strong>{endResult}</strong> of the{' '}
              <strong>{companyData?.data?.totalResults}</strong> companies for{' '}
              <strong>&quot;{query}&quot;</strong>
            </h1> */}
            <ul className='mt-2 space-y-2 md:mt-0 md:space-y-3'>
              {companiesToDisplay?.map((company) => (
                <li key={company._id}>
                  <CompanyCard query={query} company={company} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* PAGINATION */}
      {companies?.length > 0 && (
        <SearchResultsPagination
          totalPages={totalPages}
          currentPage={currentPage}
        />
      )}
    </>
  );
};

export default SearchResults;
