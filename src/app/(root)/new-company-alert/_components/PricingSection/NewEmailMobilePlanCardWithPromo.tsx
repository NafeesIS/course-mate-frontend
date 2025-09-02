/* eslint-disable camelcase */
'use client';

/* eslint-disable indent */
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNCACampaignStatus } from '@/hooks/useNcaCampaign';
import { formatPriceWithCommas } from '@/lib/utils';
import { sendGTMEvent } from '@next/third-parties/google';
import { FC, useEffect, useRef, useState } from 'react';
import { RiArrowDownSLine, RiCheckFill, RiCloseLine } from 'react-icons/ri';
import 'react-phone-input-2/lib/style.css';
import { ICompanyAlertPlan, IZonalPricing } from '../../_utils/types';
import ZoneInfoTooltip from './ZoneInfoTooltip';

interface PricingCardProps {
  emailMobilePlan: ICompanyAlertPlan;
  duration: 'monthly' | 'quarterly' | 'annually' | 'trial';
  selectedZones?: IZonalPricing[];
  // eslint-disable-next-line no-unused-vars
  handleZoneSelect?: (zone: IZonalPricing) => void;
  // eslint-disable-next-line no-unused-vars
  handleZoneRemove?: (zone: IZonalPricing) => void;
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
    selectedZones?: IZonalPricing[]
  ) => void;
}

