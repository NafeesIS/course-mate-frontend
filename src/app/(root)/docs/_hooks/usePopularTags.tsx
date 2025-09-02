// src/hooks/usePopularTags.ts
import { useQuery } from '@tanstack/react-query';
import { getPopularTags } from '../_services/services'; // Adjust path
import { IRecentSearchTags } from '../_types/types'; // Adjust path

interface UsePopularTagsReturn {
  popularTags: IRecentSearchTags[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const usePopularTags = (): UsePopularTagsReturn => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['popularTags'],
    queryFn: getPopularTags,
    staleTime: 1000 * 60 * 60, // 1 hour (popular tags don't change often)
    gcTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false, // No auto-refetch on focus
    enabled: true, // Always enabled (fetched on mount if needed)
  });

  return {
    popularTags: data || [],
    isLoading,
    error,
    refetch,
  };
};

export default usePopularTags;
