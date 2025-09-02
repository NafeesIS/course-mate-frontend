import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatPriceWithCommas } from '@/lib/utils';
import { usePricingStore } from '@/store/pricingStore';
import { Check, CreditCard, Info, Tag, Trash2 } from 'lucide-react';
import React from 'react';
import { TCartItem } from '../_store/cartStore';

interface IBulkCompanyUnlockCreditCartItem {
  item: TCartItem;
  index: number;
  // eslint-disable-next-line no-unused-vars
  removeItem: (index: number) => void;
  // eslint-disable-next-line no-unused-vars
  updateItem: (index: number, updatedItem: TCartItem) => void;
}

const BulkCompanyUnlockCreditCartItem: React.FC<
  IBulkCompanyUnlockCreditCartItem
> = ({ item, index, removeItem, updateItem }) => {
  const { serviceCatalogFromDB } = usePricingStore();

  const handlePricingChange = (value: string) => {
    const newPricing = item.pricing.find((p) => p.credits === parseInt(value));
    if (newPricing) {
      const updatedItem = { ...item, selectedPricing: newPricing };
      updateItem(index, updatedItem);
    }
  };

  const singleUnlockPrice = serviceCatalogFromDB?.serviceCatalog.find(
    (s) => s.serviceType === 'companyUnlock'
  )?.companyUnlockPricing?.singleUnlock.price;

  const saving =
    Number(singleUnlockPrice) * item.selectedPricing.credits -
    item.selectedPricing.credits * item.selectedPricing.price;

  return (
    <div className='relative flex flex-col gap-4 sm:flex-row sm:gap-6'>
      <div className='flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground md:size-12'>
        <CreditCard className='size-5 md:size-6' />
      </div>
      <div className='flex-grow space-y-4'>
        <div className='flex items-start justify-between'>
          <div>
            <h3 className='text-lg font-semibold'>
              Unlock Company Credits{' '}
              {/* <span className='text-sm text-muted-foreground'>
                x {item.selectedPricing.credits}
              </span> */}
            </h3>
            <div className='mt-2 flex items-start gap-2 rounded-lg border border-muted bg-amber-50 p-2'>
              <Info className='mt-0.5 size-4 shrink-0 animate-pulse text-amber-600' />
              <p className='text-xs text-amber-800'>
                For now, these credits can only be used to unlock{' '}
                <strong>Limited Liability Partnerships (LLPs)</strong>. We are
                working on introducing this feature for other company types
                soon.
              </p>
            </div>

            <ul className='mt-4 space-y-2 text-xs text-gray-700 md:text-sm'>
              <li className='flex items-center gap-2'>
                <Check className='size-4 text-green-600' />
                <span>
                  <span className='font-semibold'>Cost-effective</span> solution
                  for multiple company unlocks
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='size-4 text-green-600' />
                <span>
                  1 credit = 1{' '}
                  <span className='font-semibold'>
                    complete company data set
                  </span>
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='size-4 text-green-600' />
                <span>
                  <span className='font-semibold'>Flexible</span> usage - unlock
                  companies as needed
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='size-4 text-green-600' />
                <span>
                  Access to <span className='font-semibold'>premium data</span>{' '}
                  for each unlocked company
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='size-4 text-green-600' />
                <span>
                  Download{' '}
                  <span className='font-semibold'>public documents</span> for
                  all unlocked companies
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='size-4 text-green-600' />
                <span>
                  Save more with{' '}
                  <span className='font-semibold'>larger credit packages</span>
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
              <SelectValue placeholder='Select credit package' />
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
              {singleUnlockPrice && saving > 0 && (
                <span className='strikethrough border-gray-700 text-sm font-medium text-muted-foreground'>
                  {item.currency === 'INR' ? '₹' : '$'}{' '}
                  {formatPriceWithCommas(
                    singleUnlockPrice * item.selectedPricing.credits
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
            {singleUnlockPrice && saving > 0 && (
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

export default BulkCompanyUnlockCreditCartItem;
