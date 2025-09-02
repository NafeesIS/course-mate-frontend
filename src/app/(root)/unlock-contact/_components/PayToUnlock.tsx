/* eslint-disable camelcase */
'use client';

import { Button } from '@/components/ui/button';
import { RAZORPAY_KEY_ID } from '@/constants';
import { TPricingStore, usePricingStore } from '@/store/pricingStore';
import { useUserSignInDetails } from '@/store/userStore';
import { TServiceCatalog } from '@/types/ServiceCatalogTypes';
import { sendGTMEvent } from '@next/third-parties/google';
import { FaUserLock } from 'react-icons/fa6';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'sonner';
import { createOrder } from '../_services/getContactData';

const PayToUnlock = ({
  din,
  setPaymentDetails,
  isDataAvailable,
  // eslint-disable-next-line no-unused-vars
  dataFetchError,
  setDataFetchError,
}: {
  din?: string;
  // eslint-disable-next-line no-unused-vars
  setPaymentDetails: (paymentDetails: any) => void;
  isDataAvailable: boolean;
  dataFetchError: string | null;
  // eslint-disable-next-line no-unused-vars
  setDataFetchError: (dataFetchError: string | null) => void;
}) => {
  const {
    serviceCatalogFromDB,
    serviceCatalogFromDBPending,
    serviceCatalogFromDBError,
  }: TPricingStore = usePricingStore();

  const { userSignInDetails } = useUserSignInDetails();

  const currency = serviceCatalogFromDB ? serviceCatalogFromDB?.currency : '';
  const directorUnlockCatalog = serviceCatalogFromDB?.serviceCatalog.find(
    (service: TServiceCatalog) => service.serviceType === 'directorUnlock'
  );
  const singleDirectorUnlockPrice = directorUnlockCatalog?.directorUnlockPricing
    ? directorUnlockCatalog?.directorUnlockPricing.singleUnlock.price
    : '';

  const onSubmit = async () => {
    if (!din) {
      setDataFetchError('DIN cannot be empty');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!isDataAvailable) {
      toast.info('Contact data is not available for this DIN.');
      return;
    }
    if (serviceCatalogFromDBError || !serviceCatalogFromDB) {
      toast.error(
        'Pricing information is not available. Please try again later.'
      );
      return;
    }

    // ecommerce add_to_cart event
    sendGTMEvent({
      event: 'add_to_cart',
      ecommerce: {
        currency: currency,
        value: singleDirectorUnlockPrice,
        items: [
          {
            item_name: 'Unlock Director Contact',
            price: singleDirectorUnlockPrice,
            quantity: 1,
            currency: currency,
            service_id: din,
          },
        ],
      },
    });

    const orderData = await createOrder(
      din,
      currency,
      singleDirectorUnlockPrice
    );
    if (orderData && orderData?.data) {
      openRazorpay(orderData.data);
    } else {
      alert('Failed to create order. Please try again.');
    }
  };

  const openRazorpay = async (orderData: any) => {
    if (serviceCatalogFromDBError || !serviceCatalogFromDB) {
      toast.error(
        'Pricing information is not available. Please try again later.'
      );
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: orderData.amount, // Amount in paise
      currency: orderData.currency,
      image: 'https://i.ibb.co/Mc2N8px/filesure-logo.png',
      name: 'FileSure',
      description: orderData.description,
      order_id: orderData.id,
      notes: {
        din: din,
      },
      prefill: {
        name: `${userSignInDetails?.data?.meta_data?.firstName || ''} ${
          userSignInDetails?.data?.meta_data?.lastName || ''
        }`,
        email: userSignInDetails?.data?.emails[0] || '',
        contact: userSignInDetails?.data?.meta_data?.mobileNumber || '',
      },
      handler: async function (response: any) {
        // Handle successful payment (e.g., update your database)
        setPaymentDetails(response);

        // Send purchase event to GTM
        if (response.razorpay_payment_id) {
          // ecommerce purchase event
          sendGTMEvent({
            event: 'purchase',
            ecommerce: {
              transaction_id: response.razorpay_payment_id,
              currency: currency,
              value: singleDirectorUnlockPrice,
              items: [
                {
                  item_name: 'Unlock Director Contact',
                  price: singleDirectorUnlockPrice,
                  quantity: 1,
                  currency: currency,
                  service_id: din,
                },
              ],
            },
          });
          // custom event: facebook ads conversion
          sendGTMEvent({
            event:
              'FB_CONVERSIONS_API-813169337591676-Web-Trigger-Custom_Event',
            'eventModel.transaction_id': response.razorpay_payment_id,
            'eventModel.currency': currency,
            'eventModel.value': singleDirectorUnlockPrice,
            'eventModel.items': [
              {
                item_name: 'Payment for unlocking contact',
                price: singleDirectorUnlockPrice,
                quantity: 1,
                currency: currency,
              },
            ],
          });
        }
      },
      theme: {
        color: '#0074cc', // Customize the color of the Razorpay checkout
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  return (
    <Button
      type='submit'
      variant='gooeyLeft'
      className='w-full rounded-md bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-sm text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 hover:shadow-xl '
      disabled={serviceCatalogFromDBPending || !serviceCatalogFromDB}
      onClick={() => onSubmit()}
    >
      {serviceCatalogFromDBPending || !serviceCatalogFromDB ? (
        'Loading...'
      ) : (
        <>
          <FaUserLock className='mr-2 size-5' />
          <span className='font-semibold'>Get Contact Details</span>
          <span className='ml-1 opacity-90'>
            - Only {currency === 'INR' ? '₹' : '$'}
            {singleDirectorUnlockPrice}
          </span>
        </>
      )}
    </Button>
  );
};

export default PayToUnlock;
