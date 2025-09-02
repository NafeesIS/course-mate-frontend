import { ITag } from '@/app/(root)/docs/_types/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

interface DeleteTagDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  tag: ITag | null;
}

const DeleteTagDialog: React.FC<DeleteTagDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  tag,
}) => {
  if (!tag) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <div className='flex items-start gap-4'>
            <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100'>
              <Trash2 className='h-6 w-6 text-red-600' />
            </div>
            <div className='flex-1'>
              <DialogTitle className='text-lg font-medium text-gray-900'>
                Delete Tag
              </DialogTitle>
              <DialogDescription className='mt-2 text-sm text-gray-500'>
                Are you sure you want to delete the tag {tag.name}? This action
                cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className='gap-2 sm:gap-0'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTagDialog;
