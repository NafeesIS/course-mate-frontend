export interface CreateDocsFormData {
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
}

export interface CreateDocsFormProps {
  initialData?: CreateDocsFormData;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: CreateDocsFormData) => void;
  // onCancel: () => void;
  isLoading: boolean;
  submitText: string;
  resetSignal: boolean;
}
