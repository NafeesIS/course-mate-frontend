import { BASE_URL_BACKEND } from '@/constants';

export async function getUserInfo() {
  try {
    const response = await fetch(`${BASE_URL_BACKEND}/api/v1/users/user-info`, {
      credentials: 'include',
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return false;
  }
}
