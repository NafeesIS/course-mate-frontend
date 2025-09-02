import { BASE_URL_BACKEND } from '@/constants';
import { Doc, ICategory, ISubcategory } from '../../../_types/types';

export const getAllCategories = async (): Promise<{
  categories: ICategory[];
  meta: any;
}> => {
  const res = await fetch(`${BASE_URL_BACKEND}/api/v1/docs/category`, {
    cache: 'no-store',
  });

  if (!res.ok) return { categories: [], meta: null };

  const allData = await res.json();
  if (!allData.success) return { categories: [], meta: null };

  const { categories, meta } = allData.data;

  return { categories, meta };
};

export const getSubcategoriesByCategory = async (
  categoryId: string
): Promise<ISubcategory[]> => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/subcategory/category/${categoryId}`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  if (!data.success) {
    return [];
  }

  return data.data.subcategories;
};

export const getDocsByCategorySubcategory = async ({
  categoryId,
  subcategoryId,
  isFeatured,
  isHomepage,
  page,
  limit,
  search,
  sort = 'desc',
  sortBy = 'updatedAt',
  status = 'published',
}: {
  categoryId?: string;
  subcategoryId?: string;
  isFeatured?: boolean;
  isHomepage?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
  sortBy?: string;
  search?: string;
  status?: string;
}): Promise<{ data: Doc[]; meta: any }> => {
  const queryParams = new URLSearchParams();
  if (categoryId) queryParams.append('categoryId', categoryId);
  if (subcategoryId) queryParams.append('subcategoryId', subcategoryId);
  if (status) queryParams.append('status', status);
  if (sort) queryParams.append('sort', sort);
  if (sortBy) queryParams.append('sortBy', sortBy);
  if (isFeatured) queryParams.append('isFeatured', 'true');
  if (isHomepage) queryParams.append('isHomepage', 'true');
  if (search) queryParams.append('searchTerm', search);
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
