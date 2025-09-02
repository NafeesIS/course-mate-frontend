export interface TagFormData {
  name: string;
  slug: string;
}

export interface TagFormProps {
  initialData?: TagFormData;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: TagFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
  submitText: string;
}
