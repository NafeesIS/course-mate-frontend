import { BASE_URL_BACKEND } from '@/constants';
import { useQuery } from '@tanstack/react-query';

type TCompany = {
  companyId: string;
  companyName: string;
  expiryDate: string;
  unlockedAt: string;
  unlockType: 'report' | 'documents';
};

const fetchUserUnlockedCompanies = async (userId: string) => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/unlock-company/user-unlocked-companies`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _userId: userId,
      }),
    }
  );
  if (!res.ok) {
    throw new Error('Failed to fetch unlocked companies');
  }
  const data = await res.json();
  return data.data;
};

export function useFetchUnlockedCompanies(userId: string | undefined) {
  return useQuery<TCompany[], Error>({
    queryKey: ['unlockedCompanies', userId],
    queryFn: () =>
      userId ? fetchUserUnlockedCompanies(userId) : Promise.resolve([]),
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
}
