import { ITag } from '@/app/(root)/docs/_types/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TagFormData } from '../_types/types';
import TagForm from './TagForm';

interface UpdateTagDialogProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: TagFormData) => void;
  isLoading: boolean;
  tag: ITag | null;
}

const UpdateTagDialog: React.FC<UpdateTagDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  tag,
}) => {
  if (!tag) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-lg font-medium text-gray-900'>
            Update Tag
          </DialogTitle>
          <DialogDescription className='text-sm text-gray-600'>
            Make changes to the tag information.
          </DialogDescription>
        </DialogHeader>

        <div className='mt-4'>
          <TagForm
            initialData={{ name: tag.name, slug: tag.slug }}
            onSubmit={onSubmit}
            onCancel={onClose}
            isLoading={isLoading}
            submitText='Update Tag'
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTagDialog;
