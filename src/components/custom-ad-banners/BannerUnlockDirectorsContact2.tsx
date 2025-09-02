import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideContact } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import DirectorsImg from '../../../public/assets/banners/directors.png';

const BannerUnlockDirectorsContact2 = () => {
  return (
    <div className='relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 p-6 pb-0 text-white shadow-md sm:pb-6 md:rounded-xl md:p-8'>
      <div className='flex flex-col-reverse items-center sm:flex-row'>
        <div className='z-10 mt-8 sm:w-5/12 md:mt-0'>
          <div className='relative h-auto'>
            <div className='absolute right-0 top-0 h-16 w-16 rounded-full bg-blue-400 opacity-50'></div>
            <div className='absolute bottom-0 left-0 h-24 w-24 rounded-full bg-blue-500 opacity-50'></div>
            {/* <div className='absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rotate-45 transform rounded-lg bg-blue-300 opacity-50'></div> */}
            <Image
              src={DirectorsImg}
              alt='Business analytics illustration'
              width={500}
              height={500}
              className='h-auto max-h-64 w-auto transform md:absolute md:left-1/2 md:top-1/2 md:max-h-80 md:-translate-x-1/2 md:-translate-y-1/2'
            />
          </div>
        </div>

        <div className='z-10 sm:w-7/12 sm:text-right'>
          <h2 className='mb-4 text-xl font-semibold md:text-2xl lg:text-3xl'>
            Only Need to Talk to <br className='hidden sm:inline xl:hidden' />
            the Decision Makers?
          </h2>
          <p className='mb-6 text-xs font-light md:text-sm'>
            Skip the clutter and get straight to what matters - directors&apos;
            contact info from newly registered companies. Quick, direct, and
            perfect for focused outreach.
          </p>
          <Link
            href='/unlock-contact'
            // prefetch={false}
            className={cn(
              buttonVariants({ variant: 'secondary' }),
              'h-12 w-full gap-2 px-5 text-sm font-bold text-blue-700 sm:w-fit lg:text-base'
            )}
          >
            <LucideContact className='text-lg md:text-2xl' />
            Get Directors&apos; Contact Now
          </Link>
        </div>
      </div>
      <div className='absolute right-0 top-0 -mr-32 -mt-32 h-64 w-64 rounded-full bg-blue-500 opacity-20'></div>
      <div className='absolute bottom-0 left-0 -mb-32 -ml-32 h-64 w-64 rounded-full bg-blue-700 opacity-20'></div>
    </div>
  );
};

export default BannerUnlockDirectorsContact2;
