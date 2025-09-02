'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface CouponDialogProps {
  open: boolean;
  onClose: () => void;
  responseData: {
    code: string;
    type: string;
    value: number;
    expiryDate: string;
    maxRedemptions: number;
    createdAt: string;
  } | null;
}

export default function CouponDialog({
  open,
  onClose,
  responseData,
}: CouponDialogProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (responseData) {
      const formattedData = `
Coupon Code: ${responseData?.code}
Discount Type: ${responseData?.type}
Discount Value: ${responseData?.value}
Expiry Date: ${format(new Date(responseData.expiryDate), 'dd MMM yyyy hh:mm a')}
Max Redemptions: ${responseData?.maxRedemptions}
Created At: ${format(new Date(responseData.createdAt), 'dd MMM yyyy hh:mm a')}
`;
      navigator.clipboard
        .writeText(formattedData)
        .then(() => {
          toast.success('Data copied to clipboard!');
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000); // Reset copied state after 2 seconds
        })
        .catch(() => toast.error('Failed to copy data.'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='rounded-lg text-center shadow-lg'>
        <DialogHeader>
          <DialogTitle className='text-center text-lg font-semibold text-primary'>
            🎉 Coupon Created Successfully
          </DialogTitle>
        </DialogHeader>
        {responseData ? (
          <div className='mt-2 space-y-3'>
            <p className='text-base font-medium text-gray-800'>
              <strong>Coupon Code:</strong>{' '}
              <span className='font-normal text-primary'>
                {responseData?.code}
              </span>
            </p>
            <p className='text-base font-medium text-gray-800'>
              <strong>Discount Type:</strong>{' '}
              <span className='font-normal text-primary'>
                {responseData?.type}
              </span>
            </p>
            <p className='text-base font-medium text-gray-800'>
              <strong>Discount Value:</strong>{' '}
              <span className='font-normal text-primary'>
                {responseData?.value}
              </span>
            </p>
            <p className='text-base font-medium text-gray-800'>
              <strong>Expiry Date:</strong>{' '}
              <span className='font-normal text-primary'>
                {format(
                  new Date(responseData.expiryDate),
                  'dd MMM yyyy, hh:mm a'
                )}
              </span>
            </p>
            <p className='text-base font-medium text-gray-800'>
              <strong>Max Redemptions:</strong>{' '}
              <span className='font-normal text-primary'>
                {responseData?.maxRedemptions}
              </span>
            </p>
            <p className='text-base font-medium text-gray-800'>
              <strong>Created At:</strong>{' '}
              <span className='font-normal text-primary'>
                {format(
                  new Date(responseData.createdAt),
                  'dd MMM yyyy, hh:mm a'
                )}
              </span>
            </p>
          </div>
        ) : (
          <p className='text-center text-gray-600'>No data available</p>
        )}
        <div className='mt-4 flex justify-end space-x-3'>
          <Button
            variant='outline'
            className='text-red-600 hover:bg-red-100'
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            className='flex items-center space-x-1 bg-primary text-white hover:bg-blue-700'
            onClick={handleCopy}
            disabled={isCopied}
          >
            <Copy size={16} />
            <span>{isCopied ? 'Copied!' : 'Copy'}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
