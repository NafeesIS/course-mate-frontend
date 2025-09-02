import { BASE_URL_BACKEND } from '@/constants';
import { TDirectorSearchParams } from '@/types/DirectorSearchTypes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const useDirectorSearchFacets = (searchParams: TDirectorSearchParams) => {
  const urlParams = {
    searchTerm: searchParams?.query,
    status: searchParams?.status,
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
      `${BASE_URL_BACKEND}/api/v1/directors/searchFacets?${searchQuery}`
    );
    return response.data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['directorSearchFacets', searchQuery],
    queryFn: fetchSearchFacets,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError, error };
};

export default useDirectorSearchFacets;
