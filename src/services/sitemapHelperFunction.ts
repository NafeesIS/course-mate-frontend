import { BASE_URL_BACKEND } from '@/constants';

export const getTotalCompanyCount = async () => {
  const response = await fetch(
    `${BASE_URL_BACKEND}/api/v1/sitemaps/countTotalCompany`
    // { cache: 'no-store' } // remove in production
  );

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  // const data = await response.json();

  // return data.data;
  return 3088547;
};

export const getCompanySitemaps = async (start: any, end: any) => {
  const response = await fetch(
    `${BASE_URL_BACKEND}/api/v1/sitemaps/allCompany?start=${start}&end=${end}`
    // { cache: 'no-store' } // remove in production
  );

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await response.json();

  return data.data;
};

export const getTotalDirectorCount = async () => {
  const response = await fetch(
    `${BASE_URL_BACKEND}/api/v1/sitemaps/countTotalDirector`
    // { cache: 'no-store' } // remove in production
  );

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await response.json();

  return data.data;
};

export const getDirectorSitemaps = async (start: any, end: any) => {
  const response = await fetch(
    `${BASE_URL_BACKEND}/api/v1/sitemaps/allDirector?start=${start}&end=${end}`
    // { cache: 'no-store' } // remove in production
  );

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await response.json();

  return data.data;
};
