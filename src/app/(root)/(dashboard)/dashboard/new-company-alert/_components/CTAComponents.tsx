import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideContact } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import DirectorsImg from '../../../../../../../public/assets/banners/directors.png';

const CTAComponents = () => {
  return (
    <div>
      <div className='relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 p-6 pb-0 text-white'>
        <div className='flex flex-col-reverse items-center'>
          <div className='z-10 mt-8'>
            <div className='relative h-auto'>
              <div className='absolute right-0 top-0 h-16 w-16 rounded-full bg-blue-400 opacity-50'></div>
              <div className='absolute bottom-0 left-0 h-24 w-24 rounded-full bg-blue-500 opacity-50'></div>
              <Image
                src={DirectorsImg}
                alt='Business analytics illustration'
                width={500}
                height={500}
                className='h-auto max-h-64 w-auto transform'
              />
            </div>
          </div>

          <div className='z-10'>
            <h2 className='mb-4 text-xl font-semibold'>
              Only Need to Talk to the Decision Makers?
            </h2>
            <p className='mb-6 text-xs font-light'>
              Skip the clutter and get straight to what matters - Unlock any
              director&apos;s contact information instantly by their name or
              DIN. Fast, direct, and perfect for focused outreach.
            </p>
            <Link
              href='/unlock-contact/bulk-unlock'
              className={cn(
                buttonVariants({ variant: 'secondary' }),
                'h-12 w-full gap-2 px-5 text-sm font-bold text-blue-700'
              )}
            >
              <LucideContact className='text-lg' />
              Get Directors&apos; Contact Now
            </Link>
          </div>
        </div>
        <div className='absolute right-0 top-0 -mr-32 -mt-32 h-64 w-64 rounded-full bg-blue-500 opacity-20'></div>
        <div className='absolute bottom-0 left-0 -mb-32 -ml-32 h-64 w-64 rounded-full bg-blue-700 opacity-20'></div>
      </div>
    </div>
  );
};

export default CTAComponents;
