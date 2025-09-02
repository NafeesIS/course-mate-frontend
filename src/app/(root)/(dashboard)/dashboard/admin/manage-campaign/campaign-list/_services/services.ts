import { BASE_URL_BACKEND } from '@/constants';

export const getAllCampaignDetails = async ({
  page = 1,
  limit = 10,
  funnelStatus = '',
  companyName = '',
  directorName = '',
  companyCIN = '',
  directorDIN = '',
  directorEmail = '',
  dateOfIncorporation = '',
  startDate = '', // Start of date range
  endDate = '', // End of date range
  sort = 'desc',
}: {
  page?: number;
  limit?: number;
  companyName?: string;
  directorName?: string;
  directorEmail?: string;
  companyCIN?: string;
  directorDIN?: string;
  funnelStatus?: string;
  dateOfIncorporation?: string; // Single date filter
  startDate?: string; // Start of date range
  endDate?: string; // End of date range
  sort?: 'asc' | 'desc';
}): Promise<any> => {
  try {
    // Construct query string dynamically based on the filtering scenario
    const queryParams = [
      `page=${page}`,
      `limit=${limit}`,
      ...(funnelStatus ? [`funnelStatus=${funnelStatus}`] : []),
      ...(companyName ? [`companyName=${companyName}`] : []),
      ...(directorName ? [`directorName=${directorName}`] : []),
      ...(companyCIN ? [`companyCIN=${companyCIN}`] : []),
      ...(directorDIN ? [`directorDIN=${directorDIN}`] : []),
      ...(directorEmail ? [`directorEmail=${directorEmail}`] : []),
    ];

    // Date filtering logic
    if (dateOfIncorporation) {
      // If a single date is selected
      queryParams.push(`dateOfIncorporation=${dateOfIncorporation}`);
    } else if (startDate && endDate) {
      // If a date range is selected
      queryParams.push(`startDate=${startDate}`, `endDate=${endDate}`);
    }

    // Add sort parameter
    if (sort) {
      queryParams.push(`sort=${sort}`);
    }

    const queryString = queryParams.join('&');

    const response = await fetch(
      `${BASE_URL_BACKEND}/api/v1/campaigns?${queryString}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch order details. HTTP status: ${response.status}`
      );
      return null;
    }

    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      console.error('Failed to fetch order details:', result.message);
      return null;
    }
  } catch (error) {
    console.error('An error occurred while fetching order details:', error);
    return null;
  }
};
