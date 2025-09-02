/* eslint-disable camelcase */
'use client';

import { useCartStore } from '@/app/(root)/cart/_store/cartStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { usePricingStore } from '@/store/pricingStore';
import { sendGTMEvent } from '@next/third-parties/google';
import { motion } from 'framer-motion';
import { Check, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const BEST_VALUE_CREDIT = 10;

export default function BuyMoreCredits({
  btnText = 'Unlock Bulk',
  className,
}: {
  btnText?: string;
  className?: string;
}) {
  const router = useRouter();

  const [selectedPlan, setSelectedPlan] = useState<'cash' | 'credit' | 'bulk'>(
    'bulk'
  );
  const [isOpen, setIsOpen] = useState(false); // cta modal open close state

  const { serviceCatalogFromDB } = usePricingStore(); // get pricing data from pricing store

  const addItem = useCartStore((state) => state.addItem); // add item to cart store

  const companyUnlockService = serviceCatalogFromDB?.serviceCatalog?.find(
    (service) => service.serviceType === 'companyUnlock'
  );

  const singleUnlockPrice =
    companyUnlockService?.companyUnlockPricing?.singleUnlock?.price || 0;

  const bulkUnlockPackage =
    companyUnlockService?.companyUnlockPricing?.bulkUnlock?.find(
      (pkg) => pkg.credits === BEST_VALUE_CREDIT
    );
  const bulkUnlockTotalPrice = bulkUnlockPackage
    ? bulkUnlockPackage?.price * bulkUnlockPackage?.credits
    : 0;
  const saveOnBulkPackage =
    singleUnlockPrice * BEST_VALUE_CREDIT - bulkUnlockTotalPrice;

  const currency =
    companyUnlockService?.companyUnlockPricing?.currency || 'INR';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleUnlock = async () => {
    if (selectedPlan === 'bulk') {
      addItem({
        serviceId: companyUnlockService?._id || '',
        serviceName: companyUnlockService?.name || '',
        serviceType: companyUnlockService?.serviceType || '',
        description: companyUnlockService?.description || '',
        features: companyUnlockService?.features || [],
        pricing: companyUnlockService?.companyUnlockPricing?.bulkUnlock || [],
        selectedPricing: {
          credits: bulkUnlockPackage?.credits || BEST_VALUE_CREDIT,
          price: bulkUnlockPackage?.price || 0,
        },
        currency: currency || '',
        basePrice: bulkUnlockPackage?.price || 0,
      });

      // send gtm events: checkout
      sendGTMEvent({
        event: 'add_to_cart',
        ecommerce: {
          currency: currency || 'INR',
          value: bulkUnlockTotalPrice,
          items: [
            {
              item_name: `${companyUnlockService?.name} (${bulkUnlockPackage?.credits} credit)`,
              price: bulkUnlockTotalPrice, // price per credit
              quantity: 1, // number of credits
              currency: currency || 'INR',
              service_id: companyUnlockService?._id,
            },
          ],
        },
      });

      router.push(
        `/cart?type=bulk-company-unlock&credit=${bulkUnlockPackage?.credits || BEST_VALUE_CREDIT}`
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className={cn(
            'flex items-center gap-1.5 rounded bg-sky-200 px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-sky-300 md:text-sm',
            className
          )}
        >
          {btnText}
        </button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[450px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-lg font-bold text-primary md:text-xl'>
            Buy Credits
          </DialogTitle>
        </DialogHeader>

        <div className='mt-2 space-y-6'>
          <RadioGroup
            value={selectedPlan}
            onValueChange={(value) =>
              setSelectedPlan(value as 'cash' | 'credit' | 'bulk')
            }
            className={cn('space-y-4')}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={cn(
                'relative rounded-lg border-2 p-5 transition-colors',
                selectedPlan === 'bulk'
                  ? 'border-primary bg-primary/5'
                  : 'border-muted'
              )}
            >
              <div className='absolute -right-2 -top-2'>
                <span className='inline-flex items-center rounded-full bg-emerald-500 px-2 py-1 text-xs font-medium text-white'>
                  Best Value
                </span>
              </div>
              <RadioGroupItem value='bulk' id='bulk' className='sr-only' />
              <Label htmlFor='bulk' className='flex flex-col'>
                <div className='flex items-center justify-between'>
                  <span className='text-base font-semibold md:text-lg'>
                    Bulk Package
                  </span>
                  <Package className='size-5 text-primary' />
                </div>
                <div className='mt-2 space-y-1'>
                  <div className='text-lg font-bold text-primary'>
                    {formatCurrency(bulkUnlockTotalPrice || 0)}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    {bulkUnlockPackage?.credits} Company Data with 1 Year
                    Validity
                  </div>
                </div>
                <ul className='mt-2 space-y-1 text-xs'>
                  <li className='flex items-center'>
                    <Check className='mr-2 h-4 w-4 text-emerald-500' />
                    <span>
                      Save {formatCurrency(saveOnBulkPackage)} compared to
                      single company unlock
                    </span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='mr-2 h-4 w-4 text-emerald-500' />
                    <span>Flexible usage within 1 year</span>
                  </li>
                </ul>
              </Label>
            </motion.div>
          </RadioGroup>

          <Button className='w-full' size='lg' onClick={handleUnlock}>
            Purchase Bulk Package for {formatCurrency(bulkUnlockTotalPrice)}
          </Button>

          <ul className='mt-2 space-y-1 text-[10px]'>
            <li className='flex gap-1.5'>
              *{' '}
              <span>
                Once you unlock a company, you can view the company data for a
                year from the date of unlock.
              </span>
            </li>
            <li className='flex gap-1.5'>
              * <span>All prices are exclusive of GST.</span>
            </li>
          </ul>

          {/* <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className='rounded-lg bg-muted p-4'
            >
              <div className='flex items-start gap-3'>
                <AlertCircle className='size-5 text-primary' />
                <div className='space-y-2'>
                  <p className='text-xs font-semibold md:text-sm'>
                    Unlock more value with Credit Packages
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Enjoy up to 50% discount and easier unlocking with our
                    credit packages
                  </p>
                  <Button
                    variant='link'
                    className='h-auto p-0 text-xs text-primary'
                    onClick={() => setIsOpen(false)}
                  >
                    View Credit Packages{' '}
                    <ChevronRight className='ml-1 size-3' />
                  </Button>
                </div>
              </div>
            </motion.div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
