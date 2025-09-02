import { BASE_URL_BACKEND } from '@/constants';

export const getSinglePartnerData = async (id: string): Promise<any> => {
  const response = await fetch(
    `${BASE_URL_BACKEND}/api/v1/partners/partnerInfo?partnerId=${id}`
    // {
    //   cache: 'no-store',
    //   // next: { tags: ['company'], revalidate: 60 },
    // }
  );

  // eslint-disable-next-line no-console
  console.log(
    'getSinglePartnerData',
    `${BASE_URL_BACKEND}/api/v1/partners/partnerInfo?partnerId=${id}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await response.json();

  return data;
};
