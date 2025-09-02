import { useQuery } from '@tanstack/react-query';
import { getSubcategories } from '../_services/services';
import { CategoriesOptions, ISubcategory } from '../_types/types';

interface UseSubcategoriesReturn {
  allSubcategories: ISubcategory[];
  refetch: () => void;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
}

const useSubcategories = (
  options: CategoriesOptions
): UseSubcategoriesReturn => {
  const {
    data: rawCategories = [],
    refetch,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['subcategories', options.categoryId],
    queryFn: () => getSubcategories(options),
    gcTime: 1000 * 60 * 15, // 15 minutes (categories don't change often)
    staleTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!options.categoryId,
  });

  // Filter out unwanted categories
  const allSubcategories = rawCategories.filter(
    (cat) =>
      cat._id !== options.categoryId && !cat.name.toLowerCase().includes('test')
  );

  return {
    allSubcategories,
    refetch,
    isLoading,
    isFetching,
    error,
  };
};

export default useSubcategories;
