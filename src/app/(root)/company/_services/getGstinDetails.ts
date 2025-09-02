import { BASE_URL_BACKEND } from '@/constants';

export const getGstDetails = async (
  cin: string,
  dateOfIncorporation: string
): Promise<any> => {
  if (!cin || !dateOfIncorporation) {
    return null;
  }

  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/companies/gstCompliance?cin=${cin}&incDate=${dateOfIncorporation}`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch gst details');
    return null;
  }

  return res.json();
};
