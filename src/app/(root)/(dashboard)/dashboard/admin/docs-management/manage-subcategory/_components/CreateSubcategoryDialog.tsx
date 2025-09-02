import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import SubcategoryForm, { SubcategoryFormData } from './SubcategoryForm';

interface CreateSubcategoryDialogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: SubcategoryFormData) => void;
  isLoading: boolean;
  categoryId?: string;
  name?: string;
  description?: string;
}

const CreateSubcategoryDialog: React.FC<CreateSubcategoryDialogDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  categoryId = '',
  name = '',
  description = '',
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] max-w-[95vw] overflow-y-auto md:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle className='text-lg font-medium text-gray-900'>
            Create New Subcategory
          </DialogTitle>
          <DialogDescription className='text-sm text-gray-600'>
            Add a new subcategory to organize your content.
          </DialogDescription>
        </DialogHeader>

        <div className='mt-4'>
          <SubcategoryForm
            initialData={{ categoryId, name, description }}
            onSubmit={onSubmit}
            onCancel={onClose}
            isLoading={isLoading}
            submitText='Create Subcategory'
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSubcategoryDialog;
