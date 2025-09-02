import { BASE_URL_BACKEND } from '@/constants';
import {
  CategoriesOptions,
  Doc,
  FetchOptions,
  HelpDocsOptions,
  ISubcategory,
  ProductDocsOptions,
  RecentDocsOptions,
} from '../_types/types';

// src/_services/services.ts
import { IRecentSearchTags } from '../_types/types'; // Adjust path as needed

// Assuming a type for search results (based on your code; adjust if needed)
export interface ISearchResult {
  // Example fields; customize based on your API response
  id: string;
  title: string;
  tags: IRecentSearchTags[]; // Tags are extracted from here in your component
  // Add other fields as per your API
}

export const getPopularTags = async (): Promise<IRecentSearchTags[]> => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/tag?page=1&limit=5`,
    { cache: 'no-store' } // Force fresh fetch
  );

  if (!res.ok) {
    throw new Error('Failed to fetch popular tags'); // Throw for hook to catch
  }

  const data = await res.json();
  return data?.data?.tags || [];
};

export const getSearchResults = async (
  searchTerm: string
): Promise<ISearchResult[]> => {
  if (!searchTerm) return [];

  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/search?searchTerm=${encodeURIComponent(searchTerm)}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch search results');
  }

  const data = await res.json();
  return data?.data || [];
};

export const getFeaturedDocs = async (
  options: FetchOptions = {}
): Promise<Doc[]> => {
  const { limit = 3, page = 1, sort = 'desc' } = options;
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs?isFeatured=true&sort=${sort}&limit=${limit}&page=${page}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch charge details');
    return [];
  }

  const data = await res.json();

  if (!data.success) {
    return [];
  }

  return data.data.data;
};

export const getHelpDocs = async (options: HelpDocsOptions): Promise<Doc[]> => {
  const { categoryId, limit, page = 1, sort = 'desc' } = options;

  let url = `${BASE_URL_BACKEND}/api/v1/docs?categoryId=${categoryId}&sort=${sort}&page=${page}`;

  if (limit) {
    url += `&limit=${limit}`;
  }

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      `Failed to fetch help docs: ${res.status} ${res.statusText}`
    );
  }

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch help documentation');
  }

  return data.data.data;
};

export const getSubcategories = async (
  options: CategoriesOptions
): Promise<ISubcategory[]> => {
  const { categoryId } = options;

  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/subcategory/category/${categoryId}`
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

export const getDocsBySubcategory = async (
  options: ProductDocsOptions
): Promise<Doc[]> => {
  const { subcategoryId, limit, page = 1, sort = 'desc' } = options;

  let url = `${BASE_URL_BACKEND}/api/v1/docs?subcategoryId=${subcategoryId}&sort=${sort}&page=${page}&limit=3`;

  if (limit) {
    url += `&limit=${limit}`;
  }

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      `Failed to fetch docs by subcategory: ${res.status} ${res.statusText}`
    );
  }

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch documentation');
  }

  return data.data.data;
};

export const getRecentDocs = async (
  options: RecentDocsOptions = {}
): Promise<Doc[]> => {
  const { limit = 6, page = 1, sort = 'desc' } = options;

  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs?sort=${sort}&page=${page}&limit=${limit}`
    // { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch recent docs: ${res.status} ${res.statusText}`
    );
  }

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch recent documentation');
  }

  return data.data.data;
};
