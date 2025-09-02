/* eslint-disable camelcase */
'use client';

import { TCartItem, useCartStore } from '@/app/(root)/cart/_store/cartStore';
import { getCompanyDetailsData } from '@/app/(root)/company/_services/getCompanyDetailsData';
import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { trackThriveStackFeatureUsage } from '@/lib/thriveStack';
import { formatPriceWithCommas } from '@/lib/utils';
import { usePricingStore } from '@/store/pricingStore';
import { useUserSignInDetails } from '@/store/userStore';
import { sendGTMEvent } from '@next/third-parties/google';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, ArrowUpCircle, Check, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RiBuilding2Fill } from 'react-icons/ri';

interface UpgradeToReportProps {
  companyId: string;
  companyName: string;
  customButton?: React.ReactNode;
  source?: string;
}

const UpgradeToReport = ({
  companyId,
  companyName,
  customButton,
  source,
}: UpgradeToReportProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { serviceCatalogFromDB } = usePricingStore();
  const { addItem } = useCartStore();
  const { userSignInDetails } = useUserSignInDetails();

  const companyUnlockService = serviceCatalogFromDB?.serviceCatalog.find(
    (service) => service.serviceType === 'companyUnlock'
  );
  const singleUnlockPrice =
    companyUnlockService?.companyUnlockPricing?.singleUnlock.price;
  const vpdUnlockPrice = null;
  // const vpdUnlockPrice = serviceCatalogFromDB?.serviceCatalog.find(
  //   (service) => service.serviceType === 'vpdUnlock'
  // )?.vpdUnlockPricing?.singleUnlock.price;

  const basePrice = singleUnlockPrice || 0;
  // const discountAmount = vpdUnlockPrice || 0;
  const discountAmount = 0;
  const finalPrice = basePrice - discountAmount;

  const { data: companyData, isLoading } = useQuery({
    queryKey: ['companyDetails', companyId],
    queryFn: () => getCompanyDetailsData(companyId),
    enabled: isOpen,
    gcTime: 1000 * 60 * 30,
    staleTime: 1000 * 60 * 30,
  });

  const handleUpgradeBtn = () => {
    setIsOpen(true);

    // send GTM event: view item
    sendGTMEvent({
      event: 'view_item',
      ecommerce: {
        currency: serviceCatalogFromDB?.currency || 'INR',
        value: finalPrice,
        items: [
          {
            item_id: companyUnlockService?._id,
            item_name: `${companyUnlockService?.name} (Upgrade to Report)`,
            price: finalPrice,
            quantity: 1, // number of credits
          },
        ],
      },
    });

    // THRIVESTACK: FEATURE USAGE TRACKING CODE
    trackThriveStackFeatureUsage({
      featureName: `Upgrade to Report CTA - ${source}`,
      userId: userSignInDetails?.data._id || '',
    });
  };

  const handleCheckout = () => {
    if (companyUnlockService && singleUnlockPrice) {
      const cartItem: TCartItem = {
        serviceId: companyUnlockService._id,
        serviceName: companyUnlockService.name,
        serviceType: companyUnlockService.serviceType,
        description: companyUnlockService.description,
        features: companyUnlockService.features || [],
        pricing: [
          {
            credits:
              companyUnlockService.companyUnlockPricing?.singleUnlock.credits ||
              1,
            price:
              companyUnlockService.companyUnlockPricing?.singleUnlock.price ||
              0,
          },
        ],
        selectedPricing: {
          credits:
            companyUnlockService.companyUnlockPricing?.singleUnlock.credits ||
            1,
          price:
            companyUnlockService.companyUnlockPricing?.singleUnlock.price || 0,
          discount: discountAmount
            ? {
                type: 'flat',
                value: discountAmount,
                description:
                  'Special discount for upgrading from VPD to full company report',
              }
            : undefined,
        },
        customAttributes: {
          companyId,
          companyName,
        },
        currency: serviceCatalogFromDB?.currency || 'INR',
        basePrice:
          companyUnlockService.companyUnlockPricing?.singleUnlock.price || 0,
      };

      addItem(cartItem);

      // send gtm event: add to cart
      sendGTMEvent({
        event: 'add_to_cart',
        ecommerce: {
          currency: serviceCatalogFromDB?.currency || 'INR',
          value: finalPrice,
          items: [
            {
              item_id: companyUnlockService?._id,
              item_name: `${companyUnlockService?.name} (Upgrade to Report)`,
              price: finalPrice,
              quantity: 1, // number of credits
            },
          ],
        },
      });

      router.push(`/cart`);
    }
  };

  return (
    <>
      {customButton ? (
        <div onClick={handleUpgradeBtn}>{customButton}</div>
      ) : (
        <Button
          title='Upgrade to Report'
          variant='ghost'
          size='icon'
          onClick={handleUpgradeBtn}
          className='ml-1.5 size-7 cursor-pointer text-green-600 hover:text-green-700'
        >
          <ArrowUpCircle className='h-5 w-5 animate-pulse' />
          <span className='sr-only'>Upgrade to Report</span>
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='sm:max-w-[525px]'>
          {isLoading ? (
            <LoadingWithSpinner className='h-80' />
          ) : companyData && companyData.data.companyType === 'Company' ? (
            <>
              <DialogHeader>
                <div className='flex items-center gap-2'>
                  <AlertCircle className='h-6 w-6 text-yellow-600' />
                  <DialogTitle>Coming Soon!</DialogTitle>
                </div>
              </DialogHeader>
              <DialogDescription className='mt-2'>
                This feature is currently{' '}
                <strong>
                  exclusive to Limited Liability Partnerships (LLPs)
                </strong>
                . At this time, complete company report access is{' '}
                <strong>not available</strong> for other company types.
                <br />
                <br />
                If you wish to explore detailed financial reports, consider{' '}
                <strong>searching for LLPs</strong> in your area of interest. We
                are <strong>continually working</strong> to expand our offerings
                and may introduce this feature for other company types in the
                future.
              </DialogDescription>
              <DialogFooter>
                <Button
                  type='button'
                  variant='secondary'
                  onClick={() => setIsOpen(false)}
                  className='mt-4'
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Upgrade to Full Report</DialogTitle>
                <DialogDescription>
                  Get complete access to detailed company reports and financial
                  data
                </DialogDescription>
              </DialogHeader>

              <div>
                <h3 className='mb-4 flex items-center gap-2 font-medium text-primary'>
                  <span className='flex-shrink-0 rounded-full bg-muted p-1.5'>
                    <RiBuilding2Fill />
                  </span>{' '}
                  <span>{companyName}</span>
                </h3>

                <div className='mb-6 space-y-4'>
                  <div className='space-y-3'>
                    <h4 className='text-sm font-semibold text-muted-foreground'>
                      What you&apos;ll get:
                    </h4>
                    <ul className='grid gap-2 text-sm'>
                      <li className='flex items-center gap-2'>
                        <Check className='h-4 w-4 flex-shrink-0 text-green-500' />
                        Access to company&apos;s basic information
                      </li>
                      <li className='flex items-center gap-2'>
                        <Check className='h-4 w-4 flex-shrink-0 text-green-500' />
                        Complete directors data
                      </li>
                      <li className='flex items-center gap-2'>
                        <Check className='h-4 w-4 flex-shrink-0 text-green-500' />
                        Charges information
                      </li>
                      <li className='flex items-center gap-2'>
                        <Check className='h-4 w-4 flex-shrink-0 text-green-500' />
                        Premium financial data access
                      </li>
                      <li className='flex items-center gap-2'>
                        <Check className='h-4 w-4 flex-shrink-0 text-green-500' />
                        Statement of Income and Expenditure
                      </li>
                      <li className='flex items-center gap-2'>
                        <Check className='h-4 w-4 flex-shrink-0 text-green-500' />
                        Statement of Assets and Liabilities
                      </li>
                      <li className='flex items-center gap-2'>
                        <Check className='h-4 w-4 flex-shrink-0 text-green-500' />
                        Download all available public documents
                      </li>
                    </ul>
                  </div>

                  {singleUnlockPrice ? (
                    <div className='space-y-4 rounded-lg border p-4'>
                      <div className='flex flex-col items-end gap-2'>
                        <div className='flex items-center justify-end gap-2'>
                          <span className='font-semibold'>Total:</span>
                          {/* <span className='strikethrough border-gray-700 text-sm font-medium text-muted-foreground'>
                            {serviceCatalogFromDB?.currency === 'INR'
                              ? '₹'
                              : '$'}{' '}
                            {formatPriceWithCommas(basePrice)}
                          </span> */}
                          <p className='text-base font-semibold md:text-lg'>
                            {serviceCatalogFromDB?.currency === 'INR'
                              ? '₹'
                              : '$'}
                            {formatPriceWithCommas(finalPrice)}
                          </p>
                        </div>
                        {vpdUnlockPrice && (
                          <p className='flex items-center text-xs text-green-700'>
                            <Tag className='mr-1 size-3' />
                            VPD to Full Report upgrade discount of{' '}
                            {serviceCatalogFromDB?.currency === 'INR'
                              ? '₹'
                              : '$'}
                            {formatPriceWithCommas(discountAmount)} applied!
                          </p>
                        )}
                      </div>
                      <Button className='w-full' onClick={handleCheckout}>
                        Upgrade Now
                      </Button>
                    </div>
                  ) : (
                    <p className='text-sm text-muted-foreground'>
                      Pricing information unavailable
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpgradeToReport;
