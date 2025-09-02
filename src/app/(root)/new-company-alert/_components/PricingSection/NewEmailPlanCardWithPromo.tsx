/* eslint-disable camelcase */
'use client';

import { Button } from '@/components/ui/button';
import { useNCACampaignStatus } from '@/hooks/useNcaCampaign';
import { formatPriceWithCommas } from '@/lib/utils';
import { sendGTMEvent } from '@next/third-parties/google';
import { FC, useEffect, useRef, useState } from 'react';
import { RiCheckFill } from 'react-icons/ri';
import 'react-phone-input-2/lib/style.css';
import { ICompanyAlertPlan, IZonalPricing } from '../../_utils/types';

interface PricingCardProps {
  emailPlan: ICompanyAlertPlan;
  duration: 'monthly' | 'quarterly' | 'annually' | 'trial';
  handleBuyNow: (
    // eslint-disable-next-line no-unused-vars
    plan: ICompanyAlertPlan,
    // eslint-disable-next-line no-unused-vars
    duration: 'monthly' | 'quarterly' | 'annually' | 'trial',
    // eslint-disable-next-line no-unused-vars
    price: number | undefined,
    // eslint-disable-next-line no-unused-vars
    discountedPrice: number | undefined,
    // eslint-disable-next-line no-unused-vars
    selectedDuration?: IZonalPricing[]
  ) => void;
}

