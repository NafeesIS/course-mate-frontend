import { BASE_URL_BACKEND } from '@/constants';

export async function getRecentlyIncorporatedData() {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/insights/recentlyIncorporated`,
    {
      cache: 'no-store',
      // next: {
      //   revalidate: 3600,
      // },
    }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}
