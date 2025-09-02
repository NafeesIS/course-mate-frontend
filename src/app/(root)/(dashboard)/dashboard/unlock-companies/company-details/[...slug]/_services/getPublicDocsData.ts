import { BASE_URL_BACKEND } from '@/constants';

const getLLPPublicDocs = async (
  userId: string,
  cin: string,
  isUnlocked?: boolean,
  isAdmin?: boolean
) => {
  const apiUrl = isUnlocked
    ? isAdmin
      ? `${BASE_URL_BACKEND}/api/v1/companies/admin/paid-llp-public-documents`
      : `${BASE_URL_BACKEND}/api/v1/companies/paid-llp-public-documents`
    : `${BASE_URL_BACKEND}/api/v1/companies/llp-public-documents`;

  const res = await fetch(
    isUnlocked ? apiUrl : `${apiUrl}?cin=${cin}&_userId=${userId}`,
    {
      method: isUnlocked ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...(isUnlocked && {
        body: JSON.stringify({
          _userId: userId,
          cin: cin,
        }),
      }),
    }
  );

  return res;
};

const getCompanyPublicDocs = async (
  userId: string,
  cin: string,
  version?: 'v2' | 'v3',
  isUnlocked?: boolean,
  isAdmin?: boolean
) => {
  let apiUrl: string;
  let method: string = 'POST';

  if (isUnlocked) {
    apiUrl = isAdmin
      ? `${BASE_URL_BACKEND}/api/v1/companies/admin/paid-company-vpd`
      : `${BASE_URL_BACKEND}/api/v1/companies/paid-company-vpd`;
  } else {
    apiUrl = `${BASE_URL_BACKEND}/api/v1/companies/company-public-documents`;
    method = 'GET';
  }

  const res = await fetch(
    method === 'GET'
      ? `${apiUrl}?cin=${cin}${version ? `&version=${version}` : ''}`
      : apiUrl,
    {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(method === 'POST' && {
        body: JSON.stringify({
          _userId: userId,
          cin: cin,
          version: version,
        }),
      }),
    }
  );

  return res;
};

export const getPublicDocsData = async (
  userId: string,
  companyType: string,
  cin: string,
  version?: 'v2' | 'v3',
  isUnlocked?: boolean,
  isAdmin?: boolean
): Promise<any> => {
  const res =
    companyType === 'LLP'
      ? await getLLPPublicDocs(userId, cin, isUnlocked, isAdmin)
      : await getCompanyPublicDocs(userId, cin, version, isUnlocked, isAdmin);

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || 'Failed to fetch public documents',
      data: [],
    };
  }

  return data;
};
