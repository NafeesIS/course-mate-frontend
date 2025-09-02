import { useQuery } from '@tanstack/react-query';
import { getFeaturedDocs } from '../_services/services';
import { Doc, FetchOptions } from '../_types/types';

interface UseFeaturedDocsReturn {
  featuredDocs: Doc[];
  refetch: () => void;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
}

const useFeaturedDocs = (options: FetchOptions = {}): UseFeaturedDocsReturn => {
  const {
    data: featuredDocs = [],
    refetch,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['featuredDocs', options],
    queryFn: () => getFeaturedDocs(options),
    gcTime: 1000 * 60 * 10, // 10 minutes
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch on component mount
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    featuredDocs,
    refetch,
    isLoading,
    isFetching,
    error,
  };
};

export default useFeaturedDocs;
