import { buttonVariants } from '@/components/ui/button';
import { BASE_URL_FRONTEND } from '@/constants';
import { cn } from '@/lib/utils';
import { PhoneCall } from 'lucide-react';
import Link from 'next/link';
import { RiContactsBook2Fill } from 'react-icons/ri';

export const BuyContactDetailsButton = ({
  din,
  className,
}: {
  din?: string;
  className?: string;
}) => {
  return (
    <Link
      href={`${BASE_URL_FRONTEND}/unlock-contact${din ? `?din=${din}` : ''}`}
      prefetch={false}
      target='_blank'
      className={cn(
        buttonVariants({ variant: 'gooeyLeft' }),
        'flex flex-shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold text-blue-600 transition-all duration-200 hover:bg-gray-100',
        className
      )}
    >
      <PhoneCall className='size-4' />
      Call Now
    </Link>
  );
};

export const BuyContactDetailsLink = ({
  din,
  className,
}: {
  din?: string;
  className?: string;
}) => {
  return (
    <Link
      href={`${BASE_URL_FRONTEND}/unlock-contact${din ? `?din=${din}` : ''}`}
      prefetch={false}
      target='_blank'
      className={cn(
        'flex items-center gap-2 whitespace-nowrap rounded-full border border-blue-600 py-1 pl-2.5 pr-3 text-xs font-semibold text-blue-600 transition-all duration-300 ease-in-out hover:bg-primary hover:text-white',
        className
      )}
    >
      <PhoneCall className='size-4' />
      Call <span className='hidden sm:block'>Now</span>
    </Link>
  );
};

const BuyContactDetailsCTA = ({
  din,
  className,
}: {
  din?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'mt-4 flex flex-col items-center justify-between gap-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-6 shadow-lg md:flex-row',
        className
      )}
    >
      <div className='flex items-center space-x-4 text-white'>
        <RiContactsBook2Fill className='flex-shrink-0 text-4xl md:text-4xl' />
        <div>
          <h5 className='text-lg font-semibold leading-tight'>
            Unlock Directors&apos; Contact Information
          </h5>
          <p className='mt-1 text-sm md:text-base'>
            Gain instant access to verified contact details.
          </p>
        </div>
      </div>

      <div className='flex items-center space-x-4'>
        <BuyContactDetailsButton din={din} />
      </div>
    </div>
  );
};

export default BuyContactDetailsCTA;
