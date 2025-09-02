import { BASE_URL_BACKEND } from '@/constants';
import { TSearchResult } from '@/types/SearchBarTypes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface SearchResultsQuery {
  data: TSearchResult;
  isLoading: boolean;
  isError: boolean;
}

const useSearchSuggestions = (
  tab: string,
  searchTerm: string
): SearchResultsQuery => {
  const type = tab === 'company' ? 'companies' : 'directors';

  const fetchSearchSuggestions = async () => {
    const response = await axios.get(
      `${BASE_URL_BACKEND}/api/v1/${type}/suggestions?searchTerm=${searchTerm}`
    );

    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['searchResults', tab, searchTerm],
    queryFn: fetchSearchSuggestions,
    enabled: !!searchTerm,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { data, isLoading, isError };
};

export default useSearchSuggestions;
