import { BASE_URL_BACKEND } from '@/constants';

export const getSubscriberDetails = async (status?: string): Promise<any> => {
  const url = `${BASE_URL_BACKEND}/api/v1/subscribe/admin/subscriptions?status=${status ? `${status}` : 'all'}`;

  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    console.error('Failed to fetch subscription details');
    return null;
  }

  return res.json();
};
