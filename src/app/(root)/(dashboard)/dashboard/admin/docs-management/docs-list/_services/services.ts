import { Doc, IMedia } from '@/app/(root)/docs/_types/types';
import { BASE_URL_BACKEND } from '@/constants';
import { UpdateDocsFormData } from '../_components/UpdateDocForm';

export const getAllDocs = async ({
  page,
  limit,
  sort = 'desc',
  sortBy = 'createdAt',
  search,
  status,
}: {
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  sortBy?: 'createdAt' | 'updatedAt';
  search?: string;
  status?: string;
}): Promise<{ data: Doc[]; meta: any }> => {
  const queryParams = new URLSearchParams();
  if (limit) queryParams.append('limit', String(limit));
  if (page) queryParams.append('page', String(page));
  if (sort) queryParams.append('sort', sort);
  if (sortBy) queryParams.append('sortBy', sortBy);
  if (search) queryParams.append('searchTerm', search);
  if (status) queryParams.append('status', String(status));

  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs?${queryParams.toString()}`,
    { cache: 'no-store' }
  );
  const allData = await res.json();
  if (!res.ok) {
    throw new Error(allData?.message || 'Failed to get subcategory');
  }

  if (!allData.success) return { data: [], meta: null };

  const { data, meta } = allData.data;

  return { data, meta };
};

export const deleteDocs = async (docId: string): Promise<Doc | null> => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/docs/delete-doc/${docId}`,
    {
      method: 'DELETE',
    }
  );
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to delete Documentation');
  }
  return data.success ? data.data : null;
};

export const updateDoc = async (
  docId: string,
  doc: UpdateDocsFormData
): Promise<Doc | null> => {
  let res;
  if (doc.status === 'draft') {
    res = await fetch(
      `${BASE_URL_BACKEND}/api/v1/docs/update-draft-doc/${docId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doc),
      }
    );
  } else {
    res = await fetch(`${BASE_URL_BACKEND}/api/v1/docs/update-doc/${docId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doc),
    });
  }

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
      data?.message || 'Something went wrong while updating docs'
    );
  }

  return data.success ? data.data : null;
};

export const createDocs = async (doc: {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  subcategoryId?: string;
  categoryId: string;
  metaTitle?: string;
  metaDescription?: string;
  headerImageId?: string;
  thumbnailId?: string;
  isFeatured: boolean;
  tagIds: string[];
  mediaIds?: string[];
  status?: 'archived' | 'draft' | 'published';
}): Promise<Doc | null> => {
  let res;
  if (doc.status === 'draft') {
    res = await fetch(`${BASE_URL_BACKEND}/api/v1/docs/create-draft-doc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doc),
    });
  } else {
    res = await fetch(`${BASE_URL_BACKEND}/api/v1/docs/create-doc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doc),
    });
  }

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
      data?.message || 'Something went wrong while creating docs'
    );
  }

  return data.success ? data.data : null;
};

// _services/services.ts
export const createMedia = async (files: File[]): Promise<IMedia | null> => {
  if (!files.length) return null;
  const formData = new FormData();
  formData.append('file', files[0]);

  const res = await fetch(`${BASE_URL_BACKEND}/api/v1/docs/create-media`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
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
      data?.message || 'Something went wrong while uploading media'
    );
  }

  return data.success ? data.data : null;
};

export const getSingleMedia = async (mediaId: string): Promise<Doc | null> => {
  const res = await fetch(`${BASE_URL_BACKEND}/api/v1/docs/media/${mediaId}`, {
    method: 'GET',
    cache: 'no-store',
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to get media');
  }
  return data.success ? data.data : null;
};
