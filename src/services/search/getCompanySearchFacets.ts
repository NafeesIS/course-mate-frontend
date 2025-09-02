import { BASE_URL_BACKEND } from '@/constants';
import {
  TCompanySearchFacets,
  TCompanySearchParams,
} from '@/types/CompanySearchTypes';

export const getCompanySearchFacets = async (
  searchParam: TCompanySearchParams
): Promise<TCompanySearchFacets> => {
  const response = await fetch(
    `${BASE_URL_BACKEND}/api/v1/companies/searchFacets?searchTerm=${searchParam?.query}`,
    { cache: 'no-store' }
  );

  // eslint-disable-next-line no-console
  console.log(
    'company searchFacets',
    `${BASE_URL_BACKEND}/api/v1/companies/searchFacets?searchTerm=${searchParam?.query}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
};
