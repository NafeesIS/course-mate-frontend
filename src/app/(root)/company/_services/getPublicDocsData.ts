import { BASE_URL_BACKEND } from '@/constants';

export const getPublicDocsData = async (
  companyType: string,
  cin: string,
  version?: 'v2' | 'v3'
): Promise<any> => {
  let apiUrl: string;

  if (companyType === 'LLP') {
    apiUrl = `${BASE_URL_BACKEND}/api/v1/companies/llp-public-documents?cin=${cin}`;
  } else {
    apiUrl = `${BASE_URL_BACKEND}/api/v1/companies/company-public-documents?cin=${cin}&version=${version}`;
  }

  const response = await fetch(apiUrl, {
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  const data = await response.json();

  return data;
};
