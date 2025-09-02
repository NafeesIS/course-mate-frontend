import { useQuery } from '@tanstack/react-query';
import { getDocsBySubcategory } from '../_services/services';
import { Doc, ProductDocsOptions } from '../_types/types';

interface UseProductDocsReturn {
  productDocs: Doc[];
  refetch: () => void;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
}

const useProductDocs = (options: ProductDocsOptions): UseProductDocsReturn => {
  const {
    data: productDocs = [],
    refetch,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['productDocs', options.subcategoryId, options],
    queryFn: () => getDocsBySubcategory(options),
    gcTime: 1000 * 60 * 10, // 10 minutes
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!options.subcategoryId,
  });

  return {
    productDocs,
    refetch,
    isLoading,
    isFetching,
    error,
  };
};

export default useProductDocs;
