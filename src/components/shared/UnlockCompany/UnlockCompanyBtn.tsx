/* eslint-disable camelcase */
'use client';

import type React from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { BASE_URL_BACKEND } from '@/constants';
import { formatToUrl, toCamelCase } from '@/lib/formatters';
import { trackThriveStackFeatureUsage } from '@/lib/thriveStack';
import { cn } from '@/lib/utils';
import { usePricingStore } from '@/store/pricingStore';
import { useUserSignInDetails } from '@/store/userStore';
import { sendGTMEvent } from '@next/third-parties/google';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Check,
  CheckCircle,
  CheckCircle2,
  ExternalLink,
  FileCheck,
  Loader2,
  Package,
  RefreshCcw,
  UnlockKeyhole,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaCartPlus } from 'react-icons/fa6';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useCartStore } from '../../../app/(root)/cart/_store/cartStore';
import type { TCompanyMasterData } from '../../../app/(root)/company/_types/CompanyDetails';

const BEST_VALUE_CREDIT = 10; // this is for showing best value option (bulk credits)

export default function UnlockCompanyBtn({
  companyData,
  dialogTrigger,
  btnText = 'Unlock Company',
  source,
  className,
  iconClassName,
  isSamePage = false, // to confirm if the user is on the same company page in dashboard (in that case we have to reload the page to update states)
}: {
  companyData: TCompanyMasterData;
  dialogTrigger?: React.ReactNode;
  btnText?: string;
  source?: string;
  className?: string;
  iconClassName?: string;
  isSamePage?: boolean;
}) {
  const router = useRouter();

  // plan selection / options
  const [selectedPlan, setSelectedPlan] = useState<'cash' | 'credit' | 'bulk'>(
    'cash'
  );
  // cta modal open close state
  const [isOpen, setIsOpen] = useState(false);
  // unlock using 1 credit state
  const [unlockStatus, setUnlockStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  // Track if we're showing the consent view for strike off companies
  const [showingConsent, setShowingConsent] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');

  // get pricing data from pricing store
  const serviceCatalogFromDB = usePricingStore(
    (state) => state.serviceCatalogFromDB
  );
  const serviceCatalogFromDBPending = usePricingStore(
    (state) => state.serviceCatalogFromDBPending
  );
  const serviceCatalogFromDBError = usePricingStore(
    (state) => state.serviceCatalogFromDBError
  );

  // add item to cart store (for single and bulk unlock)
  const addItem = useCartStore((state) => state.addItem);
  // get cart items to check if current company is already in cart
  const cartItems = useCartStore((state) => state.items);

  // Check if current company is already in cart
  const isInCart = cartItems.some(
    (item) =>
      item.customAttributes?.companyId === companyData.data.cin &&
      item.serviceType === 'companyUnlock'
  );

  // get user info from user data store (for userId)
  const userSignInDetails = useUserSignInDetails(
    (state) => state.userSignInDetails
  );
  const userSignInDetailsLoading = useUserSignInDetails(
    (state) => state.userSignInDetailsLoading
  );
  const userSignInDetailsError = useUserSignInDetails(
    (state) => state.userSignInDetailsError
  );
  const refetchUserSignInDetails = useUserSignInDetails(
    (state) => state.refetchUserSignInDetails
  );

  // company unlock service catalog
  const companyUnlockService = serviceCatalogFromDB?.serviceCatalog?.find(
    (service) => service.serviceType === 'companyUnlock'
  );
  // get single unlock price
  const singleUnlockPrice =
    companyUnlockService?.companyUnlockPricing?.singleUnlock?.price || 0;
  // get bulk unlock price
  const bulkUnlockPackage =
    companyUnlockService?.companyUnlockPricing?.bulkUnlock?.find(
      (pkg) => pkg.credits === BEST_VALUE_CREDIT
    );
  // get total bulk unlock price
  const bulkUnlockTotalPrice = bulkUnlockPackage
    ? bulkUnlockPackage?.price * bulkUnlockPackage?.credits
    : 0;
  // get save on bulk package
  const saveOnBulkPackage =
    singleUnlockPrice * BEST_VALUE_CREDIT - bulkUnlockTotalPrice;

  const currency =
    companyUnlockService?.companyUnlockPricing?.currency || 'INR';

  // utility functions: format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Check if company is struck off
  const isCompanyStruckOff = companyData.data.status === 'Strike Off';

  // check if user has company unlock credits
  const availableCredits =
    userSignInDetails?.data?.bulk_unlock_credits?.find(
      (credit) => credit.creditType === 'companyUnlock'
    )?.availableCredits || 0;
  const hasCompanyUnlockCredits = userSignInDetails && availableCredits > 0;
  // if user has company unlock credits, set selected plan to 'credit'
  useEffect(() => {
    if (hasCompanyUnlockCredits) {
      setSelectedPlan('credit');
    }
  }, [hasCompanyUnlockCredits]);

  // handle plan selection: credit based unlock
  const unlockMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${BASE_URL_BACKEND}/api/v1/unlock-company`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _userId: userSignInDetails?.data?._id,
            companyId: companyData.data.cin,
            creditType: 'companyUnlock',
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to unlock company');
      }

      return response.json();
    },
    onSuccess: () => {
      setUnlockStatus('success');
      refetchUserSignInDetails?.();
      setIsOpen(true);

      const url = `/dashboard/unlock-companies/company-details/${formatToUrl(companyData.data.company)}/${companyData.data.cin}?tab=about`;
      setRedirectUrl(url);

      setTimeout(() => {
        if (isSamePage) {
          setIsOpen(false);
          window.location.reload();
        } else {
          router.push(url);
        }
      }, 2000);
    },
    onError: (error: Error) => {
      setUnlockStatus('error');
      setErrorMessage(
        error.message || 'An unexpected error occurred. Please try again.'
      );
    },
  });

  const handleUnlockToCart = () => {
    // SINGLE UNLOCK: add to cart
    if (selectedPlan === 'cash') {
      // unlock using cash: add to cart
      addItem({
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
          companyId: companyData.data.cin,
          companyName: companyData.data.company,
        },
        currency: currency || '',
        basePrice: singleUnlockPrice,
      });

      // send gtm events: checkout
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

      router.push(
        `/cart?type=single-company-unlock&cin=${companyData.data.cin}&company=${formatToUrl(companyData.data.company)}`
      );

      // UNLOCK BULK CREDITS: add to cart
    } else if (selectedPlan === 'bulk') {
      // purchase bulk credits: add to cart
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
              item_id: companyUnlockService?._id,
              item_name: `${companyUnlockService?.name} (${bulkUnlockPackage?.credits} credit)`,
              price: bulkUnlockTotalPrice,
              quantity: 1, // number of items
            },
          ],
        },
      });

      router.push(
        `/cart?type=bulk-company-unlock&credit=${bulkUnlockPackage?.credits || BEST_VALUE_CREDIT}`
      );

      // UNLOCK USING 1 CREDIT: instant unlock
    } else if (selectedPlan === 'credit') {
      // Check if user is signed in first
      if (!userSignInDetails?.data?._id) {
        setErrorMessage('Please sign in first to unlock using credits');
        return;
      }

      setErrorMessage('');
      unlockMutation.mutate();
    }
  };

  // handler functions: unlock
  const handleUnlock = async () => {
    if (unlockMutation.isPending) return; // Use mutation state instead

    // If company is struck off, show consent view first
    if (isCompanyStruckOff && !showingConsent && selectedPlan !== 'bulk') {
      setShowingConsent(true);
      return;
    }

    handleUnlockToCart();
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
              currency: currency || 'INR',
              value: singleUnlockPrice + bulkUnlockTotalPrice,
              items: [
                {
                  item_id: companyUnlockService?._id,
                  item_name: `${companyUnlockService?.name} (1 credit)`,
                  price: singleUnlockPrice,
                  quantity: 1,
                },
                {
                  item_id: companyUnlockService?._id,
                  item_name: `${companyUnlockService?.name} (${bulkUnlockPackage?.credits} credit)`,
                  price: bulkUnlockTotalPrice,
                  quantity: 1,
                },
              ],
            },
          });

          // THRIVESTACK: FEATURE USAGE TRACKING CODE
          trackThriveStackFeatureUsage({
            featureName: `Company Unlock CTA - ${source}`,
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
        {/* STRIKE OFF CONSENT VIEW */}
        {showingConsent ? (
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
                onClick={() => {
                  setShowingConsent(false);
                  handleUnlockToCart();
                }}
                className='bg-red-600 hover:bg-red-700 sm:order-2'
              >
                Yes, I Understand and Want to Proceed
              </Button>
            </DialogFooter>
          </>
        ) : (
          // NORMAL VIEWS
          <>
            {/* IF COMPANY TYPE IS NOT LLP THEN SHOW PROPER MESSAGE */}
            {companyData.data.companyType !== 'LLP' ? (
              <>
                <DialogHeader>
                  <div className='flex items-center gap-2'>
                    <AlertCircle className='h-6 w-6 text-yellow-600' />
                    <DialogTitle>Coming Soon!</DialogTitle>
                  </div>

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
                    <strong>searching for LLPs</strong> in your area of
                    interest. We are <strong>continually working</strong> to
                    expand our offerings and may introduce this feature for
                    other company types in the future.
                  </DialogDescription>
                </DialogHeader>
              </>
            ) : (
              // IF COMPANY TYPE IS LLP THEN SHOW THE DIALOG CONTENT
              <>
                <DialogHeader>
                  <DialogTitle className='flex items-center gap-2 text-lg font-bold text-primary md:text-xl'>
                    <UnlockKeyhole className='size-5 md:size-6' /> Unlock{' '}
                    {companyData.data.company &&
                    companyData.data.company.length > 0
                      ? toCamelCase(companyData.data.company)
                      : '-'}
                  </DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>

                {/* IF COMPANY IS STRUCK OFF, SHOW WARNING */}
                {isCompanyStruckOff && (
                  <Alert variant='destructive' className='bg-red-100'>
                    {/* <AlertCircle className='size-4' /> */}
                    <AlertDescription className='text-[10px] leading-tight md:text-xs'>
                      This company has a <strong>Strike Off</strong> status. It
                      may have limited or no document filings available.
                    </AlertDescription>
                  </Alert>
                )}

                {/* IF COMPANY AGE IS LESS THAN 1 YEAR WE SHOULD SHOW A WARNING */}
                {companyData.data.incorporationAge <= 12 && (
                  <Alert variant='default' className='bg-yellow-100'>
                    <AlertCircle className='size-4' />
                    {/* <AlertTitle>Recently Incorporated Company</AlertTitle> */}
                    <AlertDescription className='text-[10px] leading-tight md:text-xs'>
                      This {companyData.data.companyType} was incorporated less
                      than a year ago. Initially, you may not see much data if
                      the {companyData.data.companyType} hasn&apos;t filed any
                      documents yet. However, as they file, you&apos;ll be able
                      to access their data and financials from here. Please
                      verify available filings in the Public Documents tab
                      before proceeding with the download.
                    </AlertDescription>
                  </Alert>
                )}

                {/* LOADING STATE */}
                {serviceCatalogFromDBPending || userSignInDetailsLoading ? (
                  <div className='space-y-4'>
                    <Skeleton className='h-20 w-full' />
                    <Skeleton className='h-20 w-full' />
                    <Skeleton className='h-10 w-full' />
                  </div>
                ) : // ERROR STATE
                serviceCatalogFromDBError || userSignInDetailsError ? (
                  <Alert variant='destructive' className='mt-4'>
                    <AlertCircle className='h-4 w-4' />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription className='mt-2'>
                      <p className='mb-2'>
                        {serviceCatalogFromDBError?.message ||
                          userSignInDetailsError?.message ||
                          'We encountered an issue while fetching the necessary data. Please try again.'}
                      </p>
                      <Button
                        variant='outline'
                        size='sm'
                        className='mt-2'
                        onClick={() => window.location.reload()}
                      >
                        <RefreshCcw className='mr-2 h-4 w-4' />
                        Reload Page
                      </Button>
                    </AlertDescription>
                  </Alert>
                ) : (
                  // SUCCESS STATE
                  <div className='mt-2 space-y-4'>
                    <RadioGroup
                      value={selectedPlan}
                      onValueChange={(value) =>
                        setSelectedPlan(value as 'cash' | 'credit' | 'bulk')
                      }
                      className={cn(
                        'space-y-4',
                        unlockMutation.isPending || unlockStatus === 'success'
                          ? 'pointer-events-none blur-[2px]'
                          : ''
                      )}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={cn(
                          'relative rounded-lg border-2 p-4 transition-colors',
                          selectedPlan === 'cash' || selectedPlan === 'credit'
                            ? 'border-primary bg-primary/5'
                            : 'border-muted'
                        )}
                      >
                        <div className='flex flex-col space-y-3'>
                          <div className='flex items-center justify-between'>
                            <span className='text-base font-semibold md:text-lg'>
                              Single {companyData.data.companyType}
                              <span className='ml-2 text-xs text-muted-foreground md:text-sm'>
                                (Reports + All MCA Documents)
                              </span>
                            </span>
                            <FileCheck className='size-5 text-primary' />
                          </div>
                          <div className='space-y-2'>
                            <div
                              className={cn(
                                'flex items-center space-x-2 rounded px-1.5 py-1 hover:bg-sky-50',
                                selectedPlan === 'cash'
                                  ? 'bg-sky-50 ring-1 ring-primary'
                                  : ''
                              )}
                            >
                              <RadioGroupItem value='cash' id='cash' />
                              <Label
                                htmlFor='cash'
                                className='flex w-full cursor-pointer items-center gap-2'
                              >
                                <span>
                                  Pay{' '}
                                  <strong className='text-primary md:ml-0.5'>
                                    {formatCurrency(singleUnlockPrice)}
                                  </strong>
                                </span>
                                <span className='text-xs text-muted-foreground'>
                                  (One-time payment)
                                </span>
                              </Label>
                            </div>
                            <div
                              className={cn(
                                'flex items-center space-x-2 rounded px-1.5 py-1 hover:bg-sky-50',
                                selectedPlan === 'credit'
                                  ? 'bg-sky-50 ring-1 ring-primary'
                                  : ''
                              )}
                            >
                              <RadioGroupItem
                                value='credit'
                                id='credit'
                                disabled={!hasCompanyUnlockCredits}
                              />
                              <Label
                                htmlFor='credit'
                                className={cn(
                                  'flex w-full cursor-pointer items-center gap-2',
                                  !hasCompanyUnlockCredits && 'opacity-50'
                                )}
                              >
                                <span>Use 1 Credit</span>
                                <span className='text-xs text-muted-foreground'>
                                  (
                                  {!userSignInDetails
                                    ? 'Sign in to check your available credits'
                                    : hasCompanyUnlockCredits
                                      ? `${availableCredits} credits available`
                                      : 'No credits available'}
                                  )
                                </span>
                              </Label>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={cn(
                          'relative rounded-lg border-2 p-4 transition-colors',
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
                        <RadioGroupItem
                          value='bulk'
                          id='bulk'
                          className='sr-only'
                        />
                        <Label
                          htmlFor='bulk'
                          className='flex cursor-pointer flex-col'
                        >
                          <div className='flex items-center justify-between'>
                            <span className='text-base font-semibold md:text-lg'>
                              Bulk Package
                            </span>
                            <Package className='size-5 text-primary' />
                          </div>
                          <div className='mt-2 flex items-center gap-2'>
                            <div className='text-lg font-bold text-primary'>
                              {formatCurrency(bulkUnlockTotalPrice || 0)}
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              ({bulkUnlockPackage?.credits}{' '}
                              {companyData.data.companyType} Data with 1 Year
                              Validity)
                            </div>
                          </div>
                          <ul className='mt-2 space-y-1 text-xs'>
                            <li className='flex items-center'>
                              <Check className='mr-2 h-4 w-4 text-emerald-500' />
                              <span>
                                Save {formatCurrency(saveOnBulkPackage)}{' '}
                                compared to single{' '}
                                {companyData.data.companyType} unlock
                              </span>
                            </li>
                          </ul>
                        </Label>
                      </motion.div>
                    </RadioGroup>

                    {unlockMutation.isPending ? (
                      <div className='flex items-center justify-center space-x-2 text-primary'>
                        <Loader2 className='h-6 w-6 animate-spin' />
                        <p className='animate-pulse'>Unlocking company...</p>
                      </div>
                    ) : unlockStatus === 'success' ? (
                      <Alert variant='default'>
                        <AlertTitle className='flex flex-row items-center gap-2 text-lg font-bold text-green-600'>
                          <CheckCircle className='inline size-6 text-green-600' />{' '}
                          Success
                        </AlertTitle>
                        <AlertDescription>
                          <p className='animate-pulse'>
                            {companyData.data.companyType} unlocked
                            successfully. Redirecting to
                            {companyData.data.companyType} page...
                          </p>
                          <p className='mt-1.5 text-xs'>
                            If you&apos;re not redirected automatically, please
                            click the link below:
                          </p>
                          <Button
                            variant='link'
                            className='p-0 text-primary'
                            onClick={() => {
                              if (isSamePage) {
                                setIsOpen(false);
                                window.location.reload();
                              } else {
                                router.push(redirectUrl);
                              }
                            }}
                          >
                            Go to {companyData.data.companyType} Page{' '}
                            <ExternalLink className='ml-1.5 h-4 w-4' />
                          </Button>
                        </AlertDescription>
                      </Alert>
                    ) : unlockStatus === 'error' ? (
                      <Alert variant='destructive'>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription className='flex flex-row items-center justify-between gap-4'>
                          <p>{errorMessage}</p>
                          <Button
                            variant='outline'
                            size='sm'
                            className='mt-2'
                            onClick={() => window.location.reload()}
                          >
                            <RefreshCcw className='mr-2 h-4 w-4' />
                            Reload Page
                          </Button>
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <>
                        <div className='flex gap-2'>
                          {selectedPlan === 'cash' && (
                            <>
                              {isInCart ? (
                                <div className='flex w-full items-center gap-6'>
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
                                <Button
                                  variant='outline'
                                  className='group h-11 w-fit gap-2 border-black/10 bg-black/5 px-6 text-black hover:bg-black/10'
                                  onClick={() => {
                                    // Add to cart without redirecting
                                    addItem({
                                      serviceId:
                                        companyUnlockService?._id || '',
                                      serviceName:
                                        companyUnlockService?.name || '',
                                      serviceType:
                                        companyUnlockService?.serviceType || '',
                                      description:
                                        companyUnlockService?.description || '',
                                      features:
                                        companyUnlockService?.features || [],
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
                                            item_id: companyUnlockService?._id,
                                            item_name: `${companyUnlockService?.name} (1 credit)`,
                                            price: singleUnlockPrice,
                                            quantity: 1,
                                          },
                                        ],
                                      },
                                    });
                                  }}
                                >
                                  <FaCartPlus className='size-4 transition-transform duration-300 group-hover:scale-110' />
                                  <span className='hidden md:inline'>
                                    Add to Cart
                                  </span>
                                </Button>
                              )}
                            </>
                          )}

                          <Button
                            className={cn(
                              'w-full',
                              isInCart && selectedPlan === 'cash'
                                ? 'hidden'
                                : ''
                            )}
                            size='lg'
                            onClick={handleUnlock}
                            disabled={unlockMutation.isPending}
                          >
                            {unlockMutation.isPending ? (
                              <span className='flex items-center gap-2'>
                                <Loader2 className='h-4 w-4 animate-spin' />
                                Processing...
                              </span>
                            ) : selectedPlan === 'cash' ? (
                              `Pay ${formatCurrency(singleUnlockPrice)}`
                            ) : selectedPlan === 'credit' ? (
                              'Use 1 Credit'
                            ) : (
                              `Purchase Bulk Package for ${formatCurrency(bulkUnlockTotalPrice)}`
                            )}
                          </Button>
                        </div>

                        <ul className='mt-2 space-y-1 text-[10px]'>
                          <li className='flex gap-1.5'>
                            *{' '}
                            <span>
                              Once you unlock a company, you can view the{' '}
                              {companyData.data.companyType} data for a year
                              from the date of unlock.
                            </span>
                          </li>
                          <li className='flex gap-1.5'>
                            * <span>All prices are exclusive of GST.</span>
                          </li>
                        </ul>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
