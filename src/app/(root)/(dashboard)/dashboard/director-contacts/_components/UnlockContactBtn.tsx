import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Coins, Lock } from 'lucide-react';
import Link from 'next/link';

const UnlockContactBtn = ({
  maskedContactStatus,
  credits,
  handleUnlock,
  isUnlocking,
}: {
  maskedContactStatus: any;
  credits: number;
  handleUnlock: () => void;
  isUnlocking: boolean;
}) => {
  return (
    <>
      {credits < 1 ? (
        <div>
          <p className='mb-2 max-w-64 text-balance text-center text-xs'>
            * You do not have enough credits to unlock this contact.
          </p>
          <Link
            href='/unlock-contact/bulk-unlock'
            prefetch={false}
            className={cn(
              buttonVariants({ variant: 'default' }),
              'w-full bg-green-600 text-sm hover:bg-green-700 sm:w-auto md:text-base' // Updated color to a more prominent one for better conversion
            )}
          >
            <Coins className='mr-2 h-4 w-4' />{' '}
            {/* Changed icon to CreditCard */}
            Get Credits Now {/* Updated text to be more action-oriented */}
          </Link>
        </div>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className='w-full text-sm sm:w-auto md:text-base'
              disabled={
                (!maskedContactStatus?.emailAddress &&
                  !maskedContactStatus?.mobileNumber) ||
                isUnlocking ||
                credits < 1
              }
            >
              <Lock className='mr-2 h-4 w-4' />
              Unlock Contact (1 Credit)
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unlock Contact Details</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to unlock this contact? This action will
                deduct 1 credit from your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleUnlock}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default UnlockContactBtn;
