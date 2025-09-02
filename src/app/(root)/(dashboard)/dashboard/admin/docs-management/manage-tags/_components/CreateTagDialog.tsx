import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TagFormData } from '../_types/types';
import TagForm from './TagForm';

interface CreateTagDialogProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: TagFormData) => void;
  isLoading: boolean;
}

const CreateTagDialog: React.FC<CreateTagDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-lg font-medium text-gray-900'>
            Create New Tag
          </DialogTitle>
          <DialogDescription className='text-sm text-gray-600'>
            Add a new tag to organize your content.
          </DialogDescription>
        </DialogHeader>

        <div className='mt-4'>
          <TagForm
            onSubmit={onSubmit}
            onCancel={onClose}
            isLoading={isLoading}
            submitText='Create Tag'
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTagDialog;
