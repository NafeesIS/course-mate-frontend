import { BASE_URL_BACKEND } from '@/constants';

export const getAllUsersDetails = async ({
  page = 1,
  limit = 10,
  name = '',
  email = '',
  phone = '',
}: {
  page?: number;
  limit?: number;
  name?: string;
  email?: string;
  phone?: string;
}): Promise<any> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(name && { name }),
      ...(email && { email }),
      ...(phone && { phone }),
    });

    const response = await fetch(
      `${BASE_URL_BACKEND}/api/v1/users?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch user details. HTTP status: ${response.status}`
      );
      return null;
    }

    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      console.error('Failed to fetch user details:', result.message);
      return null;
    }
  } catch (error) {
    console.error('An error occurred while fetching user details:', error);
    return null;
  }
};
