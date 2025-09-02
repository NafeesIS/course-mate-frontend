import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CategoryForm, { CategoryFormData } from './CategoryForm';

interface CreateCategoryDialogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: CategoryFormData) => void;
  isLoading: boolean;
}

const CreateCategoryDialog: React.FC<CreateCategoryDialogDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] max-w-[95vw] overflow-y-auto md:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle className='text-lg font-medium text-gray-900'>
            Create New Category
          </DialogTitle>
          <DialogDescription className='text-sm text-gray-600'>
            Add a new category to organize your content.
          </DialogDescription>
        </DialogHeader>

        <div className='mt-4'>
          <CategoryForm
            onSubmit={onSubmit}
            onCancel={onClose}
            isLoading={isLoading}
            submitText='Create Category'
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDialog;
