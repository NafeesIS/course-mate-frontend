'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatPriceWithCommas } from '@/lib/utils';
import { Check, Tag, Trash2, Users2 } from 'lucide-react';
import React from 'react';
import { TCartItem } from '../_store/cartStore';

interface BulkUnlockCartItemProps {
  item: TCartItem;
  index: number;
  // eslint-disable-next-line no-unused-vars
  removeItem: (index: number) => void;
  // eslint-disable-next-line no-unused-vars
  updateItem: (index: number, updatedItem: TCartItem) => void;
}

const BulkUnlockCartItem: React.FC<BulkUnlockCartItemProps> = ({
  item,
  index,
  removeItem,
  updateItem,
}) => {
  const handlePricingChange = (value: string) => {
    const newPricing = item.pricing.find((p) => p.credits === parseInt(value));
    if (newPricing) {
      const updatedItem = { ...item, selectedPricing: newPricing };
      updateItem(index, updatedItem);
    }
  };

  const saving =
    item.basePrice * item.selectedPricing.credits -
    item.selectedPricing.credits * item.selectedPricing.price;

  return (
    <div className='relative flex flex-row gap-4 sm:gap-6'>
      <div className='flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-primary-foreground md:size-12'>
        <Users2 className='size-5 md:size-6' />
      </div>
      <div className='flex-grow space-y-4'>
        <div className='flex items-start justify-between'>
          <div>
            <h3 className='text-sm font-semibold md:text-lg'>
              Unlock Director Credits
            </h3>
            {/* <ul className='ml-4 mt-2 list-item list-disc space-y-1 text-xs text-gray-600 md:text-sm'>
              {item.features.map((feature: string, i: number) => (
                <li key={i}>{feature}</li>
              ))}
            </ul> */}
            <ul className='mt-4 space-y-2 text-xs text-gray-700 md:text-sm'>
              <li className='flex items-center gap-2'>
                <Check className='size-4 text-green-600' />
                <span>
                  <span className='font-semibold'>Cost-Effective</span> - Save
                  More with Bulk Credits
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='size-4 text-green-600' />
                <span>
                  1 <span className='font-semibold'>Credit</span> = 1 Director
                  Contact
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='size-4 text-green-600' />
                <span>
                  <span className='font-semibold'>Complete Contact</span> -
                  Email & Phone Number
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='size-4 text-green-600' />
                <span>
                  <span className='font-semibold'>Flexible</span> - Use Credits
                  As You Need
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='size-4 text-green-600' />
                <span>
                  <span className='font-semibold'>Verified</span> Contact
                  Information
                </span>
              </li>
            </ul>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => removeItem(index)}
            className='absolute right-0 top-0 size-8 p-0 text-gray-400 transition-colors hover:text-red-600'
          >
            <Trash2 className='h-5 w-5' />
            <span className='sr-only'>Remove</span>
          </Button>
        </div>
        <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
          <Select
            value={item.selectedPricing.credits.toString()}
            onValueChange={handlePricingChange}
          >
            <SelectTrigger className='w-full sm:w-64'>
              <SelectValue placeholder='Select pricing' />
            </SelectTrigger>
            <SelectContent>
              {item.pricing.map((price, i) => (
                <SelectItem key={i} value={price.credits.toString()}>
                  {price.credits} credits at{' '}
                  {item.currency === 'INR' ? '₹' : '$'}
                  {price.price} each
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className='flex w-full flex-col items-end gap-2'>
            <div className='flex items-center justify-end gap-2'>
              <span className='font-semibold'>Total:</span>
              {saving > 0 && (
                <span className='strikethrough border-gray-700 text-sm font-medium text-muted-foreground'>
                  {item.currency === 'INR' ? '₹' : '$'}{' '}
                  {formatPriceWithCommas(
                    item.basePrice * item.selectedPricing.credits
                  )}
                </span>
              )}
              <p className='text-base font-semibold md:text-lg'>
                {item.currency === 'INR' ? '₹' : '$'}{' '}
                {formatPriceWithCommas(
                  item.selectedPricing.credits * item.selectedPricing.price
                )}
              </p>
            </div>
            {saving > 0 && (
              <p className='flex items-center text-xs text-green-700'>
                <Tag className='mr-1 size-3' /> You save{' '}
                {item.currency === 'INR' ? '₹' : '$'}
                {formatPriceWithCommas(saving)}!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUnlockCartItem;
