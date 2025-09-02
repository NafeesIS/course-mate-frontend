import { BASE_URL_BACKEND } from '@/constants';

export const getAllCouponsDetails = async (): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL_BACKEND}/api/v1/coupon/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch coupon details. HTTP status: ${response.status}`
      );
      return null;
    }

    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      console.error('Failed to fetch coupon details:', result.message);
      return null;
    }
  } catch (error) {
    console.error('An error occurred while fetching coupon details:', error);
    return null;
  }
};

export const updateCoupon = async (code: string, formData: any) => {
  const response = await fetch(
    `${BASE_URL_BACKEND}/api/v1/coupon/update/${code}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update the coupon.');
  }

  return response.json(); // Return the parsed JSON response
};

export const deleteCoupon = async (code: string) => {
  const response = await fetch(
    `${BASE_URL_BACKEND}/api/v1/coupon/delete/${code}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete the coupon.');
  }

  return response.json(); // Return the parsed JSON response
};
