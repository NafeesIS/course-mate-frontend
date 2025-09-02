'use client';

/* eslint-disable camelcase */
import { useCartStore } from '@/app/(root)/cart/_store/cartStore';
import type { TCompanyMasterData } from '@/app/(root)/company/_types/CompanyDetails';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { formatToUrl } from '@/lib/formatters';
import { trackThriveStackFeatureUsage } from '@/lib/thriveStack';
import { cn } from '@/lib/utils';
import { usePricingStore } from '@/store/pricingStore';
import { useUserSignInDetails } from '@/store/userStore';
import { sendGTMEvent } from '@next/third-parties/google';
import { CheckCircle2, CreditCard, FileText, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { FaCartPlus } from 'react-icons/fa6';
import { RiLockPasswordLine } from 'react-icons/ri';

const UnlockPublicDocsBtn = ({
  companyData,
  dialogTrigger,
  btnText = 'Unlock Company',
  className,
  iconClassName,
  source,
}: {
  companyData: TCompanyMasterData;
  dialogTrigger?: React.ReactNode;
  btnText?: string;
  className?: string;
  iconClassName?: string;
  source?: string;
}) => {
  const router = useRouter();
  const { userSignInDetails } = useUserSignInDetails();

  // Dialog state
  const [isOpen, setIsOpen] = useState(false);
  // Track if we're showing the consent view for strike off companies
  const [showingConsent, setShowingConsent] = useState(false);

  // get pricing data from pricing store
  const { serviceCatalogFromDB } = usePricingStore();
  // add item to cart store (for single and bulk unlock)
  const addItem = useCartStore((state) => state.addItem);
  // get cart items to check if current company is already in cart
  const cartItems = useCartStore((state) => state.items);

  // public doc unlock service catalog
  const vpdUnlockService = serviceCatalogFromDB?.serviceCatalog?.find(
    (service) => service.serviceType === 'vpdUnlock'
  );
  // get single unlock price
  const singleUnlockPrice =
    vpdUnlockService?.vpdUnlockPricing?.singleUnlock.price || 0;

  const currency = vpdUnlockService?.vpdUnlockPricing?.currency || 'INR';

  // Check if current company is already in cart
  const isInCart = cartItems.some(
    (item) =>
      item.customAttributes?.companyId === companyData.data.cin &&
      item.serviceType === 'vpdUnlock'
  );

  // utility functions: format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Check if company is struck off
  const isCompanyStruckOff = companyData.data.status === 'Strike Off';

  // handler functions: unlock
  const handleUnlock = async () => {
    // If company is struck off, show consent view
    if (isCompanyStruckOff && !showingConsent) {
      setShowingConsent(true);
      return;
    }

    // Otherwise proceed directly
    proceedToPayment();
  };

  // Function to proceed to payment after consent or direct unlock
  const proceedToPayment = () => {
    // Close dialog
    setIsOpen(false);
    setShowingConsent(false);

    // unlock using cash: add to cart
    addItem({
      serviceId: vpdUnlockService?._id || '',
      serviceName: vpdUnlockService?.name || '',
      serviceType: vpdUnlockService?.serviceType || '',
      description: vpdUnlockService?.description || '',
      features: vpdUnlockService?.features || [],
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
        companyId: companyData.data.cin,
        companyName: companyData.data.company,
      },
      currency: currency || '',
      basePrice: singleUnlockPrice,
    });

    // send gtm event: add to cart
    sendGTMEvent({
      event: 'add_to_cart',
      ecommerce: {
        currency: currency || 'INR',
        value: singleUnlockPrice,
        items: [
          {
            item_id: vpdUnlockService?._id,
            item_name: `${vpdUnlockService?.name}`,
            price: singleUnlockPrice, // price per credit
            quantity: 1, // number of credits
          },
        ],
      },
    });

    router.push(
      `/cart?type=vpd-unlock&cin=${companyData.data.cin}&company=${formatToUrl(companyData.data.company)}`
    );
  };

  // Function to handle adding to cart without redirecting
  const handleAddToCart = () => {
    addItem({
      serviceId: vpdUnlockService?._id || '',
      serviceName: vpdUnlockService?.name || '',
      serviceType: vpdUnlockService?.serviceType || '',
      description: vpdUnlockService?.description || '',
      features: vpdUnlockService?.features || [],
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
        companyId: companyData.data.cin,
        companyName: companyData.data.company,
      },
      currency: currency || '',
      basePrice: singleUnlockPrice,
    });

    // send gtm event: add to cart
    sendGTMEvent({
      event: 'add_to_cart',
      ecommerce: {
        currency: currency || 'INR',
        value: singleUnlockPrice,
        items: [
          {
            item_id: vpdUnlockService?._id,
            item_name: `${vpdUnlockService?.name}`,
            price: singleUnlockPrice, // price per credit
            quantity: 1, // number of credits
          },
        ],
      },
    });
  };

  // Handle dialog close
  const handleDialogOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset to default view when dialog is closed
      setShowingConsent(false);
    }
  };

  // Handle back button in consent view
  const handleBackFromConsent = () => {
    setShowingConsent(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger
        onClick={() => {
          // send gtm event: view item
          sendGTMEvent({
            event: 'view_item',
            ecommerce: {
              currency: 'INR',
              value: singleUnlockPrice,
              items: [
                {
                  item_id: vpdUnlockService?._id,
                  item_name: `${vpdUnlockService?.name}`,
                  price: singleUnlockPrice, // price per credit
                  quantity: 1, // number of credits
                },
              ],
            },
          });

          // THRIVESTACK: FEATURE USAGE TRACKING CODE
          trackThriveStackFeatureUsage({
            featureName: `VPD Unlock CTA - ${source}`,
            userId: userSignInDetails?.data._id || '',
          });
        }}
        asChild
      >
        {/* dialog trigger is a jsx element: if it exists, use it, else use the default button */}
        {dialogTrigger || (
          <Button
            variant='gooeyLeft'
            size='sm'
            className={cn(
              'flex items-center gap-1.5 rounded bg-sky-200 text-xs font-semibold text-foreground hover:bg-sky-300 md:text-sm',
              className
            )}
          >
            <RiLockPasswordLine
              className={cn('size-3 text-xs md:size-4', iconClassName)}
            />{' '}
            {btnText}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className='max-h-screen overflow-y-auto sm:max-w-[560px]'>
        {showingConsent ? (
          // CONSENT VIEW FOR STRIKE OFF COMPANIES
          <>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2 text-base font-semibold text-red-600 md:text-lg'>
                Important Notice: Strike Off Company
              </DialogTitle>
              <DialogDescription className='text-left text-xs text-muted-foreground md:text-sm'>
                Please read this important information before proceeding
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4 py-4'>
              <p className='text-xs md:text-sm'>
                You are attempting to unlock{' '}
                <strong>{companyData.data.company}</strong>, which has a{' '}
                <strong>Strike Off</strong> status.
              </p>

              <Alert variant='destructive' className='bg-red-50'>
                <AlertDescription className='text-xs md:text-sm'>
                  Companies with Strike Off status may not have filed required
                  documents with the MCA. This means:
                  <ul className='mt-2 list-disc space-y-1 pl-5'>
                    <li>Limited or no documents may be available</li>
                    <li>The data you receive might be incomplete</li>
                    <li>
                      No refunds will be provided due to lack of documents
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>

              <p className='text-xs font-medium md:text-sm'>
                Do you still want to proceed with unlocking this company?
              </p>
            </div>

            <DialogFooter className='flex flex-col gap-2 sm:flex-row'>
              <Button
                variant='outline'
                onClick={handleBackFromConsent}
                className='sm:order-1'
              >
                Go Back
              </Button>
              <Button
                onClick={proceedToPayment}
                className='bg-red-600 hover:bg-red-700 sm:order-2'
              >
                Yes, I Understand and Want to Proceed
              </Button>
            </DialogFooter>
          </>
        ) : (
          // NORMAL VIEW
          <>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2.5 text-lg font-semibold md:text-xl'>
                <FileText className='opacity-80' /> Download Public Documents
              </DialogTitle>
              <DialogDescription className='text-xs text-muted-foreground md:text-sm'>
                Get quick access to MCA public documents for{' '}
                <strong>{companyData.data.company}</strong>
              </DialogDescription>
            </DialogHeader>

            {/* IF COMPANY IS STRUCK OFF, SHOW WARNING */}
            {isCompanyStruckOff && (
              <Alert variant='destructive' className='bg-red-100'>
                <AlertDescription className='text-[10px] leading-tight md:text-xs'>
                  This company has a <strong>Strike Off</strong> status. It may
                  have limited or no document filings available.
                </AlertDescription>
              </Alert>
            )}

            {/* IF COMPANY AGE IS LESS THAN 1 YEAR WE SHOULD SHOW A WARNING */}
            {companyData.data.incorporationAge <= 12 && (
              <Alert variant='default' className='bg-yellow-100'>
                <AlertDescription className='text-[10px] leading-tight md:text-xs'>
                  This company was incorporated less than a year ago. Initially,
                  you may not see much data if the company hasn&apos;t filed any
                  documents yet. However, as they file, you&apos;ll be able to
                  access their data from here. Please verify available filings
                  in the Public Documents tab before proceeding with the
                  download.
                </AlertDescription>
              </Alert>
            )}

            <div className='space-y-6'>
              {/* Features */}
              <div className='space-y-3'>
                <h3 className='font-medium'>What&apos;s included:</h3>
                <ul className='space-y-2 text-xs text-muted-foreground md:text-sm'>
                  {vpdUnlockService?.features?.map((feature, index) => (
                    <li key={index} className='flex gap-2'>
                      <CheckCircle2 className='size-4 flex-shrink-0 text-green-600' />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Excludes */}
              <div className='space-y-3'>
                <h3 className='font-medium'>What&apos;s not included:</h3>
                <ul className='space-y-2 text-xs text-muted-foreground md:text-sm'>
                  {vpdUnlockService?.excludes?.map((exclude, index) => (
                    <li key={index} className='flex items-center gap-2'>
                      <XCircle className='size-4 flex-shrink-0 text-red-600' />
                      {exclude}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing */}
              <div className='rounded-lg border bg-muted/50 p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-medium'>Price</h3>
                    <p className='text-sm text-muted-foreground'>
                      One-time payment
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-lg font-semibold'>
                      {formatCurrency(
                        vpdUnlockService?.vpdUnlockPricing?.singleUnlock
                          ?.price || 0
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className='flex flex-col gap-2'>
                {isInCart ? (
                  <div className='flex items-center gap-6 '>
                    <div className='flex items-center gap-2 md:gap-3'>
                      <div className='rounded-full bg-gray-500/10 p-1.5'>
                        <CheckCircle2 className='size-4 text-muted-foreground' />
                      </div>
                      <p className='whitespace-nowrap text-xs font-medium text-muted-foreground md:text-sm'>
                        Added to Cart
                      </p>
                    </div>
                    <Button
                      variant='gooeyLeft'
                      className='w-full'
                      onClick={() => router.push('/cart')}
                    >
                      View Cart
                    </Button>
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <Button
                      title='Add to Cart'
                      variant='outline'
                      size='icon'
                      className='h-10 w-fit gap-2 border-black/10 bg-black/5 px-6 text-black/90 hover:bg-black/10'
                      onClick={handleAddToCart}
                    >
                      <FaCartPlus className='size-4 transition-transform duration-300 group-hover:scale-110' />{' '}
                      <span className='hidden md:inline'>Add to Cart</span>
                    </Button>
                    <Button
                      title='Proceed to Payment'
                      variant='gooeyLeft'
                      className='flex-1 bg-primary text-white hover:bg-primary'
                      onClick={handleUnlock}
                    >
                      <CreditCard className='mr-2 size-4 transition-transform duration-300 group-hover:scale-110' />{' '}
                      Proceed to Payment
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UnlockPublicDocsBtn;
