import { BASE_URL_BACKEND } from '@/constants';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export interface ICompanyStateWiseData {
  State: string;
  companyCount: number;
  directorCount: number;
}

export interface ILlpStateWiseData {
  State: string;
  llpCount: number;
  partnerCount: number;
}

export interface ITodaysMetrics {
  dataDate: string;
  companies: number;
  directors: number;
  llps: number;
  partners: number;
  waitingForCompanies: boolean;
  waitingForLLPs: boolean;
  files: string[];
  companiesStateWiseData: ICompanyStateWiseData[];
  llpsStateWiseData: ILlpStateWiseData[];
}

export interface ITodaysMetricsResponse {
  success: boolean;
  message: string;
  data: ITodaysMetrics;
}

const fetchTodaysMetrics = async (
  userId: string
): Promise<ITodaysMetricsResponse> => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/subscribe/nca-email-history/metrics?userId=${encodeURIComponent(userId)}`
  );
  if (!res.ok) throw new Error('Failed to fetch todays metrics');
  return res.json();
};

export default function useTodaysMetrics(
  userId: string
): UseQueryResult<ITodaysMetricsResponse, Error> {
  return useQuery<ITodaysMetricsResponse, Error>({
    queryKey: ['todaysMetrics', userId],
    queryFn: () => fetchTodaysMetrics(userId),
    enabled: typeof userId === 'string' && !!userId,
    refetchOnWindowFocus: false,
  });
}
