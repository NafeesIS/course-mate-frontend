import { BASE_URL_BACKEND } from '@/constants';

export const getCustomChartData = async ({
  year = '',
  month = '',
  xAxis = 'scheduleDate',
  yAxis = 'company',
}: {
  year?: string;
  month?: string;
  xAxis?: 'incDate' | 'scheduleDate';
  yAxis?: 'company' | 'director';
}): Promise<any> => {
  try {
    const queryParams = [];

    if (year) queryParams.push(`selectedYear=${encodeURIComponent(year)}`);
    if (month) queryParams.push(`selectedMonth=${encodeURIComponent(month)}`);
    if (xAxis) queryParams.push(`xAxis=${encodeURIComponent(xAxis)}`);
    if (yAxis) queryParams.push(`yAxis=${encodeURIComponent(yAxis)}`);

    const queryString =
      queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

    const response = await fetch(
      `${BASE_URL_BACKEND}/api/v1/campaigns/campaign-report${queryString}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch custom chart data. HTTP status: ${response.status}`
      );
      return null;
    }

    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      console.error('Failed to fetch custom chart data:', result.message);
      return null;
    }
  } catch (error) {
    console.error('An error occurred while fetching custom chart data:', error);
    return null;
  }
};
