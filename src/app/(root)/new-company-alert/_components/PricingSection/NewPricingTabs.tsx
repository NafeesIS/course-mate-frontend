'use client';

import { ICompanyAlertPlan } from '@/app/(root)/new-company-alert/_utils/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import DiamondImg from '../../../../../../public/assets/new-company-alert/diamond.png';
import PricingCards from './NewPricingCards';

export function NewPricingTabs({ plans }: { plans: ICompanyAlertPlan[] }) {
  return (
    <>
      <Tabs
        defaultValue='monthly'
        className='flex-col-center mt-4 w-full gap-4 md:mt-6 md:gap-8'
      >
        <TabsList className='mx-auto mb-6 h-10 w-fit flex-row justify-center gap-1.5 rounded-full  border border-nca-secondary-blue bg-transparent font-semibold sm:gap-3 sm:p-1'>
          <TabsTrigger
            value='monthly'
            className='rounded-full px-4 py-1.5 text-xs text-black data-[state=active]:bg-nca-primary-blue-transparent data-[state=active]:text-nca-secondary-blue md:text-sm'
          >
            1 month
          </TabsTrigger>

          <TabsTrigger
            value='quarterly'
            className='relative rounded-full py-1.5 text-xs text-black data-[state=active]:bg-nca-primary-blue-transparent data-[state=active]:text-nca-secondary-blue md:text-sm'
          >
            <span className='flex-center gap-2'>
              <Image
                src={DiamondImg}
                alt='diamond'
                width={20}
                height={20}
                className='inline-block h-4 w-4 md:h-5 md:w-5'
              />
              <span>3 months </span>
              <span className='hidden  flex-shrink-0 rounded-full border border-primary bg-gradient-to-tr from-[#B6DEFF1A] via-[#B6DEFF4D] to-[#B6DEFF80] px-2.5 py-0.5 text-[10px] text-primary sm:inline sm:text-xs'>
                Popular
              </span>
            </span>
          </TabsTrigger>

          <TabsTrigger
            value='annually'
            className='rounded-full py-1.5 text-xs text-black data-[state=active]:bg-nca-primary-blue-transparent data-[state=active]:text-nca-secondary-blue md:text-sm'
          >
            <span className='flex-center gap-2'>
              <span>Annually</span>{' '}
              {/* <span className='hidden flex-shrink-0 rounded-full border border-primary bg-muted px-2.5 py-0.5 text-xs text-primary sm:inline'>
                15% OFF
              </span> */}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent className='w-full max-w-xl lg:max-w-full' value='monthly'>
          <PricingCards duration='monthly' plans={plans} />
        </TabsContent>

        <TabsContent
          className='w-full max-w-xl lg:max-w-full'
          value='quarterly'
        >
          <PricingCards duration='quarterly' plans={plans} />
        </TabsContent>

        <TabsContent className='w-full max-w-xl lg:max-w-full' value='annually'>
          <PricingCards duration='annually' plans={plans} />
        </TabsContent>
      </Tabs>
    </>
  );
}
