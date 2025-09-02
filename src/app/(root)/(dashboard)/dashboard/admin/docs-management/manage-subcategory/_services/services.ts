import { ISubcategory } from '@/app/(root)/docs/_types/types';
import { BASE_URL_BACKEND } from '@/constants';

export const getAllSubcategories = async ({
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
}): Promise<{ subcategories: ISubcategory[]; meta: any }> => {
  const queryParams = new URLSearchParams();
  if (limit) queryParams.append('limit', String(limit));
  if (page) queryParams.append('page', String(page));
  if (sort) queryParams.append('sort', sort);
  if (sortBy) queryParams.append('sortBy', sortBy);
  if (search) queryParams.append('searchTerm', search);

  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/subcategory?${queryParams.toString()}`,
    { cache: 'no-store' }
  );
  const allData = await res.json();
  if (!res.ok) {
    throw new Error(allData?.message || 'Failed to get subcategory');
  }

  if (!allData.success) return { subcategories: [], meta: null };

  const { subcategories, meta } = allData.data;

  return { subcategories, meta };
};

export const deleteSubcategory = async (
  subcategoryId: string
): Promise<ISubcategory | null> => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/soft-delete-subcategory/${subcategoryId}`,
    {
      method: 'DELETE',
    }
  );
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to delete subcategory');
  }
  return data.success ? data.data : null;
};

export const updateSubcategory = async (
  subcategoryId: string,
  slug?: string,
  name?: string,
  isHomepage?: boolean
): Promise<ISubcategory | null> => {
  // Build the request body based on which fields are provided
  const requestBody: { slug?: string; name?: string; isHomepage?: string } = {};

  if (slug) requestBody.slug = slug;
  if (name) requestBody.name = name;
  if (typeof isHomepage === 'boolean') {
    requestBody.isHomepage = isHomepage ? 'true' : 'false';
  }

  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/update-subcategory/${subcategoryId}`,
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
      data?.message || 'Something went wrong while updating subcategory'
    );
  }

  return data.success ? data.data : null;
};

export const createSubcategory = async (subcategory: {
  name: string;
  slug?: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  status?: 'active' | 'archived';
}): Promise<ISubcategory | null> => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/create-subcategory`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subcategory),
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
      data?.message || 'Something went wrong while creating subcategory'
    );
  }

  return data.success ? data.data : null;
};
