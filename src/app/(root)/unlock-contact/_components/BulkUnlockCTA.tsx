import Link from 'next/link';
import { FaGift, FaTags } from 'react-icons/fa';

const BulkUnlockCTA = () => {
  return (
    <Link
      href='/unlock-contact/bulk-unlock'
      prefetch={false}
      className='flex flex-col items-center justify-between gap-4 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 p-2 shadow-md transition-all duration-300 ease-in hover:shadow-xl md:flex-row md:gap-8 md:px-6 md:py-4'
    >
      <div className='flex items-center gap-4'>
        <FaTags className='hidden flex-shrink-0 text-3xl text-white md:block md:text-4xl' />
        <div className='text-center text-white md:text-left'>
          <p className='text-lg font-bold'>
            <FaTags className='-mt-1 mr-1.5 inline text-xl md:hidden' />
            Want cheaper?
          </p>
          <p className='mt-1 text-sm font-medium'>
            Click here to buy in bulk. Buy in bulk to get it as low as ₹75 each.
          </p>
        </div>
      </div>
      <div className='flex flex-shrink-0 items-center justify-between gap-2.5 rounded-md bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow hover:bg-gray-100 md:text-base'>
        <FaGift className='flex-shrink-0 text-lg md:text-xl' />
        Explore Special Offers
      </div>
    </Link>
  );
};

export default BulkUnlockCTA;