const NewEmailPlanCardWithPromo: FC<PricingCardProps> = ({
  emailPlan,
  duration,
  handleBuyNow,
}) => {
  const { isActive, discount } = useNCACampaignStatus();
  const [price, setPrice] = useState<number>();
  const [discountedPrice, setDiscountedPrice] = useState<number>();

  const allZones =
    emailPlan?.zonalPricing &&
    emailPlan?.zonalPricing.find((zone) => zone.zone === 'All');
  const trialPrice = allZones ? allZones.trial : 199;

  useEffect(() => {
    const multiplier = isActive ? 1 - discount / 100 : 1;

    if (emailPlan.pricingPlan) {
      if (duration === 'monthly') {
        const monthlyPrice = Math.round(
          emailPlan.pricingPlan.baseMonthly * multiplier
        );
        setPrice(emailPlan.pricingPlan.baseMonthly);
        setDiscountedPrice(isActive ? monthlyPrice : undefined);
      } else if (duration === 'quarterly') {
        const quarterlyPrice = Math.round(
          emailPlan.pricingPlan.baseQuarterly * multiplier
        );
        setPrice(emailPlan.pricingPlan.baseQuarterly);
        setDiscountedPrice(isActive ? quarterlyPrice : undefined);
      } else if (duration === 'annually') {
        const annuallyPrice = Math.round(
          emailPlan.pricingPlan.baseAnnually * multiplier
        );
        setPrice(emailPlan.pricingPlan.baseAnnually);
        setDiscountedPrice(isActive ? annuallyPrice : undefined);
      }
    }
  }, [emailPlan, duration, isActive, discount]);

  const eventSent = useRef(false); // Ref to track if the event has been sent
  useEffect(() => {
    if (!eventSent.current && emailPlan && price && discountedPrice) {
      eventSent.current = true;
      sendGTMEvent({
        event: 'view_item',
        ecommerce: {
          value: discountedPrice,
          currency: 'INR',
          items: [
            {
              item_id: emailPlan._id,
              item_name: emailPlan.name,
              price: discountedPrice,
              quantity: 1,
            },
          ],
        },
      });
    }
  }, [emailPlan, price, discountedPrice]);

  return (
    <div className='w-full'>
      {isActive && (
        <p className='flex w-24 items-start justify-center whitespace-nowrap rounded-full border border-nca-primary-blue bg-nca-primary-blue-transparent py-0.5 text-xs font-semibold text-nca-secondary-blue md:text-sm lg:mb-2'>
          Save {discount}%
        </p>
      )}
      <div className='flex w-full flex-col items-start justify-between gap-5 lg:flex-row lg:gap-10'>
        <div className='flex w-full items-center justify-between lg:w-auto'>
          <div className='flex flex-col lg:min-w-72 lg:max-w-72'>
            <p className='text-xl font-semibold md:text-2xl lg:text-3xl'>
              Email Plan
            </p>
            <p className='mt-1 text-xs font-light md:text-sm'>
              For those looking for just email data!
            </p>
          </div>
          <h6 className='flex flex-col flex-wrap items-end justify-end gap-2 text-end text-lg font-bold md:mt-4 md:text-2xl lg:mt-3 lg:hidden'>
            <span className='flex flex-col'>
              {isActive && (
                <span className='whitespace-nowrap text-xs text-nca-primary-red line-through lg:text-lg'>
                  ₹ {formatPriceWithCommas(price)}{' '}
                </span>
              )}
              <span className='whitespace-nowrap'>
                ₹{' '}
                {isActive && discountedPrice
                  ? formatPriceWithCommas(discountedPrice)
                  : formatPriceWithCommas(price)}
              </span>
            </span>

            {isActive && price && discountedPrice && (
              <span className='whitespace-nowrap text-xs font-semibold md:text-sm'>
                (save{' '}
                <span className='text-sm text-nca-primary-blue'>
                  ₹ {formatPriceWithCommas(Math.ceil(price - discountedPrice))}
                </span>
                )
              </span>
            )}
          </h6>
        </div>
        <div className='flex w-full flex-col items-start justify-between gap-4 lg:flex-row'>
          <InclusionsExclusions inclusions={emailPlan.features} />
          <div className='flex w-full flex-col lg:hidden'>
            <Button
              variant='gooeyLeft'
              className='mt-4 h-8 w-full bg-nca-primary-blue font-medium text-white shadow-md hover:text-white md:mt-6  lg:w-52'
              onClick={() =>
                handleBuyNow(emailPlan, duration, price, discountedPrice)
              }
            >
              Buy Now
            </Button>

            <Button
              variant='gooeyLeft'
              className='mt-2 h-8 w-full border border-nca-primary-blue bg-transparent font-medium text-nca-primary-blue hover:bg-primary/5 hover:text-nca-primary-blue lg:w-52'
              onClick={() =>
                handleBuyNow(emailPlan, 'trial', trialPrice, trialPrice)
              }
            >
              Start 3 Day Trial @ ₹ {formatPriceWithCommas(trialPrice)}
            </Button>
          </div>
          <div className='hidden flex-col justify-end lg:flex'>
            <h6 className='mt-3 flex flex-col flex-wrap items-end justify-end gap-2 text-end text-lg font-bold md:mt-4 md:text-2xl'>
              <span className='flex items-end gap-2.5'>
                {isActive && (
                  <span className='whitespace-nowrap text-base text-nca-primary-red line-through md:text-lg'>
                    ₹ {formatPriceWithCommas(price)}{' '}
                  </span>
                )}
                <span className='whitespace-nowrap'>
                  ₹{' '}
                  {isActive && discountedPrice
                    ? formatPriceWithCommas(discountedPrice)
                    : formatPriceWithCommas(price)}
                </span>
              </span>

              {isActive && price && discountedPrice && (
                <span className='whitespace-nowrap text-xs font-semibold md:text-sm'>
                  (You save{' '}
                  <span className='text-sm text-nca-primary-blue'>
                    ₹{' '}
                    {formatPriceWithCommas(Math.ceil(price - discountedPrice))}
                  </span>
                  )
                </span>
              )}
            </h6>
            <Button
              variant='gooeyLeft'
              className='mt-4 h-8 w-full bg-nca-primary-blue font-medium text-white shadow-md hover:text-white md:mt-6  md:w-52'
              onClick={() =>
                handleBuyNow(emailPlan, duration, price, discountedPrice)
              }
            >
              Buy Now
            </Button>

            <Button
              variant='gooeyLeft'
              className='mt-2 h-8 w-full border border-nca-primary-blue bg-transparent font-medium text-nca-primary-blue hover:bg-primary/5 hover:text-nca-primary-blue md:w-52'
              onClick={() =>
                handleBuyNow(emailPlan, 'trial', trialPrice, trialPrice)
              }
            >
              Start 3 Day Trial @ ₹ {formatPriceWithCommas(trialPrice)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InclusionsExclusions: FC<{
  inclusions: string[];
}> = ({ inclusions }) => (
  <div>
    <p className='text-xs font-semibold md:text-sm'>What&apos;s included:</p>
    <div className='flex flex-col gap-2 lg:flex-row lg:gap-4'>
      <ul className='mt-3 space-y-4 text-xs md:mt-4 md:text-sm'>
        {inclusions
          .slice(0, Math.ceil(inclusions.length / 2))
          .map((inclusion, idx) => (
            <li key={idx} className='flex items-center gap-2'>
              <RiCheckFill className='min-w-4 rounded-full border border-nca-secondary-blue p-0.5 text-base text-nca-secondary-blue' />
              <span
                className={`${
                  [
                    'Daily Email + Phone Contacts',
                    'Mobile Number of ALL Directors',
                  ].includes(inclusion)
                    ? 'font-medium text-nca-secondary-blue'
                    : ''
                }`}
              >
                {inclusion}
              </span>
            </li>
          ))}
      </ul>
      <ul className='mt-3 space-y-4 text-xs md:mt-4 md:text-sm'>
        {inclusions
          .slice(Math.ceil(inclusions.length / 2))
          .map((inclusion, idx) => (
            <li key={idx} className='flex items-center gap-2'>
              <RiCheckFill className='min-w-4 rounded-full border border-nca-secondary-blue p-0.5 text-base text-nca-secondary-blue' />
              {inclusion}
            </li>
          ))}
      </ul>
    </div>
  </div>
);

export default NewEmailPlanCardWithPromo;
