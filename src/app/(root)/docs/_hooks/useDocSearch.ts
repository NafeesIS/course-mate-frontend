// src/hooks/useSearchResults.ts
import { useQuery } from '@tanstack/react-query';
import { getSearchResults, ISearchResult } from '../_services/services'; // Adjust path

interface UseSearchResultsReturn {
  results: ISearchResult[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const useSearchResults = (searchTerm: string): UseSearchResultsReturn => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['searchResults', searchTerm], // Unique per search term
    queryFn: () => getSearchResults(searchTerm),
    staleTime: 1000 * 60 * 5, // 5 minutes (search results can be cached briefly)
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!searchTerm, // Only fetch if searchTerm is provided
  });

  return {
    results: data || [],
    isLoading,
    error,
    refetch,
  };
};

export default useSearchResults;
