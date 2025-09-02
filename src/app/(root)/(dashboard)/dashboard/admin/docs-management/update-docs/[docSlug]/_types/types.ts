import { IMedia, ITag } from '@/app/(root)/docs/_types/types';

export interface UpdateDocsFormData {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  subcategoryId?: string;
  categoryId: string;
  metaTitle?: string;
  metaDescription?: string;
  headerImageId?: IMedia | string;
  thumbnailId?: IMedia | string;
  isFeatured: boolean;
  tagIds: ITag[];
  mediaIds?: IMedia[] | string[];
  status?: 'archived' | 'draft' | 'published';
  headerImageUrl?: string;
  headerImageTitle?: string;
  thumbnailUrl?: string;
  thumbnailTitle?: string;
}

export interface UpdateDocsFormProps {
  initialData?: UpdateDocsFormData;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: UpdateDocsFormData) => void;
  isLoading: boolean;
  submitText: string;
}
