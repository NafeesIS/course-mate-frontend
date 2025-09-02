import { BASE_URL_BACKEND } from '@/constants';
import { useQuery } from '@tanstack/react-query';

type TCompany = {
  userId: {
    _id: string;
    emails: string[];
  };
  companyId: string;
  companyName: string;
  expiryDate: string;
  unlockedAt: string;
  unlockType: 'report' | 'documents';
};

type TUnlockedCompaniesResponse = {
  unlockedCompanies: TCompany[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
  limit: number;
};

type TFilterParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  unlockType?: 'all' | 'report' | 'documents';
  userEmail?: string;
  searchTerm?: string;
  companyType?: 'all' | 'company' | 'llp';
  startDate?: string;
  endDate?: string;
};

const fetchUserUnlockedCompanies = async (
  userId: string,
  params: TFilterParams = {}
) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'unlockedAt',
    sortOrder = 'desc',
    unlockType = 'all',
    userEmail,
    searchTerm,
    companyType = 'all',
    startDate,
    endDate,
  } = params;

  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/unlock-company/admin/all-unlocked-companies`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _userId: userId,
        page,
        limit,
        sortBy,
        sortOrder,
        unlockType,
        userEmail,
        searchTerm,
        companyType,
        startDate,
        endDate,
      }),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch unlocked companies');
  }

  const data = await res.json();
  return data.data as TUnlockedCompaniesResponse;
};

export function useFetchUnlockedCompanies(
  userId: string | undefined,
  params: TFilterParams = {}
) {
  return useQuery<TUnlockedCompaniesResponse, Error>({
    queryKey: [
      'unlockedCompanies',
      userId,
      params.page,
      params.limit,
      params.sortBy,
      params.sortOrder,
      params.unlockType,
      params.userEmail,
      params.searchTerm,
      params.companyType,
      params.startDate,
      params.endDate,
    ],
    queryFn: () =>
      userId
        ? fetchUserUnlockedCompanies(userId, params)
        : Promise.resolve({
            unlockedCompanies: [],
            totalPages: 0,
            totalCount: 0,
            currentPage: 1,
            limit: 10,
          }),
    enabled: !!userId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60, // 1 minute stale time
    gcTime: 1000 * 60, // 1 minute cache time
  });
}
