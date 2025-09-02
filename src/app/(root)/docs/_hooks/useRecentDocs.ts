import { useQuery } from '@tanstack/react-query';
import { getRecentDocs } from '../_services/services';
import { Doc, RecentDocsOptions } from '../_types/types';

interface UseRecentDocsReturn {
  recentDocs: Doc[];
  refetch: () => void;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
}

const useRecentDocs = (
  options: RecentDocsOptions = {}
): UseRecentDocsReturn => {
  const {
    data: recentDocs = [],
    refetch,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['recentDocs', options],
    queryFn: () => getRecentDocs(options),
    gcTime: 1000 * 60 * 10, // 10 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes (recent docs change more frequently)
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    recentDocs,
    refetch,
    isLoading,
    isFetching,
    error,
  };
};

export default useRecentDocs;
