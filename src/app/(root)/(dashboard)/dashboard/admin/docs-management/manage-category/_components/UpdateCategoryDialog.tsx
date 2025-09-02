import { ICategory } from '@/app/(root)/docs/_types/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CategoryForm, { CategoryFormData } from './CategoryForm';

interface UpdateCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: CategoryFormData) => void;
  isLoading: boolean;
  category: ICategory | null;
}

const UpdateCategoryDialog: React.FC<UpdateCategoryDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  category,
}) => {
  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] max-w-[95vw] overflow-y-auto md:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle className='text-lg font-medium text-gray-900'>
            Update Category
          </DialogTitle>
          <DialogDescription className='text-sm text-gray-600'>
            Make changes to the category information.
          </DialogDescription>
        </DialogHeader>

        <div className='mt-4'>
          <CategoryForm
            initialData={{
              name: category.name,
              slug: category.slug,
              metaDescription: category.metaDescription,
              description: category.description,
              metaTitle: category.metaTitle,
              status: category.status,
            }}
            onSubmit={onSubmit}
            onCancel={onClose}
            isLoading={isLoading}
            submitText='Update Category'
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCategoryDialog;
