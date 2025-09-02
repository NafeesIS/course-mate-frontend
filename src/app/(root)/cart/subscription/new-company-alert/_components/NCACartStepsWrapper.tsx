/* eslint-disable camelcase */
'use client';

import { useNewCompanyAlertStore } from '@/app/(root)/new-company-alert/_store/company-alert-store';
import SupportedPayOptions from '@/app/(root)/unlock-contact/_components/SupportedPayOptions';
import { Button } from '@/components/ui/button';
import { useNCACampaignStatus } from '@/hooks/useNcaCampaign';
import { IUserSignInDetails } from '@/store/userStoreTypes';
import { sendGTMEvent } from '@next/third-parties/google';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import BillingDetails from '../../../_components/BillingDetails';
import { calculatePriceBreakdown } from '../_utils/priceCalculation';
import CartItemDetails from './CartItemDetails';
import OrderSummary from './OrderSummery';
import PaymentButton from './PaymentButton';
import TrialPlanCartItem from './TrialPlanCartItem';

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

const NCACartStepsWrapper = ({
  userSignInDetails,
}: {
  userSignInDetails: IUserSignInDetails;
}) => {
  // cart steps
  const [currentStep, setCurrentStep] = useState('cart');

  const { isActive, discount, discountEmailMobile } = useNCACampaignStatus();

  // State for promo code
  const [promoInfo, setPromoInfo] = useState<{
    code: string;
    type: 'percentage' | 'flat';
    value: number;
    discount: number;
  } | null>(null);

  // company alert store
  const { selectedZones, selectedDuration, selectedPlan } =
    useNewCompanyAlertStore();

  const discountMultiplier =
    selectedDuration !== 'trial'
      ? isActive
        ? 1 -
          (selectedPlan?.name.includes('Email and Phone')
            ? discountEmailMobile
            : discount) /
            100
        : 1 // No discount if campaign is not active
      : 1; // No discount if trial plan

  // price calculation
  const {
    itemPrice,
    gstOnItemPrice,
    subtotalExcGST,
    gstAfterDiscount,
    subtotalAfterDiscount,
    totalPriceAfterDiscount,
  } = useMemo(() => {
    if (promoInfo) {
      return calculatePriceBreakdown(
        selectedDuration,
        selectedZones,
        discountMultiplier,
        promoInfo.discount
      );
    }
    return calculatePriceBreakdown(
      selectedDuration,
      selectedZones,
      discountMultiplier
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDuration, selectedZones, promoInfo]);

  const handleNextStep = useCallback(() => {
    if (!selectedPlan) {
      toast.error('Please select a plan.');
      return;
    }

    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
      scrollTo({ top: 0, behavior: 'smooth' });
    }

    sendGTMEvent({
      event: 'begin_checkout',
      ecommerce: {
        currency: 'INR',
        value: totalPriceAfterDiscount - gstAfterDiscount,
        items: [
          {
            item_id: selectedPlan._id,
            item_name:
              selectedDuration !== 'trial'
                ? selectedPlan.name
                : `${selectedPlan.name} (trial)`,
            price: totalPriceAfterDiscount - gstAfterDiscount,
            quantity: 1,
          },
        ],
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, selectedPlan, totalPriceAfterDiscount, gstAfterDiscount]);

  const handlePreviousStep = useCallback(() => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  }, [currentStep]);

  const handlePromoApplied = useCallback((newPromoInfo: typeof promoInfo) => {
    setPromoInfo(newPromoInfo);
  }, []);

  return (
    <>
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

      <div className='mt-8 grid grid-cols-1 gap-8 md:mt-10 lg:grid-cols-3'>
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
              {/* CART */}
              {currentStep === 'cart' && (
                // this is the new company alert cart item
                <>
                  {selectedDuration === 'trial' ? (
                    <TrialPlanCartItem />
                  ) : (
                    <CartItemDetails />
                  )}
                </>
              )}

              {/* BILLING DETAILS */}
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
            </motion.div>
          </AnimatePresence>
        </div>
        <div className='lg:col-span-1'>
          <div className='sticky top-20 space-y-8'>
            {/* here we will show the amount, gst, add gst number, total etc. */}
            <OrderSummary
              userId={userSignInDetails.data._id}
              serviceIds={selectedPlan ? [selectedPlan._id] : []}
              itemPrice={itemPrice}
              gstOnItemPrice={gstOnItemPrice}
              subtotalExcGST={subtotalExcGST}
              totalPriceAfterDiscount={totalPriceAfterDiscount}
              gstAfterDiscount={gstAfterDiscount}
              subtotalAfterDiscount={subtotalAfterDiscount}
              onPromoApplied={handlePromoApplied}
              promoInfo={promoInfo}
            />

            {/* Terms and Conditions */}
            <p className='mt-4 text-[10px] text-gray-500 md:text-xs'>
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

            <div className='space-y-8'>
              {currentStep === 'cart' ? (
                <Button onClick={handleNextStep} className='w-full'>
                  Proceed to Checkout
                </Button>
              ) : (
                // all the payment logic (create order, verify payment, etc.)
                <PaymentButton
                  gst={gstAfterDiscount}
                  total={totalPriceAfterDiscount}
                  originalPrice={itemPrice}
                  promoInfo={promoInfo}
                />
              )}

              <SupportedPayOptions className='xl:grid-cols-8' />
            </div>
          </div>
        </div>
      </div>

      <section className='mt-10 bg-muted p-4 sm:rounded-md'>
        <h6 className='text-sm font-semibold md:text-base'>
          Points to remember
        </h6>

        <ul className='mt-2 list-inside list-disc pl-2 text-xs text-muted-foreground md:text-sm'>
          <li>Circulation of these details is prohibited</li>
          <li>
            Please check the sample files before proceeding with the payment
          </li>
          <li>Amount once paid will not be refunded under any circumstances</li>
        </ul>
      </section>
    </>
  );
};

export default NCACartStepsWrapper;
