'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'sonner';
import { deleteCoupon } from '../_services/services';

interface ActionDeleteDialogProps {
  data: {
    code: string;
    redemptions: number;
  };
  fetchCoupons: () => void; // Function to refresh coupon list
}

export const ActionDeleteDialog = ({
  data,
  fetchCoupons,
}: ActionDeleteDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // React Query mutation for deleting a coupon
  const deleteCouponMutation = useMutation<
    unknown, // Response type from the API
    Error, // Error type
    string // Variable type (input to the mutation function)
  >({
    mutationFn: (code: string) => deleteCoupon(code),
    onSuccess: () => {
      toast.success('Coupon deleted successfully!');
      fetchCoupons(); // Refresh the coupon list
      setOpen(false); // Close the dialog
      setLoading(false); // Close the dialog
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error('Failed to delete the coupon.');
      setOpen(false); // Close the dialog
      setLoading(false); // Close the dialog
    },
  });

  const handleConfirmDelete = () => {
    setLoading(true); // Close the dialog
    deleteCouponMutation.mutate(data.code);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='destructive'
          size='sm'
          className='h-7 px-2'
          disabled={data.redemptions > 0} // Disable if redemptions > 0
        >
          <RiDeleteBin6Line />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:min-w-[638px]'>
        <DialogHeader>
          <DialogTitle>
            <DialogDescription className='text-base font-semibold leading-none tracking-tight text-black md:text-lg'>
              {' '}
              Are you sure you want to delete this coupon {data.code}?{' '}
            </DialogDescription>
          </DialogTitle>
        </DialogHeader>

        <DialogFooter className='flex justify-between gap-2'>
          <Button
            variant='outline'
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            No
          </Button>
          <Button
            variant='destructive'
            onClick={handleConfirmDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Yes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
