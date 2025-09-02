/* eslint-disable camelcase */
'use client';

import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { usePricingStore } from '@/store/pricingStore';
import { useUserSignInDetails } from '@/store/userStore';
import { sendGTMEvent } from '@next/third-parties/google';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import SupportedPayOptions from '../unlock-contact/_components/SupportedPayOptions';
import BillingDetails from './_components/BillingDetails';
import CartItemsDetails from './_components/CartItemsDetails';
import OrderSummary from './_components/OrderSummary';
import PaymentButton from './_components/PaymentButton';
import { useCartStore } from './_store/cartStore';
import { calculateCartTotalsExcGST } from './_utils/priceCalculationExcGST';

const steps = [
  { id: 'cart', label: 'Cart', icon: ShoppingCart },
  { id: 'checkout', label: 'Checkout', icon: CheckCircle2 },
];

const pageVariants = {
  initial: { opacity: 0, x: '-5%' },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: '5%' },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.4,
};

export default function CartPage() {
  const { userSignInDetails, userSignInDetailsLoading } =
    useUserSignInDetails();
  const { serviceCatalogFromDB, serviceCatalogFromDBPending } =
    usePricingStore();
  const {
    items: cartItems,
    addItem,
    removeItem,
    updateItem,
    clearCart,
  } = useCartStore();

  // cart steps
  const [currentStep, setCurrentStep] = useState('cart');
  // State for promo code
  const [promoInfo, setPromoInfo] = useState<{
    code: string;
    type: 'percentage' | 'flat';
    value: number;
    discount: number;
  } | null>(null);

  // State for currency mismatch
  const [currencyMismatch, setCurrencyMismatch] = useState(false);
  // Check for currency mismatches or multiple currencies
  useEffect(() => {
    if (serviceCatalogFromDB && cartItems.length > 0) {
      const catalogCurrency = serviceCatalogFromDB.currency;
      const currencyMismatch = cartItems.some(
        (item) => item.currency !== catalogCurrency
      );

      if (currencyMismatch) {
        setCurrencyMismatch(true);
        clearCart();
      } else {
        setCurrencyMismatch(false);
      }
    }
  }, [serviceCatalogFromDB, cartItems, clearCart]);

  // price calculation
  const {
    baseTotal,
    totalAfterGlobalDiscount,
    totalAfterPromoApplied,
    gstAmount,
    totalIncludingGST,
    globalDiscountAmount,
    promoCodeDiscountAmount,
    totalDiscountAmount,
  } = useMemo(() => {
    if (promoInfo) {
      return calculateCartTotalsExcGST(
        cartItems,
        serviceCatalogFromDB?.currency || 'INR',
        1,
        promoInfo.discount
      );
    }
    return calculateCartTotalsExcGST(
      cartItems,
      serviceCatalogFromDB?.currency || 'INR'
    );
  }, [cartItems, serviceCatalogFromDB, promoInfo]);

  const handlePromoApplied = useCallback((newPromoInfo: typeof promoInfo) => {
    setPromoInfo(newPromoInfo);
  }, []);

  // SHOW LOADER
  if (
    (userSignInDetailsLoading && !userSignInDetails) ||
    (serviceCatalogFromDBPending && !serviceCatalogFromDB)
  ) {
    return <LoadingWithSpinner className='min-h-[90vh]' />;
  }

  const handleNextStep = () => {
    if (currencyMismatch) {
      toast.error(
        'Your cart has been reset due to currency inconsistencies. Please add items again.'
      );
      return;
    }

    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
      window.scrollTo(0, 0);

      // send gtm events: checkout
      sendGTMEvent({
        event: 'begin_checkout',
        ecommerce: {
          currency: cartItems[0].currency || 'INR',
          value: totalAfterPromoApplied,
          items: cartItems.map((item) => ({
            item_id: item.serviceId,
            item_name: `${item.serviceName}${!item.serviceName.includes('Public Documents Download') ? ` (${item.selectedPricing.credits} credit)` : ''}`,
            price: item.selectedPricing.price * item.selectedPricing.credits,
            quantity: 1,
          })),
        },
      });
    }
  };

  const handlePreviousStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  return (
    <div className='wrapper mx-auto pb-16 pt-8 md:pt-10'>
      {/* Progress Steps */}
      <div className='flex justify-center'>
        {steps.map((step, index) => (
          <div key={step.id} className='flex items-center'>
            <div
              className={`flex size-8 items-center justify-center rounded-full md:size-12 ${currentStep === step.id ? 'bg-primary text-white' : 'bg-gray-200'} transition-colors duration-300`}
            >
              <step.icon className='size-4 md:size-6' />
            </div>
            <span
              className={`ml-2 ${currentStep === step.id ? 'font-bold' : ''} transition-colors duration-300`}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div className='mx-4 h-1 w-12 bg-gray-200 md:w-24'>
                <motion.div
                  className='h-full bg-primary'
                  initial={{ width: '0%' }}
                  animate={{
                    width: currentStep === steps[index + 1].id ? '100%' : '0%',
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className='mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentStep}
              initial='initial'
              animate='in'
              exit='out'
              variants={pageVariants}
              transition={pageTransition}
            >
              {currentStep === 'cart' && (
                <CartItemsDetails
                  cartItems={cartItems}
                  addItem={addItem}
                  removeItem={removeItem}
                  updateItem={updateItem}
                />
              )}
              {currentStep === 'checkout' && (
                <>
                  <BillingDetails userDetails={userSignInDetails?.data} />

                  <Button
                    onClick={handlePreviousStep}
                    variant='outline'
                    className='mt-4'
                  >
                    Back to Cart
                  </Button>
                </>
              )}

              {currencyMismatch && (
                <Alert variant='destructive' className='mt-4 text-center'>
                  <AlertTitle className='flex items-center justify-center gap-2'>
                    <AlertCircle className='size-4' />
                    Currency Mismatch Detected
                  </AlertTitle>
                  <AlertDescription className='mt-2 text-xs'>
                    <p className='mb-1 text-balance'>
                      We&apos;ve detected a currency mismatch in your cart. To
                      ensure accurate pricing, your cart has been cleared.
                    </p>
                    <p className='mb-1'>Please add items to your cart again.</p>
                    <p>
                      If you need assistance, please contact our support team.
                    </p>
                  </AlertDescription>
                </Alert>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className='lg:col-span-1'>
          <div className='sticky top-20'>
            <OrderSummary
              userId={(userSignInDetails && userSignInDetails.data._id) || ''}
              cartItems={cartItems}
              baseTotal={baseTotal}
              totalAfterGlobalDiscount={totalAfterGlobalDiscount}
              totalAfterPromoApplied={totalAfterPromoApplied}
              gstAmount={gstAmount}
              totalIncludingGST={totalIncludingGST}
              globalDiscountAmount={globalDiscountAmount}
              promoCodeDiscountAmount={promoCodeDiscountAmount}
              totalDiscountAmount={totalDiscountAmount}
              onPromoApplied={handlePromoApplied}
              promoInfo={promoInfo}
            />

            {/* Terms and Conditions */}
            <p className='mt-8 text-[10px] text-gray-500 md:text-xs'>
              By proceeding, you accept FileSure&apos;s{' '}
              <Link
                prefetch={false}
                href='/terms-and-conditions'
                target='_blank'
                className='text-blue-500 hover:underline'
              >
                Terms & Conditions
              </Link>
              , and{' '}
              <Link
                prefetch={false}
                href='/refund-policy'
                target='_blank'
                className='text-blue-500 hover:underline'
              >
                Refund Policy
              </Link>
              . Please review these policies before completing your purchase.
            </p>

            <div className='mt-6 space-y-8'>
              {currentStep === 'cart' ? (
                <Button onClick={handleNextStep} className='w-full'>
                  Proceed to Checkout
                </Button>
              ) : (
                <PaymentButton
                  gst={gstAmount}
                  total={totalIncludingGST}
                  promoInfo={promoInfo}
                />
              )}

              <SupportedPayOptions className='xl:grid-cols-8' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
