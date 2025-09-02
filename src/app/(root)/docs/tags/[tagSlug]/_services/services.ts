import { BASE_URL_BACKEND } from '@/constants';
import { Doc, ITag } from '../../../_types/types';

export const getAllTags = async (): Promise<ITag[]> => {
  const res = await fetch(`${BASE_URL_BACKEND}/api/v1/docs/tag`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  if (!data.success) {
    return [];
  }

  return data.data.tags;
};

export const getDocsByTag = async (
  tagId?: string,
  page?: number,
  limit?: number
): Promise<{ data: Doc[]; meta: any }> => {
  const queryParams = new URLSearchParams();

  if (tagId) queryParams.append('tagId', tagId);
  if (limit) queryParams.append('limit', String(limit));
  if (page) queryParams.append('page', String(page));
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs?${queryParams.toString()}`,
    { cache: 'no-store' }
  );

  if (!res.ok) return { data: [], meta: null };

  const allData = await res.json();
  if (!allData.success) return { data: [], meta: null };

  const { data, meta } = allData.data;
  return { data, meta };
};
