import { BASE_URL_BACKEND } from '@/constants';
import {
  TDirectorSearchParams,
  TDirectorSearchResult,
} from '@/types/DirectorSearchTypes';

export const getDirectorSearchData = async (
  searchParam: TDirectorSearchParams
): Promise<TDirectorSearchResult> => {
  const urlParams = {
    searchTerm: searchParam?.query,
    status: searchParam?.status,
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
    `${BASE_URL_BACKEND}/api/v1/directors/advanceSearch?${searchQuery}`,
    { cache: 'no-store' }
  );

  // eslint-disable-next-line no-console
  console.log(
    'getDirectorSearchData',
    `${BASE_URL_BACKEND}/api/v1/directors/advanceSearch?${searchQuery}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};
