'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, Lock, Shield } from 'lucide-react';

const HeroBanner = () => {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSupport = () => {
    const supportSection = document.getElementById('support-section');
    if (supportSection) {
      supportSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='bg-gradient-to-r from-blue-600 to-indigo-700 text-white'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='py-12 md:py-20'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12'>
            <div className='flex flex-col justify-center'>
              <h1 className='text-3xl font-bold leading-snug tracking-wide md:text-4xl lg:text-5xl'>
                Unlock Bulk Director Data for Business Growth
              </h1>
              <p className='mt-6 text-sm lg:text-base'>
                Access verified director data in bulk for lead generation,
                marketing campaigns, and business development at discounted
                rates. The more you unlock, the more you save.
              </p>
              <div className='mt-8 flex flex-col sm:flex-row sm:space-x-4'>
                <Button
                  onClick={scrollToPricing}
                  size='lg'
                  className='bg-white text-blue-600 hover:bg-blue-50'
                >
                  View Pricing
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Button>
                <Button
                  variant='outline'
                  onClick={scrollToSupport}
                  size='lg'
                  className='mt-4 border-white bg-white/0 text-white hover:bg-white/10 hover:text-white sm:mt-0'
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className='flex items-center justify-center'>
              <div className='relative'>
                <div className='absolute -left-4 -top-4 h-72 w-72 rounded-full bg-blue-500 opacity-50 blur-3xl'></div>
                <div className='absolute -bottom-4 -right-4 h-72 w-72 rounded-full bg-indigo-500 opacity-50 blur-3xl'></div>
                <div className='relative grid grid-cols-2 gap-4 md:gap-6'>
                  <FeatureCard
                    icon={<Shield className='h-8 w-8' />}
                    title='Verified and Reliable Data'
                    description='Access accurate and up-to-date director contact information'
                  />
                  <FeatureCard
                    icon={<Lock className='h-8 w-8' />}
                    title='Secure and Private'
                    description='Your searches are protected with top-tier security'
                  />
                  <FeatureCard
                    icon={<BarChart className='h-8 w-8' />}
                    title='Marketing and Lead Generation'
                    description='Fuel your campaigns with data-backed insights'
                  />
                  <FeatureCard
                    icon={
                      <svg
                        className='h-8 w-8'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M9 11H7V13H9V11Z' fill='currentColor' />
                        <path d='M13 11H11V13H13V11Z' fill='currentColor' />
                        <path d='M17 11H15V13H17V11Z' fill='currentColor' />
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M2 8C2 6.34315 3.34315 5 5 5H19C20.6569 5 22 6.34315 22 8V16C22 17.6569 20.6569 19 19 19H5C3.34315 19 2 17.6569 2 16V8ZM5 7H19C19.5523 7 20 7.44772 20 8V16C20 16.5523 19.5523 17 19 17H5C4.44772 17 4 16.5523 4 16V8C4 7.44772 4.44772 7 5 7Z'
                          fill='currentColor'
                        />
                      </svg>
                    }
                    title='Bulk Unlock Discounts'
                    description='Get discounted rates on multiple contact unlocks'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => (
  <div className='flex max-w-72 flex-col items-center rounded-lg bg-white/10 p-4 text-center text-white backdrop-blur-2xl'>
    <div className='mb-2'>{icon}</div>
    <h3 className='mb-1 text-sm font-semibold lg:text-base '>{title}</h3>
    <p className='text-center text-xs'>{description}</p>
  </div>
);

export default HeroBanner;
