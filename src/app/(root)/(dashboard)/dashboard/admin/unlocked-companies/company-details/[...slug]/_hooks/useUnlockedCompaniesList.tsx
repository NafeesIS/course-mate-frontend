import { useUserSignInDetails } from '@/store/userStore';
import { useQuery } from '@tanstack/react-query';
import { useUnlockedCompaniesStore } from '../_store/unlockedCompaniesStore';

export const useUnlockedCompaniesList = ({
  enableCaching = false,
}: { enableCaching?: boolean } = {}) => {
  const { userSignInDetails, userSignInDetailsLoading } =
    useUserSignInDetails();

  const unlockedCompanies = useUnlockedCompaniesStore(
    (state) => state.unlockedCompanies
  );
  const success = useUnlockedCompaniesStore((state) => state.success);
  const message = useUnlockedCompaniesStore((state) => state.message);
  const storeLoading = useUnlockedCompaniesStore((state) => state.isLoading);
  const storeError = useUnlockedCompaniesStore((state) => state.error);
  const fetchUnlockedCompanies = useUnlockedCompaniesStore(
    (state) => state.fetchUnlockedCompanies
  );
  const isCompanyUnlocked = useUnlockedCompaniesStore(
    (state) => state.isCompanyUnlocked
  );

  const userId = userSignInDetails?.data._id;

  const {
    isLoading: queryLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ['unlockedCompanies', userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('User ID is not available');
      }
      return fetchUnlockedCompanies(userId);
    },
    enabled: !!userId && !userSignInDetailsLoading,
    refetchOnWindowFocus: false,
    // Add caching options when enabled
    gcTime: enableCaching ? 1000 * 60 * 5 : 0, // 5 minutes cache
    staleTime: enableCaching ? 1000 * 60 * 2 : 0, // 2 minutes before refetch
  });

  const isLoading = queryLoading || storeLoading || userSignInDetailsLoading;
  const error = queryError || storeError;

  return {
    unlockedCompanies,
    success,
    message,
    isLoading,
    error,
    refetch,
    userId,
    isCompanyUnlocked,
  };
};