const NewEmailMobilePlanCardWithPromo: FC<PricingCardProps> = ({
  emailMobilePlan,
  duration,
  selectedZones,
  handleZoneSelect,
  handleZoneRemove,
  handleBuyNow,
}) => {
  const { isActive, discountEmailMobile } = useNCACampaignStatus();
  const [price, setPrice] = useState<number>();
  const [totalCompanies, setTotalCompanies] = useState<number>();
  const [discountedPrice, setDiscountedPrice] = useState<number>();

  const allZones =
    emailMobilePlan?.zonalPricing &&
    emailMobilePlan?.zonalPricing.find((zone) => zone.zone === 'All');
  const trialPrice = allZones ? allZones.trial : 999;

  useEffect(() => {
    let totalPrice: number = 0;
    const multiplier = isActive ? 1 - discountEmailMobile / 100 : 1;

    if (duration === 'monthly') {
      totalPrice =
        selectedZones?.reduce((acc, curr) => {
          return acc + curr.monthly;
        }, 0) || 0;
      const monthlyPrice = Math.round(totalPrice * multiplier);
      setPrice(totalPrice);
      setDiscountedPrice(isActive ? monthlyPrice : undefined);
    } else if (duration === 'quarterly') {
      totalPrice =
        selectedZones?.reduce((acc, curr) => {
          return acc + curr.quarterly;
        }, 0) || 0;
      const quarterlyPrice = Math.round(totalPrice * multiplier);
      setPrice(totalPrice);
      setDiscountedPrice(isActive ? quarterlyPrice : undefined);
    } else if (duration === 'annually') {
      totalPrice =
        selectedZones?.reduce((acc, curr) => {
          return acc + curr.annually;
        }, 0) || 0;
      const annuallyPrice = Math.round(totalPrice * multiplier);
      setPrice(totalPrice);
      setDiscountedPrice(isActive ? annuallyPrice : undefined);
    }

    setTotalCompanies(
      selectedZones?.reduce((acc, curr) => acc + curr.approxCompanies, 0) || 0
    );
  }, [
    duration,
    selectedZones,
    emailMobilePlan.zonalPricing,
    isActive,
    discountEmailMobile,
  ]);

  const eventSent = useRef(false); // Ref to track if the event has been sent
  useEffect(() => {
    if (!eventSent.current && emailMobilePlan && price && discountedPrice) {
      eventSent.current = true;
      sendGTMEvent({
        event: 'view_item',
        ecommerce: {
          value: discountedPrice,
          currency: 'INR',
          items: [
            {
              item_id: emailMobilePlan._id,
              item_name: emailMobilePlan.name,
              price: discountedPrice,
              quantity: 1,
            },
          ],
        },
      });
    }
  }, [emailMobilePlan, price, discountedPrice]);
  const latestFeatures = [
    'Daily Email + Phone Contacts',
    'Mobile Number of ALL Directors',
    'Email ID of ALL Directors',
    'Email ID of Company',
    'Full Company Address with Pin code',
    'Company name and CIN',
    'Director names and DIN',
    'Companies and LLPs both',
    'Date of Incorporation',
    'Company Class & Type',
    'Authorised & Paid Up Capital',
    'Nature of Business',
  ];

  return (
    <div className='w-full'>
      <div className='flex items-center justify-start gap-3'>
        {isActive && (
          <p className='flex w-24 items-start justify-center whitespace-nowrap rounded-full border border-nca-primary-orange bg-nca-primary-orange-transparent py-0.5 text-xs font-semibold text-nca-primary-orange lg:mb-2 lg:text-sm'>
            Save {discountEmailMobile}%
          </p>
        )}
        <p className='flex w-24 items-start justify-center whitespace-nowrap rounded-full border border-nca-primary-blue bg-nca-primary-blue-transparent py-0.5 text-xs font-semibold text-nca-primary-blue lg:mb-2 lg:text-sm'>
          Popular
        </p>
      </div>
      <div className='flex w-full flex-col items-start justify-between gap-5 lg:flex-row lg:gap-10'>
        <div className='lg:min-w-72 lg:max-w-72'>
          <div className='flex w-full items-center justify-between gap-2 lg:w-auto'>
            <div className='flex flex-col'>
              <p className='text-xl font-semibold md:text-2xl lg:text-3xl'>
                Email and Phone
              </p>
              <p className='mt-1 text-xs font-light md:text-sm'>
                If you are not selling in pan India go for zonal pricing for
                targeted outreach.
              </p>
            </div>
            <h6 className='mt-3 flex flex-col flex-wrap items-end justify-end gap-2 text-end text-lg font-bold md:mt-4 md:text-2xl lg:hidden'>
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
                    ₹{' '}
                    {formatPriceWithCommas(Math.ceil(price - discountedPrice))}
                  </span>
                  )
                </span>
              )}
            </h6>
          </div>
          {emailMobilePlan && handleZoneSelect && handleZoneRemove && (
            <StateSelection
              zones={emailMobilePlan.zonalPricing || []}
              selectedZones={selectedZones || []}
              handleZoneSelect={handleZoneSelect}
              handleZoneRemove={handleZoneRemove}
              totalCompanyCount={totalCompanies || 0}
              duration={duration}
            />
          )}
        </div>
        <div className='w-full'>
          <div className='flex w-full flex-col items-start justify-between gap-4 lg:flex-row'>
            <InclusionsExclusions inclusions={latestFeatures} />
            <div className='flex w-full flex-col lg:hidden'>
              <Button
                variant='gooeyLeft'
                className='mt-4 h-8 w-full bg-nca-primary-blue font-medium text-white shadow-md hover:text-white md:mt-6 md:h-10 lg:w-52'
                onClick={() =>
                  handleBuyNow(
                    emailMobilePlan,
                    duration,
                    price || 0,
                    discountedPrice,
                    selectedZones
                  )
                }
              >
                Buy Now
              </Button>

              <Button
                variant='gooeyLeft'
                className='mt-2 h-8 w-full border border-nca-primary-blue bg-transparent font-medium text-nca-primary-blue hover:bg-primary/5 hover:text-nca-primary-blue lg:w-52'
                onClick={() =>
                  handleBuyNow(emailMobilePlan, 'trial', trialPrice, trialPrice)
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
                      {formatPriceWithCommas(
                        Math.ceil(price - discountedPrice)
                      )}
                    </span>
                    )
                  </span>
                )}
              </h6>
              <Button
                variant='gooeyLeft'
                className='mt-4 h-8 w-full bg-nca-primary-blue font-medium text-white shadow-md hover:text-white md:mt-6  md:w-52'
                onClick={() =>
                  handleBuyNow(
                    emailMobilePlan,
                    duration,
                    price || 0,
                    discountedPrice,
                    selectedZones
                  )
                }
              >
                Buy Now
              </Button>

              <Button
                variant='gooeyLeft'
                className='mt-2 h-8 w-full border border-nca-primary-blue bg-transparent font-medium text-nca-primary-blue hover:bg-primary/5 hover:text-nca-primary-blue md:w-52'
                onClick={() =>
                  handleBuyNow(emailMobilePlan, 'trial', trialPrice, trialPrice)
                }
              >
                Start 3 Day Trial @ ₹ {formatPriceWithCommas(trialPrice)}
              </Button>
            </div>
          </div>
          <Separator className='my-4 hidden h-[1px] bg-nca-secondary-blue lg:block' />
          <div className='hidden grid-cols-2 gap-8 font-light lg:grid'>
            <div className='text-xs md:text-sm'>
              <p className='mb-1 font-semibold'>West</p>
              <p className='text-nca-paragraph-text'>
                Maharashtra, Pune, Gujarat, Madhya Pradesh, Goa, Dadra and Nagar
                Haveli, Daman and Diu
              </p>
            </div>
            <div className='text-xs md:text-sm'>
              <p className='mb-1 font-semibold'>East</p>
              <p className='text-nca-paragraph-text'>
                West Bengal, Bihar, Odisha, Jharkhand, Assam, Assam Guwahati,
                Chhattisgarh, Manipur, Tripura, Arunachal Pradesh, Nagaland,
                Meghalaya, Andaman and Nicobar Islands, Mizoram, Sikkim
              </p>
            </div>
            <div className='text-xs md:text-sm'>
              <p className='mb-1 font-semibold'>North</p>
              <p className='text-nca-paragraph-text'>
                Uttar Pradesh, Delhi, Haryana, Rajasthan, Punjab, Uttarakhand,
                Jammu and Kashmir, Himachal Pradesh, Chandigarh
              </p>
            </div>
            <div className='text-xs md:text-sm'>
              <p className='mb-1 font-semibold'>South</p>
              <p className='text-nca-paragraph-text'>
                Karnataka, Telangana, Tamil Nadu, Kerala, Andhra Pradesh,
                Puducherry, Lakshadweep
              </p>
            </div>
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

