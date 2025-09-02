/* eslint-disable camelcase */
'use client';

import { usePricingStore } from '@/store/pricingStore';
import { sendGTMEvent } from '@next/third-parties/google';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RiAlertLine } from 'react-icons/ri';
import DirectorContactInfo from './DirectorContactInfo';

const UnlockContactMainSections = () => {
  const searchParams = useSearchParams();
  const din = searchParams.get('din') || '';
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const [dataFetchError, setDataFetchError] = useState<string | null>(null);
  const { serviceCatalogFromDB } = usePricingStore();

  const currency = serviceCatalogFromDB ? serviceCatalogFromDB?.currency : '';
  const directorUnlockCatalog = serviceCatalogFromDB?.serviceCatalog.find(
    (service) => service.serviceType === 'directorUnlock'
  );
  const singleDirectorUnlockPrice = directorUnlockCatalog?.directorUnlockPricing
    ? directorUnlockCatalog?.directorUnlockPricing.singleUnlock.price
    : '';

  useEffect(() => {
    if (
      din &&
      din.length > 0 &&
      serviceCatalogFromDB &&
      directorUnlockCatalog
    ) {
      sendGTMEvent({
        event: 'view_item',
        ecommerce: {
          currency: currency,
          value: singleDirectorUnlockPrice,
          items: [
            {
              item_id: din,
              item_name: 'Unlock Director Contact',
              price: singleDirectorUnlockPrice,
            },
          ],
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [din, serviceCatalogFromDB, directorUnlockCatalog]);

  return (
    <>
      {din && dataFetchError && !dataFetchError.includes('Coupon') && (
        <p className='flex-center mx-auto mb-4 w-fit gap-2 rounded-md bg-muted px-4 py-2 text-sm font-medium text-red-500 md:text-base'>
          <RiAlertLine />
          {dataFetchError}
        </p>
      )}

      <section className='wrapper'>
        <DirectorContactInfo
          din={din}
          paymentDetails={paymentDetails}
          setPaymentDetails={setPaymentDetails}
          setIsDataAvailable={setIsDataAvailable}
          dataFetchError={dataFetchError}
          setDataFetchError={setDataFetchError}
          isDataAvailable={isDataAvailable}
        />
      </section>
    </>
  );
};

export default UnlockContactMainSections;
