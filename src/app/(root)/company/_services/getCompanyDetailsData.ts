import { BASE_URL_BACKEND } from '@/constants';
import { TCompanyMasterData } from '../_types/CompanyDetails';

export const getCompanyDetailsData = async (
  cin: string
): Promise<TCompanyMasterData> => {
  const response = await fetch(
    `${BASE_URL_BACKEND}/api/v1/companies/companyInfo?cin=${cin}`,
    {
      // headers: {
      //   Authorization: 'Bearer ' + getAccessToken(),
      // },
      cache: 'no-store',
      // next: { tags: ['company'], revalidate: 60 },
    }
  );

  // eslint-disable-next-line no-console
  console.log(
    'companyDetails',
    `${BASE_URL_BACKEND}/api/v1/companies/companyInfo?cin=${cin}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await response.json();

  return data;
};