const StateSelection: FC<{
  zones: IZonalPricing[];
  selectedZones: IZonalPricing[];
  // eslint-disable-next-line no-unused-vars
  handleZoneSelect: (state: IZonalPricing) => void;
  // eslint-disable-next-line no-unused-vars
  handleZoneRemove: (state: IZonalPricing) => void;
  totalCompanyCount: number;
  duration: 'monthly' | 'quarterly' | 'annually' | 'trial';
}> = ({
  zones,
  selectedZones,
  handleZoneSelect,
  handleZoneRemove,
  totalCompanyCount,
  // duration,
}) => {
  const sortedZones = [...zones].sort((a, b) => {
    const order = ['All', 'West', 'East', 'North', 'South'];
    return order.indexOf(a.zone) - order.indexOf(b.zone);
  });
  const [DropdownOpen, setDropdownOpen] = useState(true);

  return (
    <div className='mt-4 md:mt-6'>
      <Button
        variant='outline'
        className='flex h-8 w-full justify-between gap-2 border border-nca-secondary-blue bg-muted px-2 text-xs text-muted-foreground md:h-9 md:text-sm'
        onClick={() => setDropdownOpen((prev) => !prev)}
      >
        <div className='flex flex-wrap gap-2'>
          {selectedZones?.map((zone, idx) => (
            <div
              key={idx}
              className='inline-flex items-center gap-2 rounded-md border border-nca-primary-blue bg-nca-primary-blue-transparent pl-2.5 pr-2 pt-[1px] text-xs font-semibold text-nca-primary-blue'
            >
              {zone.zone !== 'All'} {zone.zone} {zone.zone === 'All'}
              <RiCloseLine
                title='remove zone'
                className='cursor-pointer'
                onClick={() => handleZoneRemove(zone)}
              />
            </div>
          ))}
        </div>
        <RiArrowDownSLine
          className={`${DropdownOpen ? 'duration-300' : 'rotate-180 duration-300'}`}
        />
      </Button>

      <div className='mb-2 mt-2 flex items-center justify-center gap-2 rounded-md border border-nca-primary-orange bg-nca-primary-orange-transparent p-1.5 text-xs font-medium text-foreground text-nca-primary-orange md:text-sm'>
        Approx. companies per month{' '}
        <span className='rounded-full bg-nca-primary-orange px-2.5 py-1 text-white'>
          {totalCompanyCount || 0}
        </span>
      </div>
      {DropdownOpen && (
        <div className='w-full rounded-lg bg-white p-4 shadow'>
          {sortedZones.map((zone: IZonalPricing, idx: number) => (
            <div
              key={idx}
              className='mb-2 flex w-full cursor-pointer items-center justify-between gap-4 pl-2 pr-4 hover:bg-muted'
            >
              <div
                onClick={() => handleZoneSelect(zone)}
                className='flex w-1/2 items-center gap-2'
              >
                <Checkbox
                  checked={selectedZones?.some((s) => s.zone === zone.zone)}
                  onChange={() => handleZoneSelect(zone)}
                />
                <p className='flex items-center gap-1.5 whitespace-nowrap text-xs md:text-sm'>
                  {zone.zone !== 'All' && 'India'} {zone.zone}{' '}
                </p>
              </div>
              <ZoneInfoTooltip zoneName={zone.zone} />
              <p className='ml-auto w-full text-right text-xs text-muted-foreground'>
                {zone.approxCompanies}
              </p>
            </div>
          ))}
        </div>
      )}
      <p className='mt-2 text-xs text-muted-foreground'>
        * Price will vary on different zones selected.
      </p>
    </div>
  );
};

// Custom Checkbox component
const Checkbox = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <div
    className={`mr-2 flex h-4 w-4 flex-shrink-0 items-center justify-center whitespace-nowrap rounded border ${
      checked ? 'border-primary bg-primary' : 'border-input'
    }`}
    onClick={onChange}
  >
    {checked && (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='h-3 w-3 text-primary-foreground'
      >
        <polyline points='20 6 9 17 4 12'></polyline>
      </svg>
    )}
  </div>
);

export default NewEmailMobilePlanCardWithPromo;
