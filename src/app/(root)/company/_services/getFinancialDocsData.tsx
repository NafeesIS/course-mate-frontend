import { BASE_URL_BACKEND } from '@/constants';

export const getFinancialDocsData = async (cin: string): Promise<any> => {
  const response = await fetch(
    `${BASE_URL_BACKEND}/api/v1/companies/llp-financial-data?cin=${cin}`,
    {
      cache: 'no-store',
    }
  );

  // eslint-disable-next-line no-console
  console.log(
    'LLP Financial Docs Data',
    `${BASE_URL_BACKEND}/api/v1/companies/llp-financial-data?cin=${cin}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await response.json();

  return data;
};
