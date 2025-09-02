import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AlertCircle } from 'lucide-react';
import { RiLockUnlockLine } from 'react-icons/ri';

const ComingSoonDialog = ({ featureName }: { featureName: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='lg'
          className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-2 hover:bg-slate-50'
        >
          <RiLockUnlockLine className='text-base' />
          Access Details
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <div className='flex items-center gap-2'>
            <AlertCircle className='h-6 w-6 text-yellow-600' />
            <DialogTitle>Coming Soon!</DialogTitle>
          </div>
        </DialogHeader>
        <DialogDescription className='mt-2 text-sm'>
          This <strong>{featureName} Table</strong> feature is currently{' '}
          <strong>under development</strong> and will allow you to view detailed
          direct {featureName} information for directors.
          <br />
          <br />
          We&apos;re working on enabling access to accurate and verified{' '}
          <strong>{featureName}</strong> data. Please check back soon as we
          continue to expand this section.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default ComingSoonDialog;
