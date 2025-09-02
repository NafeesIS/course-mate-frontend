import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fetchDirectorContactStatus,
  toggleContactVisibility,
} from '../_services/api';

export const useDirectorContact = (searchDin: string) => {
  const queryClient = useQueryClient();

  // Query to fetch director information
  const {
    data: directorInfo,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['directorContactStatus', searchDin],
    queryFn: () => fetchDirectorContactStatus(searchDin),
    enabled: !!searchDin.trim(),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation to toggle contact visibility
  const toggleMutation = useMutation({
    mutationFn: toggleContactVisibility,
    onSuccess: (data, variables) => {
      // Update the cache with new data
      queryClient.setQueryData(['directorContactStatus', searchDin], {
        ...directorInfo,
        hideContactInfo: data.hideContactInfo,
      });
      toast.success(
        `Contact visibility updated successfully. Contact information is now ${variables.action === 'hide' ? 'hidden from public view' : 'visible to users'}.`
      );
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      toast.error(`Failed to update contact visibility: ${errorMessage}`);
    },
  });

  const handleToggleContact = (action: 'hide' | 'show') => {
    if (!directorInfo) return;
    toggleMutation.mutate({ action, din: directorInfo.din });
  };

  return {
    directorInfo,
    isLoading,
    error,
    refetch,
    toggleMutation,
    handleToggleContact,
  };
};
