import { ICompanyAlertPlan } from '@/app/(root)/new-company-alert/_utils/types';
import Image from 'next/image';
import rounded from '../../../../../../public/assets/new-company-alert/rounded_vector.svg';
import triangle from '../../../../../../public/assets/new-company-alert/triangle_vector.svg';
import { NewPricingTabs } from './NewPricingTabs';

const PricingSection = ({ plans }: { plans: ICompanyAlertPlan[] }) => {
  return (
    <section id='pricing'>
      <div className='wrapper rounded-b-[40px] bg-gradient-to-b from-nca-light-blue-transparent to-nca-light-blue pb-12 lg:pb-20'>
        <div className='relative mx-auto max-w-4xl'>
          <h3 className='z-10 pt-8 text-center text-2xl font-semibold md:text-3xl lg:text-4xl xl:leading-snug'>
            Perfect Plan for <br className='sm:hidden' />
            <span className='text-nca-primary-blue'>Maximum Impact</span>{' '}
          </h3>
          <Image
            src={triangle}
            alt='triangle'
            width={80}
            height={80}
            className='absolute -top-5 left-[136px] -z-10 hidden lg:block'
          />
        </div>
        <div className='relative mx-auto max-w-4xl lg:mb-12'>
          <p className='mt-2 text-center text-xs text-nca-sub-heading-text md:px-10 md:text-sm'>
            Get fresh daily CSV files of companies incorporated the previous
            day, delivered straight to your inbox at 3 pm!
          </p>
          <Image
            src={rounded}
            alt='circle'
            width={120}
            height={120}
            className='absolute -bottom-16 right-10 -z-10 hidden -rotate-[20deg] lg:block'
          />
        </div>

        {/* Tabs */}
        <NewPricingTabs plans={plans} />
      </div>
    </section>
  );
};

export default PricingSection;
