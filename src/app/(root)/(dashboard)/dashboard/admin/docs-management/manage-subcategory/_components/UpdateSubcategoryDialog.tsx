import { ISubcategory } from '@/app/(root)/docs/_types/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import SubcategoryForm, { SubcategoryFormData } from './SubcategoryForm';

interface UpdateSubcategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: SubcategoryFormData) => void;
  isLoading: boolean;
  subcategory: ISubcategory | null;
}

const UpdateSubcategoryDialog: React.FC<UpdateSubcategoryDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  subcategory,
}) => {
  if (!subcategory) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] max-w-[95vw] overflow-y-auto md:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle className='text-lg font-medium text-gray-900'>
            Update Subcategory
          </DialogTitle>
          <DialogDescription className='text-sm text-gray-600'>
            Make changes to the subcategory information.
          </DialogDescription>
        </DialogHeader>

        <div className='mt-4'>
          <SubcategoryForm
            initialData={{
              name: subcategory.name,
              slug: subcategory.slug,
              metaDescription: subcategory.metaDescription,
              description: subcategory.description,
              metaTitle: subcategory.metaTitle,
              status: subcategory.status,
              categoryId: subcategory.categoryId._id,
            }}
            onSubmit={onSubmit}
            onCancel={onClose}
            isLoading={isLoading}
            submitText='Update Subcategory'
            isUpdateForm={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSubcategoryDialog;
