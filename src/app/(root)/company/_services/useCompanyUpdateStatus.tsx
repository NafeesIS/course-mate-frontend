import { BASE_URL_BACKEND } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface SearchResultsQuery {
  data: any;
  refetch: () => void;
  isLoading: boolean;
  isError: boolean;
  error: any;
}

const useCompanyUpdateStatus = (
  cinNo: string,
  reqData: any
): SearchResultsQuery => {
  const fetchCompanyUpdateStatus = async () => {
    const response = await axios.get(
      `${BASE_URL_BACKEND}/api/v1/companies/getCompanyUpdateStatus?cin=${cinNo}`
    );

    return response.data;
  };

  const { data, refetch, isLoading, isError, error } = useQuery({
    queryKey: [reqData],
    queryFn: fetchCompanyUpdateStatus,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchIntervalInBackground: false,
    refetchInterval: (query) => {
      // Check if any of the update statuses have been initiated
      const dataUpdateInitiated = [
        'isCompanyDataUpdated',
        // 'isSrnDataUpdated',
        'isVpdV3Updated',
        'isGstUpdated',
        'isLLPVpdUpdated',
      ].some((field) => query.state.data?.data?.[field] === 'initiated');

      // If an update has been initiated, determine the refetch interval
      if (dataUpdateInitiated) {
        // Set intervals: 5s for first 5 fetches, 10s for next 5, 15s for next 5, and 20s thereafter
        if (query.state.dataUpdateCount < 5) {
          return 5000; // 5 seconds
        } else if (query.state.dataUpdateCount < 10) {
          return 10000; // 10 seconds
        } else if (query.state.dataUpdateCount < 15) {
          return 15000; // 15 seconds
        } else {
          return 20000; // 20 seconds
        }
      }
      // If no updates are initiated, do not refetch
      return false;
    },
    staleTime: 3000, // 3 seconds
    gcTime: 2000, // 2 minutes
  });

  return {
    data,
    refetch,
    isLoading,
    isError,
    error,
  };
};

export default useCompanyUpdateStatus;
