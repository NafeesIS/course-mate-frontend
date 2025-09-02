import { BASE_URL_BACKEND } from '@/constants';
import {
  ApiResponse,
  DirectorContactStatus,
  ToggleContactParams,
} from '../_types/types';

export const fetchDirectorContactStatus = async (
  dinNumber: string
): Promise<DirectorContactStatus> => {
  const response = await fetch(
    `${BASE_URL_BACKEND}/api/v1/directors/contactInfoStatus?din=${dinNumber.trim()}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || 'Failed to fetch director information'
    );
  }

  const data: ApiResponse = await response.json();

  if (data.success) {
    return data.data;
  } else {
    throw new Error(data.message || 'Failed to fetch director information');
  }
};

export const toggleContactVisibility = async ({
  action,
  din,
}: ToggleContactParams): Promise<DirectorContactStatus> => {
  const endpoint =
    action === 'hide'
      ? `${BASE_URL_BACKEND}/api/v1/directors/hideContactInfo`
      : `${BASE_URL_BACKEND}/api/v1/directors/showContactInfo`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ din }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Failed to ${action} contact information`
    );
  }

  const data: ApiResponse = await response.json();

  if (data.success) {
    return data.data;
  } else {
    throw new Error(data.message || `Failed to ${action} contact information`);
  }
};
