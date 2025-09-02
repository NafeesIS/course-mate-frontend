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

interface DeleteCommentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  isReply?: boolean;
}

const DeleteCommentDialog: React.FC<DeleteCommentDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  isReply = false,
}) => {
  const itemType = isReply ? 'reply' : 'comment';

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
                Delete {isReply ? 'Reply' : 'Comment'}
              </DialogTitle>
              <DialogDescription className='mt-2 text-sm text-gray-500'>
                Are you sure you want to delete this {itemType}?
                {/* {truncatedText && (
                  <span className='mt-2 block rounded-md bg-gray-50 p-2 italic text-gray-700'>
                    {truncatedText}
                  </span>
                )} */}
                This action cannot be undone.
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

export default DeleteCommentDialog;
