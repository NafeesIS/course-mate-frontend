import { BASE_URL_BACKEND } from '@/constants';

export const getDashboardCampaignTracker = async ({
  page = 1,
  limit = 10,
  statusCategory = 'upcoming',
  sortOrder = 'desc',
  sortField = 'dateOfIncorporation',
  incorporationStartDate = '',
  incorporationEndDate = '',
  scheduledStartDate = '',
  scheduledEndDate = '',
  sentStartDate = '',
  sentEndDate = '',
  companyName = '',
  directorName = '',
  directorEmail = '',
  companyCIN = '',
  directorDIN = '',
}: {
  page?: number;
  limit?: number;
  statusCategory?: 'upcoming' | 'sent' | 'overdue';
  sortOrder?: 'asc' | 'desc';
  sortField?: 'dateOfIncorporation' | 'scheduledDate' | 'sentDate';

  // Date filters
  incorporationStartDate?: string;
  incorporationEndDate?: string;
  scheduledStartDate?: string;
  scheduledEndDate?: string;
  sentStartDate?: string;
  sentEndDate?: string;

  // Text filters
  companyCIN?: string;
  companyName?: string;
  directorDIN?: string;
  directorName?: string;
  directorEmail?: string;
}): Promise<any> => {
  try {
    const queryParams = [
      `page=${page}`,
      `limit=${limit}`,
      `sortOrder=${sortOrder}`,
      `sortField=${sortField}`,
      `statusCategory=${statusCategory}`,
      ...(companyName ? [`companyName=${companyName}`] : []),
      ...(directorName ? [`directorName=${directorName}`] : []),
      ...(companyCIN ? [`companyCIN=${companyCIN}`] : []),
      ...(directorDIN ? [`directorDIN=${directorDIN}`] : []),
      ...(directorEmail ? [`directorEmail=${directorEmail}`] : []),
    ];

    // Add date range filters
    if (incorporationStartDate && incorporationEndDate)
      queryParams.push(
        `incorporationStartDate=${incorporationStartDate}`,
        `incorporationEndDate=${incorporationEndDate}`
      );

    if (scheduledStartDate && scheduledEndDate)
      queryParams.push(
        `scheduledStartDate=${scheduledStartDate}`,
        `scheduledEndDate=${scheduledEndDate}`
      );

    if (sentStartDate && sentEndDate)
      queryParams.push(
        `sentStartDate=${sentStartDate}`,
        `sentEndDate=${sentEndDate}`
      );

    const queryString = queryParams.join('&');

    const response = await fetch(
      `${BASE_URL_BACKEND}/api/v1/campaigns/campaign-tracker?${queryString}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch campaign details. HTTP status: ${response.status}`
      );
      return null;
    }

    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      console.error('Failed to fetch campaign details:', result.message);
      return null;
    }
  } catch (error) {
    console.error('An error occurred while fetching campaign details:', error);
    return null;
  }
};
