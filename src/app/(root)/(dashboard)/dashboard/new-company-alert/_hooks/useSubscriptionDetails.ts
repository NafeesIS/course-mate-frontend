import { BASE_URL_BACKEND } from '@/constants';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export interface ISubscriptionDetail {
  _id: string;
  userId: string;
  serviceId: string;
  orderId: string;
  paymentId: string;
  plan: string;
  options: string[];
  amount: number;
  startDate: string;
  endDate: string;
  status: string;
  includedStates: string[];
}

export interface ISubscriptionDetailsResponse {
  success: boolean;
  message: string;
  data: ISubscriptionDetail[];
}

const fetchSubscriptionDetails = async (
  subscriptionIds: string[]
): Promise<ISubscriptionDetailsResponse> => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/subscribe/subscription-details`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptionIds }),
    }
  );
  if (!res.ok) throw new Error('Failed to fetch subscription details');
  return res.json();
};

export default function useSubscriptionDetails(
  subscriptionIds: string[]
): UseQueryResult<ISubscriptionDetailsResponse, Error> {
  return useQuery<ISubscriptionDetailsResponse, Error>({
    queryKey: ['subscriptionDetails', subscriptionIds],
    queryFn: () => fetchSubscriptionDetails(subscriptionIds),
    enabled: Array.isArray(subscriptionIds) && subscriptionIds.length > 0,
    refetchOnWindowFocus: false,
  });
}
