import { BASE_URL_BACKEND } from '@/constants';

export const getCampaignOverviewStats = async ({
  year = '',
  month = '',
}: {
  year?: string;
  month?: string;
}): Promise<any> => {
  try {
    const queryParams = [];

    if (year) queryParams.push(`selectedYear=${encodeURIComponent(year)}`);
    if (month) queryParams.push(`selectedMonth=${encodeURIComponent(month)}`);

    const queryString =
      queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

    const response = await fetch(
      `${BASE_URL_BACKEND}/api/v1/campaigns/campaign-overview${queryString}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch chart stats. HTTP status: ${response.status}`
      );
      return null;
    }

    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      console.error('Failed to fetch chart stats:', result.message);
      return null;
    }
  } catch (error) {
    console.error('An error occurred while fetching chart stats:', error);
    return null;
  }
};
