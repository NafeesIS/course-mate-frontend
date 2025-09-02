import { BASE_URL_BACKEND } from '@/constants';

export const getPartnersData = async (): Promise<any> => {
  const response = await fetch(
    `${BASE_URL_BACKEND}/api/v1/partners/allPartner`
    // {
    //   cache: 'no-store',
    //   // next: { tags: ['company'], revalidate: 60 },
    // }
  );

  // eslint-disable-next-line no-console
  console.log(
    'getPartnersData',
    `${BASE_URL_BACKEND}/api/v1/partners/allPartner`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await response.json();

  return data;
};
