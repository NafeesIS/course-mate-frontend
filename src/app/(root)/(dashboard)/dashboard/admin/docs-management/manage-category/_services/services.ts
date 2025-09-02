import { ICategory } from '@/app/(root)/docs/_types/types';
import { BASE_URL_BACKEND } from '@/constants';

export const getAllCategories = async ({
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
}): Promise<{ categories: ICategory[]; meta: any }> => {
  const queryParams = new URLSearchParams();
  if (limit) queryParams.append('limit', String(limit));
  if (page) queryParams.append('page', String(page));
  if (sort) queryParams.append('sort', sort);
  if (sortBy) queryParams.append('sortBy', sortBy);
  if (search) queryParams.append('searchTerm', search);

  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/category?${queryParams.toString()}`,
    { cache: 'no-store' }
  );
  const allData = await res.json();
  if (!res.ok) {
    throw new Error(allData?.message || 'Failed to get category');
  }

  if (!allData.success) return { categories: [], meta: null };

  const { categories, meta } = allData.data;

  return { categories, meta };
};

export const deleteCategory = async (
  categoryId: string
): Promise<ICategory | null> => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/soft-delete-category/${categoryId}`,
    {
      method: 'DELETE',
    }
  );
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to delete category');
  }
  return data.success ? data.data : null;
};

export const updateCategory = async (
  categoryId: string,
  slug?: string,
  name?: string
): Promise<ICategory | null> => {
  // Build the request body based on which fields are provided
  const requestBody: { slug?: string; name?: string } = {};
  if (slug) requestBody.slug = slug;
  if (name) requestBody.name = name;

  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/update-category/${categoryId}`,
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

    throw new Error(
      data?.message || 'Something went wrong while updating category'
    );
  }

  return data.success ? data.data : null;
};

export const createCategory = async (category: {
  name: string;
  slug?: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  status?: 'active' | 'archived';
}): Promise<ICategory | null> => {
  const res = await fetch(`${BASE_URL_BACKEND}/api/v1/docs/create-category`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
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
      data?.message || 'Something went wrong while creating category'
    );
  }

  return data.success ? data.data : null;
};
