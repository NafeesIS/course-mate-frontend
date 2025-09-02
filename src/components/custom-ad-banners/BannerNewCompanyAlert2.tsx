import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideFileSpreadsheet } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import AlertsImg from '../../../public/assets/banners/alerts.png';

const BannerNewCompanyAlert2 = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 p-6 text-white shadow-md  md:rounded-xl md:p-12',
        className
      )}
    >
      <div className='flex flex-col items-center sm:flex-row'>
        <div className='z-10 sm:w-7/12'>
          <h2 className='mb-6 w-[95%] text-xl font-semibold md:text-2xl lg:text-3xl'>
            Need the Bigger Picture? Get Full Reports on Newly Registered
            Companies!
          </h2>
          <p className='mb-8 text-xs font-light md:text-sm lg:text-base'>
            New Company Alerts provides everything you need to understand your
            leads-detailed company data plus directors&apos; contact information
            in one place.
          </p>
          <Link
            href='/new-company-alert'
            // prefetch={false}
            className={cn(
              buttonVariants({ variant: 'secondary' }),
              'h-12 w-full gap-2 px-5 text-sm font-bold text-blue-700 sm:w-fit lg:text-base'
            )}
          >
            <LucideFileSpreadsheet className='text-lg md:text-2xl' />
            Get Your Daily Reports Now
          </Link>
          {/* <Button
            variant='secondary'
            className='h-12 w-full gap-2 px-5 text-sm font-bold text-blue-700 sm:w-fit lg:text-base'
          >
            <LucideFileCheck2 className='text-lg md:text-2xl' />
            Get Your Daily Reports Now
          </Button> */}
        </div>
        <div className='z-10 mt-8 sm:w-5/12 md:mt-0'>
          <div className='relative h-auto'>
            <div className='absolute right-0 top-0 h-16 w-16 rounded-full bg-blue-400 opacity-50'></div>
            <div className='absolute bottom-0 left-0 h-24 w-24 rounded-full bg-blue-500 opacity-50'></div>
            {/* <div className='absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rotate-45 transform rounded-lg bg-blue-300 opacity-50'></div> */}
            <Image
              src={AlertsImg}
              alt='Business analytics illustration'
              width={500}
              height={500}
              className='h-auto max-h-64 w-auto transform md:absolute md:left-1/2 md:top-1/2 md:max-h-80 md:-translate-x-1/2 md:-translate-y-1/2'
            />
          </div>
        </div>
      </div>
      <div className='absolute right-0 top-0 -mr-32 -mt-32 h-64 w-64 rounded-full bg-blue-500 opacity-20'></div>
      <div className='absolute bottom-0 left-0 -mb-32 -ml-32 h-64 w-64 rounded-full bg-blue-700 opacity-20'></div>
    </div>
  );
};

export default BannerNewCompanyAlert2;
