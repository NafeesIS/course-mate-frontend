import { BASE_URL_BACKEND } from '@/constants';

export const fetchCompanyAlertPlanData = async () => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/service-catalog/filter?serviceNames=New%20Company%20Alert%20-%20Email%20Only,New%20Company%20Alert%20-%20Email%20and%20Phone`,
    { cache: 'no-store' }
  );
  if (!res.ok) {
    return null;
  }
  return res.json();
};

export const fetchCompanyAndLLPCounts = async () => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/companies/getCompanyAndLLPCounts`,
    {
      next: {
        revalidate: 86400, // Cache for 24 hours (in seconds)
      },
    }
  );
  if (!res.ok) {
    return null;
  }
  return res.json();
};
