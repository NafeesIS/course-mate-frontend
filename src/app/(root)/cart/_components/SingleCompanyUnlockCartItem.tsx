import { Button } from '@/components/ui/button';
import { formatToUrl } from '@/lib/formatters';
import { formatPriceWithCommas } from '@/lib/utils';
import { Building, Check, Tag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { TCartItem } from '../_store/cartStore';

interface SingleUnlockCartItemProps {
  item: TCartItem;
  index: number;
  // eslint-disable-next-line no-unused-vars
  removeItem: (index: number) => void;
}

const SingleCompanyUnlockCartItem: React.FC<SingleUnlockCartItemProps> = ({
  item,
  index,
  removeItem,
}) => {
  const baseAmount = item.basePrice * item.selectedPricing.credits;
  const saving = item.selectedPricing.discount
    ? item.selectedPricing.discount.type === 'flat'
      ? item.selectedPricing.discount.value
      : (baseAmount * item.selectedPricing.discount.value) / 100
    : baseAmount - item.selectedPricing.credits * item.selectedPricing.price;

  const finalPrice = item.selectedPricing.discount
    ? item.selectedPricing.discount.type === 'flat'
      ? item.selectedPricing.credits * item.selectedPricing.price -
        item.selectedPricing.discount.value
      : item.selectedPricing.credits *
        item.selectedPricing.price *
        (1 - item.selectedPricing.discount.value / 100)
    : item.selectedPricing.credits * item.selectedPricing.price;

  return (
    <div className='relative flex flex-row gap-4 sm:gap-6'>
      <div className='flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground md:size-12'>
        <Building className='size-5 md:size-6' />
      </div>
      <div className='flex-grow space-y-4'>
        <div className='flex items-start justify-between'>
          <div>
            <p className='text-xs font-medium text-muted-foreground'>
              Complete Company Report for
            </p>
            <h3 className='text-sm font-semibold md:text-lg'>
              <Link
                href={`/company/${formatToUrl(item.customAttributes?.companyName || '')}/${item.customAttributes?.companyId || ''}?tab=about`}
                className='text-primary hover:underline'
              >
                {item.customAttributes?.companyName}
              </Link>
            </h3>
            <p className='text-xs text-muted-foreground md:text-sm'>
              {item.customAttributes?.companyId}
            </p>

            <ul className='mt-4 space-y-2 text-xs text-gray-700 md:text-sm'>
              <li className='flex items-center gap-2'>
                <Check className='size-4 text-green-600' />
                <span>
                  Access to company&apos;s{' '}
                  <span className='font-semibold'>basic information</span>
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='size-4 text-green-600' />
                <span>
                  <span className='font-semibold'>Complete</span> directors data
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='size-4 text-green-600' />
                <span>
                  <span className='font-semibold '>Charges</span> information
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='size-4 text-green-600' />
                <span>
                  <span className='font-semibold'>Premium</span> financial data
                  access
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='size-4 text-green-600' />
                <span>
                  Statement of{' '}
                  <span className='font-semibold'>Income and Expenditure</span>
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='size-4 text-green-600' />
                <span>
                  Statement of{' '}
                  <span className='font-semibold'>Assets and Liabilities</span>
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='size-4 text-green-600' />
                <span>
                  Download{' '}
                  <span className='font-semibold'>
                    all available public documents
                  </span>
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
        <div className='flex w-full flex-col items-end gap-2'>
          <div className='flex items-center justify-end gap-2'>
            <span className='font-semibold'>Total:</span>
            {saving > 0 && (
              <span className='strikethrough border-gray-700 text-sm font-medium text-muted-foreground'>
                {item.currency === 'INR' ? '₹' : '$'}{' '}
                {formatPriceWithCommas(baseAmount)}
              </span>
            )}
            <p className='text-base font-semibold md:text-lg'>
              {item.currency === 'INR' ? '₹' : '$'}{' '}
              {formatPriceWithCommas(finalPrice)}
            </p>
          </div>
          {saving > 0 && (
            <p className='flex items-center text-xs text-green-700'>
              <Tag className='mr-1 size-3' />
              {item.selectedPricing.discount?.description
                ? `${item.selectedPricing.discount.description}: `
                : 'You save '}
              {item.currency === 'INR' ? '₹' : '$'}
              {formatPriceWithCommas(saving)}
              {item.selectedPricing.discount?.type === 'percentage' && (
                <> ({item.selectedPricing.discount.value}%)</>
              )}
              !
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleCompanyUnlockCartItem;
