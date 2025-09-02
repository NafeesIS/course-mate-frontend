/* eslint-disable camelcase */
'use client';

import { Button } from '@/components/ui/button';
import {
  BASE_URL_BACKEND,
  BASE_URL_FRONTEND,
  CASHFREE_INSTANCE_MODE,
} from '@/constants';
import { validateGst } from '@/lib/utils';
import { useUserSignInDetails } from '@/store/userStore';
import { load } from '@cashfreepayments/cashfree-js';
import { sendGTMEvent } from '@next/third-parties/google';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { AlertCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useBillingStore } from '../_store/billingStore';
import { useCartStore } from '../_store/cartStore';

export type TCashfreeInstance = {
  // eslint-disable-next-line no-unused-vars
  checkout: (options: {
    paymentSessionId: string;
    redirectTarget: '_self' | '_modal';
  }) => Promise<any>;
};

const PaymentButton = ({
  gst,
  total,
  promoInfo,
}: {
  gst: number;
  total: number;
  promoInfo: {
    code: string;
    type: 'percentage' | 'flat';
    value: number;
    discount: number;
  } | null;
}) => {
  const router = useRouter();
  const payButtonRef = useRef(null);

  // STORES
  const { userSignInDetails, refetchUserSignInDetails } =
    useUserSignInDetails();
  const { billingInfo, gstInfo } = useBillingStore();
  const cartItems = useCartStore((state) => state.items);
  const { clearCart } = useCartStore();

  // STATES
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cashfree, setCashfree] = useState<TCashfreeInstance | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [orderId, setOrderId] = useState('');

  // INITIALIZE CASHFREE
  useEffect(() => {
    const initializeSDK = async function () {
      const cashfreeInstance = await load({
        mode: CASHFREE_INSTANCE_MODE,
      });
      setCashfree(cashfreeInstance as TCashfreeInstance);
    };

    initializeSDK();
  }, []);

  // CHECK CART AND BILLING INFO DETAILS BEFORE PROCEEDING
  useEffect(() => {
    if (billingInfo) {
      validateOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingInfo, cartItems, gstInfo]);

  const validateOrder = () => {
    if (cartItems.length === 0) {
      setErrorMessage(
        'Your cart is empty. Please add items before proceeding.'
      );
      setIsValid(false);
      return;
    }

    if (
      !billingInfo.firstName ||
      !billingInfo.lastName ||
      !billingInfo.email ||
      !billingInfo.mobileNumber ||
      !billingInfo.zipCode ||
      !billingInfo.country ||
      !billingInfo.state
    ) {
      setErrorMessage(
        'Please complete all required fields marked with (*) in the billing details form'
      );
      setIsValid(false);
      return;
    }

    if (gstInfo.addGst && !validateGst(gstInfo.gstNumber)) {
      if (!gstInfo.gstNumber) {
        setErrorMessage('Please enter GST number');
      } else {
        setErrorMessage('Please enter a valid GST number');
      }
      setIsValid(false);
      return;
    }

    setErrorMessage('');
    setIsValid(true);
  };

  // PAYMENT: STEP 6
  const verifyPayment = async (orderId: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL_BACKEND}/api/v1/orders/verify-payment`,
        {
          params: { orderId },
        }
      );
      return response.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error verifying payment:', error);
      return null;
    }
  };

  // PAYMENT: STEP 5
  const verifyPaymentMutation = useMutation({
    mutationFn: (orderId: string) => verifyPayment(orderId),
    // eslint-disable-next-line no-unused-vars
    onSuccess: (verifyPaymentResponse) => {
      toast.dismiss();
      toast.success('Payment verified successfully!');
      const paymentId = verifyPaymentResponse.data.paymentId;

      // Send purchase event to GTM
      sendGTMEvent({
        event: 'purchase',
        ecommerce: {
          transaction_id: paymentId,
          value: total - gst,
          currency: cartItems[0].currency || 'INR',
          items: cartItems.map((item) => ({
            item_id: item.serviceId,
            item_name: `${item.serviceName}${!item.serviceName.includes('Public Documents Download') ? ` (${item.selectedPricing.credits} credit)` : ''}`,
            price: item.selectedPricing.price * item.selectedPricing.credits, // without gst
            quantity: 1,
          })),
        },
      });

      refetchUserSignInDetails?.();

      // const redirectUrl = createSuccessUrl(cartItems);
      const redirectUrl = `${BASE_URL_FRONTEND}/checkout/success?order_id=${orderId}`;
      setIsVerifying(false);
      clearCart(); // clear the cart after successful purchase
      router.replace(redirectUrl); // TODO: add success page
    },
    onError: (error: any) => {
      toast.dismiss();
      setIsVerifying(false);
      // eslint-disable-next-line no-console
      console.error('Error verifying payment:', error);
      toast.error('Payment verification failed. Please contact support.');
    },
  });

  // PAYMENT: STEP 4
  const doPayment = async (response: any) => {
    const checkoutOptions = {
      paymentSessionId: response.data.payment_session_id,
      redirectTarget: '_modal' as '_self' | '_modal',
    };

    if (cashfree) {
      cashfree.checkout(checkoutOptions).then(async (result: any) => {
        if (result.error) {
          // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
          toast.error('Payment process interrupted. Please try again.');
          // eslint-disable-next-line no-console
          console.error('Payment error:', result.error);
        }

        if (result.redirect) {
          // This will be true when the payment redirection page couldn't be opened in the same window
          // This is an exceptional case only when the page is opened inside an inAppBrowser
          // In this case the customer will be redirected to return url once payment is completed
          toast.info('Redirecting for payment completion...', {
            description: 'Please wait while we finalize your payment.',
          });
        }

        if (result.paymentDetails) {
          // This will be called whenever the payment is completed irrespective of transaction status
          verifyPaymentMutation.mutate(response.data.order_id);
          setIsVerifying(true);
          toast.loading('Verifying your payment...', { duration: Infinity });
        }
      });
    } else {
      toast.error('Cashfree SDK not initialized! Please try again later!');
    }
  };

  // PAYMENT: STEP 3
  const createOrder = async (): Promise<any> => {
    const orderData = {
      userId: userSignInDetails?.data?._id,
      userName: `${billingInfo.firstName} ${billingInfo.lastName}`,
      userEmail: billingInfo.email,
      userContact: '+' + billingInfo.mobileNumber, // + for cashfree
      billingDetails: {
        firstName: billingInfo.firstName,
        lastName: billingInfo.lastName,
        email: billingInfo.email,
        mobileNumber: billingInfo.mobileNumber,
        address: billingInfo.address,
        city: billingInfo.city,
        country: billingInfo.country,
        state: billingInfo.state,
        zipCode: billingInfo.zipCode,
        isDefault: billingInfo.isDefault,
        billingType: billingInfo.billingType,
      },
      gstNumber: gstInfo.addGst ? gstInfo.gstNumber : undefined,
      // individual items
      items: cartItems.map((item) => ({
        serviceId: item.serviceId,
        serviceName: item.serviceName,
        serviceType: item.serviceType,
        quantity: 1,
        // item's original price
        price: item.selectedPricing.price * item.selectedPricing.credits,
        currency: item.currency,
        customAttributes: {
          // this is for director bulk unlock
          bulkUnlockCredits:
            item.serviceType === 'directorUnlock' &&
            item.selectedPricing.credits
              ? item.selectedPricing.credits
              : null,
          // this is only for Single Company Unlock and VPD Unlock
          companyUnlockCredits:
            (item.serviceType === 'companyUnlock' ||
              item.serviceType === 'vpdUnlock') &&
            item.selectedPricing.credits
              ? item.selectedPricing.credits
              : null,
          // this is only for Single Company Unlock and VPD Unlock
          companyId:
            (item.serviceType === 'companyUnlock' ||
              item.serviceType === 'vpdUnlock') &&
            item.customAttributes?.companyId
              ? item.customAttributes.companyId
              : null,
          // this is only for Single Company Unlock and VPD Unlock
          companyName:
            (item.serviceType === 'companyUnlock' ||
              item.serviceType === 'vpdUnlock') &&
            item.customAttributes?.companyName
              ? item.customAttributes.companyName
              : null,
        },
      })),
      currency: cartItems[0]?.currency,
      // total exc. gst (after all discount / promo)
      value: total - gst,
      // gst after all discount / promo
      gst: gst,
      coupon: promoInfo
        ? {
            code: promoInfo?.code,
            type: promoInfo?.type,
            value: promoInfo?.value,
          }
        : null,
      discount_amount: promoInfo?.discount || 0,
      // returnUrl: `${BASE_URL_FRONTEND}${createSuccessUrl(cartItems)}`,
      returnUrl: `${BASE_URL_FRONTEND}/checkout/success`,
    };

    const response = await axios.post(
      `${BASE_URL_BACKEND}/api/v1/orders/create-order`,
      orderData
    );
    return response.data;
  };

  // PAYMENT: STEP 2
  const mutation = useMutation<any, Error, void>({
    mutationFn: createOrder,
    onMutate: () => {
      toast.loading('Creating order...');
    },
    onSuccess: (data) => {
      toast.dismiss();
      toast.success('Order created successfully. Proceeding to payment...');
      setOrderId(data.data.order_id);
      doPayment(data);
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to create order. Please try again.');
      console.error('Error creating order:', error);
    },
  });

  // PAYMENT: STEP 1
  const handlePlaceOrder = () => {
    if (!isValid) {
      toast.error(
        'Please fill in all required information before placing the order.'
      );
      return;
    }

    mutation.mutate();
  };

  return (
    <div className='space-y-4'>
      {errorMessage && (
        <p className='flex items-center gap-1.5 rounded text-[10px] text-destructive md:text-xs'>
          <AlertCircleIcon className='size-3 md:size-4' />
          {errorMessage}
        </p>
      )}
      <Button
        className='w-full'
        size='lg'
        onClick={handlePlaceOrder}
        disabled={!isValid || isVerifying}
        ref={payButtonRef}
      >
        {isVerifying ? 'Verifying Payment...' : 'Place Order'}
      </Button>

      {isVerifying && (
        <div className='pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center space-y-4 bg-white bg-opacity-80 backdrop-blur'>
          <div className='loader-spinner-custom'>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <p className='text-lg text-muted-foreground'>
            We&apos;re almost there!
          </p>

          <div className='mt-6 text-center'>
            <p className='text-base text-muted-foreground'>
              Redirecting you to your dashboard soon...
            </p>
            <p className='mt-1 animate-pulse text-sm text-muted-foreground'>
              This may take a few moments. <br className='md:hidden' /> Thanks
              for your patience!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentButton;
