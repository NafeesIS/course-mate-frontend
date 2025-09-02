import { BASE_URL_BACKEND } from '@/constants';
import {
  TCompanySearchParams,
  TCompanySearchResult,
} from '@/types/CompanySearchTypes';

export const getCompanySearchData = async (
  searchParam: TCompanySearchParams
): Promise<TCompanySearchResult> => {
  // Prepare the search parameters
  const urlParams = {
    searchTerm: searchParam?.query,
    llpStatus: searchParam?.llpStatus,
    companyType: searchParam?.companyType,
    mainDivisionDescription: searchParam?.mainDivisionDescription,
    whetherListedOrNot: searchParam?.whetherListedOrNot,
    state: searchParam?.state,
    city: searchParam?.city,
    postalCode: searchParam?.postalCode,
    paidUpCapital: searchParam?.paidUpCapital,
    // page: searchParam?.page || 1,
    // limit: searchParam?.limit || 20,
  };

  // Build the query string
  const searchQuery = Object.entries(urlParams)
    // eslint-disable-next-line no-unused-vars
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
    .join('&');

  const response = await fetch(
    `${BASE_URL_BACKEND}/api/v1/companies/advanceSearch?${searchQuery}`,
    { cache: 'no-store' }
  );

  // eslint-disable-next-line no-console
  console.log(
    'company advanceSearch',
    `${BASE_URL_BACKEND}/api/v1/companies/advanceSearch?${searchQuery}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};
