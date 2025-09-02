'use client';
import SignInBtn from '@/components/shared/Header/SignInBtn';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-lg font-medium text-gray-900'>
            Sign in required
          </DialogTitle>
          <DialogDescription className='text-sm text-gray-500'>
            Please sign in to post comments and replies.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='gap-2 sm:gap-0'>
          <Button type='button' variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <SignInBtn />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
