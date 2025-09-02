import { BASE_URL_BACKEND } from '@/constants';
import { IFinancialDocsApiResponse } from '../_types/FinancialDocsDataType';

export const getFinancialsData = async (
  cin: string,
  userId: string
): Promise<IFinancialDocsApiResponse> => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/companies/paid-llp-financial-data`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _userId: userId,
        cin: cin,
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || 'Failed to fetch financial data',
      data: {},
    };
  }

  return data;
};
