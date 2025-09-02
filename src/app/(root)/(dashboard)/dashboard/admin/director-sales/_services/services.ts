import { BASE_URL_BACKEND } from '@/constants';
import { format } from 'date-fns';

export const getAllTransactionDetails = async ({
  page = 1,
  limit = 10,
  status = '',
  orderId = '',
  paymentId = '',
  email = '',
  name = '',
  phone = '',
  createdAt = '',
  startDate = '', // Start of date range
  endDate = '', // End of date range
  sort = 'desc',
}: {
  page?: number;
  limit?: number;
  status?: string;
  orderId?: string;
  paymentId?: string;
  email?: string;
  name?: string;
  phone?: string;
  createdAt?: string; // Single date filter
  startDate?: string; // Start of date range
  endDate?: string; // End of date range
  sort?: 'asc' | 'desc';
}): Promise<any> => {
  try {
    // Construct query string dynamically based on the filtering scenario
    const queryParams = [
      `page=${page}`,
      `limit=${limit}`,
      ...(status ? [`status=${status}`] : []),
      ...(orderId ? [`orderId=${orderId}`] : []),
      ...(paymentId ? [`paymentId=${paymentId}`] : []),
      ...(email ? [`email=${email}`] : []),
      ...(name ? [`name=${name}`] : []),
      ...(phone ? [`phone=${encodeURIComponent(phone)}`] : []),
    ];

    // Date filtering logic
    if (createdAt) {
      const formatDate = format(createdAt, 'dd-MM-yyyy');

      // If a single date is selected
      queryParams.push(`startDate=${formatDate}`, `endDate=${formatDate}`);
    } else if (startDate && endDate) {
      const finalStartDate = format(startDate, 'dd-MM-yyyy');
      const finalEndDate = format(endDate, 'dd-MM-yyyy');
      // If a date range is selected
      queryParams.push(
        `startDate=${finalStartDate}`,
        `endDate=${finalEndDate}`
      );
    }

    // Add sort parameter
    if (sort) {
      queryParams.push(`sort=${sort}`);
    }

    const queryString = queryParams.join('&');
    const response = await fetch(
      `${BASE_URL_BACKEND}/api/v1/transactions?${queryString}`,
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
