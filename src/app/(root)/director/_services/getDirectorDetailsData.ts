import { BASE_URL_BACKEND } from '@/constants';

export const getDirectorDetailsData = async (din: string): Promise<any> => {
  const response = await fetch(
    `${BASE_URL_BACKEND}/api/v1/directors/directorInfo?din=${din}`
    // {
    //   cache: 'no-store',
    // }
  );

  // eslint-disable-next-line no-console
  console.log(
    'getDirectorDetailsData',
    `${BASE_URL_BACKEND}/api/v1/directors/directorInfo?din=${din}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await response.json();

  return data;
};
