import { BASE_URL_BACKEND } from '@/constants';

export const getChargeDetails = async (cin: string): Promise<any> => {
  if (!cin) {
    return null;
  }

  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/companies/chargeDetails?cin=${cin}`,
    {
      cache: 'no-store',
    }
  );

  // eslint-disable-next-line no-console
  console.log(
    'chargeDetails',
    `${BASE_URL_BACKEND}/api/v1/companies/chargeDetails?cin=${cin}`
  );

  if (!res.ok) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch charge details');
    return null;
  }

  return res.json();
};
