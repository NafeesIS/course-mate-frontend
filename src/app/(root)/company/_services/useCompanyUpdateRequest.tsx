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

const useCompanyUpdateRequest = (
  cinNo: string,
  companyType: string,
  dateOfIncorporation: string
): SearchResultsQuery => {
  const createCompanyUpdateRequest = async () => {
    const response = await axios.get(
      `${BASE_URL_BACKEND}/api/v1/companies/createCompanyUpdateRequest?cin=${cinNo}&companyType=${companyType}&dateOfIncorporation=${dateOfIncorporation}`
    );

    return response.data;
  };

  const { data, refetch, isLoading, isError, error } = useQuery({
    queryKey: [cinNo],
    queryFn: createCompanyUpdateRequest,
    refetchOnWindowFocus: false,
    enabled: false,
  });

  return { data, refetch, isLoading, isError, error };
};

export default useCompanyUpdateRequest;
