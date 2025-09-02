import { BASE_URL_BACKEND } from '@/constants';
import { TCompanySearchParams } from '@/types/CompanySearchTypes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const useCompanySearchFacets = (searchParams: TCompanySearchParams) => {
  const urlParams = {
    searchTerm: searchParams?.query,
    llpStatus: searchParams?.llpStatus,
    companyType: searchParams?.companyType,
    // mainDivisionDescription: searchParams?.mainDivisionDescription,
    whetherListedOrNot: searchParams?.whetherListedOrNot,
    state: searchParams?.state,
    // city: searchParams?.city,
    // postalCode: searchParams?.postalCode,
    // paidUpCapital: searchParams?.paidUpCapital,
    page: searchParams?.page || 1,
    limit: searchParams?.limit || 10,
  };

  // Build the query string
  const searchQuery = Object.entries(urlParams)
    // eslint-disable-next-line no-unused-vars
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
    .join('&');

  const fetchSearchFacets = async () => {
    if (!searchQuery) return { data: null };

    const response = await axios.get(
      `${BASE_URL_BACKEND}/api/v1/companies/searchFacets?${searchQuery}`
    );

    return response.data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['companySearchFacets', searchQuery],
    queryFn: fetchSearchFacets,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError, error };
};

export default useCompanySearchFacets;
