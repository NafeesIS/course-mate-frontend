import { ITag } from '@/app/(root)/docs/_types/types';
import { BASE_URL_BACKEND } from '@/constants';

export const getAllTags = async ({
  page,
  limit,
  sort = 'desc',
  sortBy = 'createdAt',
  search,
}: {
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  sortBy?: 'createdAt' | 'updatedAt';
  search?: string;
}): Promise<{ tags: ITag[]; meta: any }> => {
  const queryParams = new URLSearchParams();
  if (limit) queryParams.append('limit', String(limit));
  if (page) queryParams.append('page', String(page));
  if (sort) queryParams.append('sort', sort);
  if (sortBy) queryParams.append('sortBy', sortBy);
  if (search) queryParams.append('searchTerm', search);

  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/tag?${queryParams.toString()}`,
    { cache: 'no-store' }
  );

  if (!res.ok) return { tags: [], meta: null };

  const allData = await res.json();
  if (!allData.success) return { tags: [], meta: null };

  const { tags, meta } = allData.data;

  return { tags, meta };
};

export const deleteTag = async (tagId: string): Promise<ITag | null> => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/soft-delete-tag/${tagId}`,
    {
      method: 'DELETE',
    }
  );
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong while deleting tag');
  }
  return data.success ? data.data : null;
};

export const updateTag = async (
  tagId: string,
  slug?: string,
  name?: string
): Promise<ITag | null> => {
  // Build the request body based on which fields are provided
  const requestBody: { slug?: string; name?: string } = {};
  if (slug) requestBody.slug = slug;
  if (name) requestBody.name = name;

  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/update-tag/${tagId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }
  );

  const data = await res.json();
  if (!res.ok) {
    if (
      data?.message === 'Validation Error' &&
      Array.isArray(data?.errorSources) &&
      data.errorSources.length > 0
    ) {
      const firstError = data?.errorSources?.[0];
      const errorText = `${firstError?.path || ''}: ${firstError?.message || ''}`;
      throw new Error(errorText);
    }

    throw new Error(data?.message || 'Something went wrong while updating tag');
  }

  return data.success ? data.data : null;
};

export const createTag = async (
  name: string,
  slug: string
): Promise<ITag | null> => {
  const res = await fetch(`${BASE_URL_BACKEND}/api/v1/docs/create-tag`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ slug: slug, name: name }),
  });
  const data = await res.json();
  if (!res.ok) {
    if (
      data?.message === 'Validation Error' &&
      Array.isArray(data?.errorSources) &&
      data.errorSources.length > 0
    ) {
      const firstError = data?.errorSources?.[0];
      const errorText = `${firstError?.path || ''}: ${firstError?.message || ''}`;
      throw new Error(errorText);
    }

    throw new Error(
      data?.message || 'Something went wrong while creating tags'
    );
  }
  return data.success ? data.data : null;
};
