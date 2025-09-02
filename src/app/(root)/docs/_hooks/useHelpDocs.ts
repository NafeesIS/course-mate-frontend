import { useQuery } from '@tanstack/react-query';
import { getHelpDocs } from '../_services/services';
import { Doc, HelpDocsOptions } from '../_types/types';

interface UseHelpDocsReturn {
  helpDocs: Doc[];
  refetch: () => void;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
}

const useHelpDocs = (options: HelpDocsOptions): UseHelpDocsReturn => {
  const {
    data: helpDocs = [],
    refetch,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['helpDocs', options],
    queryFn: () => getHelpDocs(options),
    gcTime: 1000 * 60 * 10, // 10 minutes
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch on component mount
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!options.categoryId, // Only run query if categoryId is provided
  });

  return {
    helpDocs,
    refetch,
    isLoading,
    isFetching,
    error,
  };
};

export default useHelpDocs;
