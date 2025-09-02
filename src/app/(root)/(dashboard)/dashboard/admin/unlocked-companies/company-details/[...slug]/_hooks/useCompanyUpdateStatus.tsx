import { BASE_URL_BACKEND } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useCompanyDataStore } from '../_store/companyDataStore';

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

  const { setLastUpdatedInfo } = useCompanyDataStore();

  const { data, refetch, isLoading, isError, error } = useQuery({
    queryKey: [reqData],
    queryFn: fetchCompanyUpdateStatus,
    refetchOnWindowFocus: false,
    refetchInterval: (query) => {
      const dataUpdateInitiated = [
        'isCompanyDataUpdated',
        // 'isSrnDataUpdated',
        'isVpdV3Updated',
        'isGstUpdated',
        'isLLPVpdUpdated',
      ].some((field) => query.state.data?.data?.[field] === 'initiated');

      if (dataUpdateInitiated) {
        return query.state.dataUpdateCount <= 20
          ? query.state.dataUpdateCount * 1000
          : 10000;
      }
      return false;
    },
  });

  useEffect(() => {
    if (!isLoading && data?.data) {
      setLastUpdatedInfo(data.data);
    }
  }, [data, setLastUpdatedInfo, isLoading]);

  return {
    data,
    refetch,
    isLoading,
    isError,
    error,
  };
};

export default useCompanyUpdateStatus;
