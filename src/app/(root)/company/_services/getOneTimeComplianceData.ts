import { BASE_URL_BACKEND } from '@/constants';

export const getOneTimeComplianceData = async (
  companyData: any
): Promise<any> => {
  if (!companyData || !companyData.cin) {
    return null;
  }

  let url = '';

  if (companyData.companyType === 'LLP') {
    url = `${BASE_URL_BACKEND}/api/v1/companies/oneTimeCompliance?cin=${companyData.cin}&companyType=${companyData.companyType}&incorporationDate=${companyData.dateOfIncorporation}&totalObligationOfContribution=${companyData.totalObligationOfContribution}`;
  } else {
    url = `${BASE_URL_BACKEND}/api/v1/companies/oneTimeCompliance?cin=${companyData.cin}&companyType=${companyData.companyType}&incorporationDate=${companyData.dateOfIncorporation}&authorizedCapital=${companyData.authorizedCapital}`;
  }

  const response = await fetch(url, {
    cache: 'no-store',
    // next: { tags: ['company'], revalidate: 60 },
  });

  // eslint-disable-next-line no-console
  console.log('One time compliance data', url);

  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch one time compliance data');
    return null;
  }
  return response.json();
};
