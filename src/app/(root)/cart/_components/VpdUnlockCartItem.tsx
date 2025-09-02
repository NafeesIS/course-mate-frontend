/* eslint-disable camelcase */
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatToUrl } from '@/lib/formatters';
import { formatPriceWithCommas } from '@/lib/utils';
import { usePricingStore } from '@/store/pricingStore';
import { sendGTMEvent } from '@next/third-parties/google';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, ArrowUpCircle, FileText, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { getCompanyDetailsData } from '../../company/_services/getCompanyDetailsData';
import { TCartItem } from '../_store/cartStore';

interface VpdUnlockCartItemProps {
  item: TCartItem;
  index: number;
  // eslint-disable-next-line no-unused-vars
  addItem: (item: TCartItem) => void;
  // eslint-disable-next-line no-unused-vars
  removeItem: (index: number) => void;
}
const VpdUnlockCartItem: React.FC<VpdUnlockCartItemProps> = ({
  item,
  index,
  addItem,
  removeItem,
}) => {
  const { serviceCatalogFromDB } = usePricingStore();
  const [showUpgradeAlert, setShowUpgradeAlert] = useState(false);
  const queryClient = useQueryClient();

  const upgradeMutation = useMutation({
    mutationFn: async () => {
      const companyId = item.customAttributes?.companyId || '';

      // Check cache first or fetch fresh data
      const companyData = await queryClient.ensureQueryData({
        queryKey: ['companyDetails', companyId],
        queryFn: () => getCompanyDetailsData(companyId),
      });

      if (companyData.data.companyType === 'Company') {
        setShowUpgradeAlert(true);
        return;
      }

      const companyUnlockService = serviceCatalogFromDB?.serviceCatalog.find(
        (service) => service.serviceType === 'companyUnlock'
      );
      const singleUnlockPrice =
        companyUnlockService?.companyUnlockPricing?.singleUnlock?.price || 0;
      const currency =
        companyUnlockService?.companyUnlockPricing?.currency || 'INR';

      const newItem: TCartItem = {
        serviceId: companyUnlockService?._id || '',
        serviceName: companyUnlockService?.name || '',
        serviceType: companyUnlockService?.serviceType || '',
        description: companyUnlockService?.description || '',
        features: companyUnlockService?.features || [],
        pricing: [
          {
            credits: 1,
            price: singleUnlockPrice,
          },
        ],
        selectedPricing: {
          credits: 1,
          price: singleUnlockPrice,
        },
        customAttributes: {
          companyId: item.customAttributes?.companyId,
          companyName: item.customAttributes?.companyName,
        },
        currency: currency,
        basePrice: singleUnlockPrice,
      };

      await addItem(newItem);

      // send gtm event: add to cart
      sendGTMEvent({
        event: 'add_to_cart',
        ecommerce: {
          currency: currency || 'INR',
          value: singleUnlockPrice,
          items: [
            {
              item_id: companyUnlockService?._id,
              item_name: `${companyUnlockService?.name} (1 credit)`,
              price: singleUnlockPrice, // price per credit
              quantity: 1, // number of credits
            },
          ],
        },
      });
    },
    onError: (error) => {
      console.error('Error during upgrade:', error);
    },
  });

  const saving =
    item.basePrice * item.selectedPricing.credits -
    item.selectedPricing.credits * item.selectedPricing.price;

  return (
    <div
      className={`relative flex gap-4 sm:gap-6 ${upgradeMutation.isPending ? 'pointer-events-none opacity-50' : ''}`}
    >
      <div className='flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-primary-foreground md:size-12'>
        <FileText className='size-5' />
      </div>

      <div className='flex-grow'>
        {/* Header Section */}
        <div className='flex items-start justify-between'>
          <div>
            <p className='text-xs font-medium text-muted-foreground'>
              Get Public Documents of
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
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => removeItem(index)}
            className='size-8 p-0 text-gray-400 hover:text-red-600'
          >
            <Trash2 className='h-5 w-5' />
            <span className='sr-only'>Remove</span>
          </Button>
        </div>

        {/* Documents Summary */}
        <div className='mt-4 flex flex-wrap gap-2'>
          <span className='rounded-full bg-gray-100 px-3 py-1 text-[10px] text-gray-700 md:text-xs'>
            Incorporation Docs
          </span>
          <span className='rounded-full bg-gray-100 px-3 py-1 text-[10px] text-gray-700 md:text-xs'>
            Annual Returns
          </span>
          <span className='rounded-full bg-gray-100 px-3 py-1 text-[10px] text-gray-700 md:text-xs'>
            Charge Documents
          </span>
          <span className='rounded-full bg-gray-100 px-3 py-1 text-[10px] text-gray-700 md:text-xs'>
            Director Changes
          </span>
          <span className='rounded-full bg-gray-100 px-3 py-1 text-[10px] text-gray-700 md:text-xs'>
            Other Filings
          </span>
        </div>

        <div className='mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-2'>
          {/* Upgrade Banner */}
          <div className='flex w-fit flex-col gap-2 rounded-md border border-green-100 bg-green-50 p-3 md:flex-row md:items-center md:gap-6'>
            <div className='flex-grow'>
              <p className='text-xs font-medium text-green-800 md:text-sm'>
                Want financial insights?
              </p>
              <p className='text-[10px] text-green-600 md:text-xs'>
                Upgrade to Complete Company Report
              </p>
            </div>

            <Button
              onClick={() => upgradeMutation.mutate()}
              variant='default'
              size='sm'
              className='h-7 bg-green-600 text-xs hover:bg-green-700 md:h-9 md:text-sm'
              disabled={upgradeMutation.isPending}
            >
              {upgradeMutation.isPending ? (
                <>
                  <span className='mr-2 size-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                  Upgrading...
                </>
              ) : (
                <>
                  <ArrowUpCircle className='mr-2 size-4' />
                  Upgrade
                </>
              )}
            </Button>
          </div>

          {/* Price Section */}
          <div className='flex items-center justify-end gap-2'>
            <span className='font-semibold'>Total:</span>
            {saving > 0 && (
              <span className='strikethrough text-sm text-muted-foreground'>
                {item.currency === 'INR' ? '₹' : '$'}
                {formatPriceWithCommas(
                  item.basePrice * item.selectedPricing.credits
                )}
              </span>
            )}
            <p className='text-lg font-semibold'>
              {item.currency === 'INR' ? '₹' : '$'}
              {formatPriceWithCommas(
                item.selectedPricing.credits * item.selectedPricing.price
              )}
            </p>
            {saving > 0 && (
              <span className='text-xs text-green-700'>
                (Save {item.currency === 'INR' ? '₹' : '$'}
                {formatPriceWithCommas(saving)})
              </span>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showUpgradeAlert} onOpenChange={setShowUpgradeAlert}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <div className='flex items-center gap-2'>
              <AlertCircle className='h-6 w-6 text-yellow-600' />
              <DialogTitle>Coming Soon!</DialogTitle>
            </div>
          </DialogHeader>
          <DialogDescription className='mt-2'>
            This feature is currently{' '}
            <strong>exclusive to Limited Liability Partnerships (LLPs)</strong>.
            At this time, complete company report access is{' '}
            <strong>not available</strong> for other company types.
            <br />
            <br />
            If you wish to explore detailed financial reports, consider{' '}
            <strong>searching for LLPs</strong> in your area of interest. We are{' '}
            <strong>continually working</strong> to expand our offerings and may
            introduce this feature for other company types in the future.
          </DialogDescription>
          <DialogFooter>
            <Button
              type='button'
              variant='secondary'
              onClick={() => setShowUpgradeAlert(false)}
              className='mt-4'
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VpdUnlockCartItem;
