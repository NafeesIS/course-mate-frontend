import { BASE_URL_BACKEND } from '@/constants';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  INcaEmailHistoryQueryOptions,
  INcaEmailHistoryResponse,
} from '../../../../new-company-alert/_hooks/useNcaEmailHistory';

export const getSingleUserDetails = async (id: string): Promise<any> => {
  try {
    if (!id) {
      console.error('User ID is required to fetch user details.');
      return null;
    }

    const response = await fetch(`${BASE_URL_BACKEND}/api/v1/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch user details for ID: ${id}. HTTP status: ${response.status}`
      );
      return null;
    }

    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      console.error('Failed to fetch user details:', result.message);
      return null;
    }
  } catch (error) {
    console.error(
      `An error occurred while fetching user details for ID: ${id}:`,
      error
    );
    return null;
  }
};

const fetchNcaEmailHistoryAdmin = async (
  options: INcaEmailHistoryQueryOptions
): Promise<INcaEmailHistoryResponse> => {
  const params = new URLSearchParams();
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/subscribe/nca-email-history-admin?${params.toString()}`
  );
  if (!res.ok) throw new Error('Failed to fetch NCA email history');
  return res.json();
};

export default function useNcaEmailHistoryAdmin(
  options: INcaEmailHistoryQueryOptions
): UseQueryResult<INcaEmailHistoryResponse, Error> {
  return useQuery<INcaEmailHistoryResponse, Error>({
    queryKey: ['ncaEmailHistoryAdmin', options],
    queryFn: () => fetchNcaEmailHistoryAdmin(options),
    enabled: typeof options.userId === 'string' && !!options.userId,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
