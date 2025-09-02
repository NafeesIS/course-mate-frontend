'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import CouponUpdateForm from './CouponUpdateForm';

interface ActionUpdateDialogProps {
  data: any;
  fetchCoupons: () => void;
}

export const ActionUpdateDialog = ({
  data,
  fetchCoupons,
}: ActionUpdateDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='sm' className='h-7 px-2'>
          <FaRegEdit />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-screen overflow-y-scroll lg:max-h-full lg:overflow-y-visible'>
        <DialogHeader>
          <DialogTitle>
            <DialogDescription className='text-center text-base font-semibold leading-none tracking-tight text-black md:text-lg'>
              Update Coupon: {data.code}
            </DialogDescription>
          </DialogTitle>
        </DialogHeader>
        <CouponUpdateForm
          data={data}
          onClose={() => setOpen(false)}
          fetchCoupons={fetchCoupons}
        />
      </DialogContent>
    </Dialog>
  );
};
