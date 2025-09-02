import { BASE_URL_BACKEND } from '@/constants';

export const getTeamMembers = async (): Promise<any> => {
  const res = await fetch(`${BASE_URL_BACKEND}/api/v1/team/getTeamMembers`);

  if (!res.ok) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch team members');
    return null;
  }

  return res.json();
};
