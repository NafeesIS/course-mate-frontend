/* eslint-disable camelcase */
'use client';

import { usePricingStore } from '@/store/pricingStore';
import { TServiceCatalog } from '@/types/ServiceCatalogTypes';
import { unlockDirectorContactPlans } from '../_data/data';
import BulkPricingCard from './BulkPricingCard';
import PricingCard from './PricingCard';

export default function PricingSection() {
  const { serviceCatalogFromDB } = usePricingStore();

  const currency = serviceCatalogFromDB
    ? serviceCatalogFromDB?.currency
    : 'INR';
  const directorUnlockCatalog = serviceCatalogFromDB?.serviceCatalog.find(
    (service: TServiceCatalog) => service.serviceType === 'directorUnlock'
  );
  const singleDirectorUnlockPrice = directorUnlockCatalog?.directorUnlockPricing
    ? directorUnlockCatalog?.directorUnlockPricing.singleUnlock.price
    : '';

  return (
    <section
      id='pricing-section'
      className='relative w-full overflow-hidden bg-gradient-to-b from-purple-50 via-white to-blue-50 py-12 md:py-16'
    >
      <div className='absolute inset-0 z-0'>
        <svg
          className='h-full w-full opacity-10'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 1000 1000'
          preserveAspectRatio='none'
        >
          <defs>
            <pattern
              id='grid'
              width='40'
              height='40'
              patternUnits='userSpaceOnUse'
            >
              <path
                d='M 40 0 L 0 0 0 40'
                fill='none'
                stroke='#ccc'
                strokeWidth='1'
              />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#grid)' />
        </svg>
      </div>
      <div className='wrapper relative z-10 px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <h2 className='bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent md:text-4xl lg:h-14 lg:text-5xl'>
            Choose Your Package
          </h2>
          <p className='max-w-lg text-sm text-gray-600 dark:text-gray-400 lg:text-lg'>
            Select the plan that best fits your needs. Unlock valuable director
            information with our flexible pricing options.
          </p>
        </div>
        <div className='mt-12 grid items-center gap-8 md:grid-cols-3 md:gap-4 lg:gap-8'>
          <PricingCard
            plan={unlockDirectorContactPlans.singleUnlock}
            pricingData={
              directorUnlockCatalog?.directorUnlockPricing?.singleUnlock
            }
            currency={currency}
          />
          <BulkPricingCard
            plan={unlockDirectorContactPlans.bulkUnlock}
            pricingData={
              directorUnlockCatalog?.directorUnlockPricing?.bulkUnlock
            }
            serviceId={directorUnlockCatalog?._id}
            serviceType={directorUnlockCatalog?.serviceType}
            basePrice={singleDirectorUnlockPrice || 0}
            currency={currency}
            highlighted={true}
          />
          <PricingCard plan={unlockDirectorContactPlans.enterprise} />
        </div>
      </div>
    </section>
  );
}
