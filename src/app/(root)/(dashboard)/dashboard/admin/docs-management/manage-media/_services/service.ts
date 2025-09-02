import { BASE_URL_BACKEND } from '@/constants';
import { GetMediaParams, MediaListResponse } from '../_types/_types';

// services/_services/service.ts

export const getMedia = async (
  params: GetMediaParams = {}
): Promise<MediaListResponse> => {
  const url = new URL(`${BASE_URL_BACKEND}/api/v1/docs/media`);
  const qp: Record<string, string> = {};

  if (params.prefix) qp.prefix = params.prefix;
  if (typeof params.pageSize === 'number')
    qp.pageSize = String(params.pageSize);
  if (params.continuationToken) qp.continuationToken = params.continuationToken;
  if (params.sas) qp.sas = 'true';
  if (typeof params.sasTtl === 'number') qp.sasTtl = String(params.sasTtl);

  Object.entries(qp).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    credentials: 'include',
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) return { items: [], continuationToken: null };

  const data = await res.json();
  if (!data?.success) return { items: [], continuationToken: null };

  return data.data as MediaListResponse;
};
