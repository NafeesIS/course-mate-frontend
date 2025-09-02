/* eslint-disable camelcase */
'use client';

import { useCartStore } from '@/app/(root)/cart/_store/cartStore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/formatters';
import { trackThriveStackFeatureUsage } from '@/lib/thriveStack';
import { cn } from '@/lib/utils';
import { usePricingStore } from '@/store/pricingStore';
import { useUserSignInDetails } from '@/store/userStore';
import { sendGTMEvent } from '@next/third-parties/google';
import {
  AlertCircle,
  Check,
  Download,
  Package,
  PiggyBank,
  RefreshCcw,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreditPackagesCTA({
  dialogTrigger,
  btnText = 'View Credit Packages',
  source,
  className,
  iconClassName,
}: {
  dialogTrigger?: React.ReactNode;
  btnText?: string;
  source?: string;
  className?: string;
  iconClassName?: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  const { userSignInDetails } = useUserSignInDetails();

  const {
    serviceCatalogFromDB,
    serviceCatalogFromDBPending,
    serviceCatalogFromDBError,
  } = usePricingStore();
  const addItem = useCartStore((state) => state.addItem);

  const companyUnlockService = serviceCatalogFromDB?.serviceCatalog?.find(
    (service) => service.serviceType === 'companyUnlock'
  );

  const currency =
    companyUnlockService?.companyUnlockPricing?.currency || 'INR';
  const singleUnlockPrice =
    companyUnlockService?.companyUnlockPricing?.singleUnlock?.price || 0;

  const calculateSavings = (credits: number, price: number) => {
    const singleUnlockTotal = singleUnlockPrice * credits;
    const packageTotal = price * credits;
    const savings = singleUnlockTotal - packageTotal;
    const savingsPercentage = (savings / singleUnlockTotal) * 100;
    return { savings, savingsPercentage };
  };

  const handlePurchase = () => {
    const bulkUnlock = companyUnlockService?.companyUnlockPricing?.bulkUnlock;
    if (
      selectedPackage !== null &&
      companyUnlockService &&
      bulkUnlock &&
      bulkUnlock[selectedPackage]
    ) {
      const selectedPricing = bulkUnlock[selectedPackage];
      addItem({
        serviceId: companyUnlockService._id,
        serviceName: companyUnlockService.name,
        serviceType: companyUnlockService.serviceType,
        description: companyUnlockService.description,
        features: companyUnlockService.features || [],
        pricing: bulkUnlock,
        selectedPricing: {
          credits: selectedPricing.credits,
          price: selectedPricing.price,
        },
        currency: currency,
        basePrice: selectedPricing.price,
      });

      // send gtm events: add to cart
      sendGTMEvent({
        event: 'add_to_cart',
        ecommerce: {
          currency: currency,
          value: selectedPricing.price * selectedPricing.credits,
          items: [
            {
              item_id: companyUnlockService._id,
              item_name: `${companyUnlockService.name} (${selectedPricing.credits} credits)`,
              price: selectedPricing.price * selectedPricing.credits,
              quantity: 1,
            },
          ],
        },
      });

      router.push(
        `/cart?type=bulk-company-unlock&credit=${selectedPricing.credits}`
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        onClick={() => {
          if (companyUnlockService?.companyUnlockPricing?.bulkUnlock) {
            // send GTM event: view item
            sendGTMEvent({
              event: 'view_item',
              ecommerce: {
                currency: currency || 'INR',
                value:
                  companyUnlockService.companyUnlockPricing.bulkUnlock.reduce(
                    (acc, pkg) => acc + pkg.price * pkg.credits,
                    0
                  ),
                items: companyUnlockService.companyUnlockPricing.bulkUnlock.map(
                  (pkg) => ({
                    item_id: companyUnlockService._id,
                    item_name: `${companyUnlockService.name} (${pkg.credits} credits)`,
                    price: pkg.price * pkg.credits,
                    quantity: 1,
                  })
                ),
              },
            });
          }

          // THRIVESTACK: FEATURE USAGE TRACKING CODE
          trackThriveStackFeatureUsage({
            featureName: `View Credit Packages - ${source}`,
            userId: userSignInDetails?.data._id || '',
          });
        }}
        asChild
      >
        {dialogTrigger || (
          <Button
            variant='outline'
            size='sm'
            className={cn(
              'flex items-center gap-1.5 text-xs font-semibold',
              className
            )}
          >
            <Package className={cn('h-3 w-3', iconClassName)} />
            {btnText}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className='overflow-y-auto sm:max-w-sm'>
        <DialogHeader className='space-y-4'>
          <DialogTitle className='flex items-center gap-2 text-lg font-bold text-primary'>
            <Package className='h-6 w-6' /> Credit Packages
          </DialogTitle>
          <div className='rounded-lg border border-muted bg-sky-50 p-4'>
            <h3 className='mb-2 text-sm font-semibold text-primary'>
              Unlock More, Save More
            </h3>
            <ul className='space-y-2 text-xs'>
              <li className='flex items-center gap-2'>
                <Zap className='h-4 w-4 text-primary' />
                <span>1 credit = 1 complete company data set</span>
              </li>
              <li className='flex items-center gap-2'>
                <Download className='h-4 w-4 text-primary' />
                <span>Access premium data & public documents</span>
              </li>
              <li className='flex items-center gap-2'>
                <PiggyBank className='h-4 w-4 text-primary' />
                <span>Flexible usage, greater savings on bulk</span>
              </li>
            </ul>
          </div>
          <div className='rounded-lg border border-muted bg-amber-50 p-3'>
            <p className='text-xs text-amber-800'>
              This feature is currently exclusive to Limited Liability
              Partnerships (LLPs)
            </p>
          </div>
        </DialogHeader>

        {serviceCatalogFromDBPending ? (
          <div className='space-y-2'>
            <Skeleton className='h-16 w-full' />
            <Skeleton className='h-16 w-full' />
            <Skeleton className='h-16 w-full' />
          </div>
        ) : serviceCatalogFromDBError ? (
          <Alert variant='destructive' className='mt-2'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <p className='text-sm'>Failed to fetch data. Please try again.</p>
              <Button
                variant='outline'
                size='sm'
                className='mt-2'
                onClick={() => window.location.reload()}
              >
                <RefreshCcw className='mr-2 h-3 w-3' />
                Reload
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <div className='mt-2 space-y-3'>
            <RadioGroup
              value={selectedPackage?.toString()}
              onValueChange={(value) => setSelectedPackage(Number(value))}
              className='space-y-1'
            >
              {companyUnlockService?.companyUnlockPricing?.bulkUnlock?.map(
                (pkg, index) => {
                  const { savingsPercentage } = calculateSavings(
                    pkg.credits,
                    pkg.price
                  );

                  return (
                    <Label
                      key={index}
                      htmlFor={`package-${index}`}
                      className={cn(
                        'flex cursor-pointer items-center justify-between rounded-lg border p-3 text-sm transition-all',
                        selectedPackage === index
                          ? 'border-primary bg-sky-50'
                          : 'hover:border-primary'
                      )}
                    >
                      <RadioGroupItem
                        value={index.toString()}
                        id={`package-${index}`}
                        className='sr-only'
                      />
                      <div className='flex flex-col'>
                        <span className='font-semibold text-foreground'>
                          {pkg.credits} Credits
                        </span>
                        <span className='text-xs text-muted-foreground'>
                          {formatCurrency(pkg.price, currency)}/credit
                        </span>
                      </div>
                      <div className='text-right'>
                        <span className='font-bold text-primary'>
                          {formatCurrency(pkg.price * pkg.credits, currency)}
                        </span>
                        <div className='flex items-center text-xs text-muted-foreground'>
                          <Check className='mr-1 h-3 w-3 text-green-500' />
                          Save {savingsPercentage.toFixed(0)}%
                        </div>
                      </div>
                    </Label>
                  );
                }
              )}
            </RadioGroup>

            <Button
              className='mt-4 w-full'
              onClick={handlePurchase}
              disabled={selectedPackage === null}
            >
              <Zap className='mr-2 h-4 w-4' />
              {selectedPackage === null
                ? 'Select a Package'
                : `Buy ${companyUnlockService?.companyUnlockPricing?.bulkUnlock?.[selectedPackage]?.credits} Credits`}
            </Button>

            <p className='text-center text-[10px] text-muted-foreground'>
              Credits valid for 1 year. Prices include GST.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
