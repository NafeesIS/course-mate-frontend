import { BASE_URL_BACKEND } from '@/constants';
import axios from 'axios';
import {
  ICompanySuggestion,
  IContactStatus,
  IDirectorDetails,
  IDirectorSuggestion,
  IUnlockContact,
  IUnlockContactResponse,
  IUnlockedContactsApiResponse,
} from '../_types/types';

export const fetchDirectorSuggestions = async (
  searchTerm: string
): Promise<IDirectorSuggestion[]> => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/directors/suggestions?searchTerm=${searchTerm}`
  );
  const data = await res.json();
  return data.data;
};

export const fetchCompanySuggestions = async (
  searchTerm: string
): Promise<ICompanySuggestion[]> => {
  const response = await fetch(
    `${BASE_URL_BACKEND}/api/v1/companies/dashboard-company-suggestions?searchTerm=${searchTerm}`
  );
  const data = await response.json();
  return data.data;
};

export const fetchDirectorInfo = async (
  din: string
): Promise<IDirectorDetails> => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/directors/directorInfo?din=${din}`
  );
  const data = await res.json();
  return data.data;
};

export const fetchContactStatus = async (
  din: string
): Promise<IContactStatus> => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/directors/checkContactStatus?din=${din}`
  );
  const data = await res.json();
  return data.data;
};

export const fetchUnmaskedContact = async (
  userId: string,
  directorId: string,
  creditType: string
): Promise<IUnlockContact> => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/unlock-contact/bulk-credit`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _userId: userId,
        directorId: directorId,
        creditType: creditType,
      }),
    }
  );
  if (!res.ok) {
    throw new Error('Failed to unlock contact');
  }

  const data: IUnlockContactResponse = await res.json();
  return data.data;
};

export const fetchUnlockedContacts = async ({
  queryKey,
}: {
  queryKey: (string | number)[];
}) => {
  const [
    ,
    userId,
    page,
    limit,
    sortBy = 'unlockedAt',
    order = 'desc',
    search = '',
  ] = queryKey;

  if (typeof userId !== 'string') {
    throw new Error('Invalid user ID');
  }

  const response = await axios.get<IUnlockedContactsApiResponse>(
    `${BASE_URL_BACKEND}/api/v1/unlock-contact/user-unlocked-contacts?_userId=${userId}&sortBy=${sortBy}&order=${order}&search=${search}&page=${page}&limit=${limit}`
  );

  return response.data;
};
