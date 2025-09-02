import { BASE_URL_BACKEND } from '@/constants';

export async function getPopularSearchedData() {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/insights/popularSearches`,
    {
      cache: 'no-store',
      // next: {
      //   revalidate: 60,
      // },
    }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}
