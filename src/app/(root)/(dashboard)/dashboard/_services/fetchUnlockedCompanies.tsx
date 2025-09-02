import { BASE_URL_BACKEND } from '@/constants';
import { UnlockedCompany } from '../unlock-companies/company-details/[...slug]/_store/unlockedCompaniesStore';

export async function fetchUnlockedCompanies(
  userId: string
): Promise<UnlockedCompany[]> {
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
}
