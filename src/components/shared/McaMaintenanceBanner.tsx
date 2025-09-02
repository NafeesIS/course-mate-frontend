'use client';

import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const McaMaintenanceBanner = ({ className }: { className?: string }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      id='McaMaintenanceBanner'
      className={cn(
        'z-50 w-full border-b-2 border-orange-400 bg-orange-50 py-3 drop-shadow-xl',
        className
      )}
    >
      <div className='wrapper flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
        <div className='flex items-start md:items-center'>
          <AlertCircle className='mr-3 size-5 flex-shrink-0 text-orange-600' />
          <div className='text-xs font-medium leading-relaxed text-orange-900'>
            <span className='font-semibold'>Notice:</span> Due to scheduled
            maintenance by the{' '}
            <Link
              href='https://www.mca.gov.in'
              prefetch={false}
              target='_blank'
              rel='noopener noreferrer'
              className='font-normal text-orange-800 underline hover:text-orange-900'
            >
              Ministry of Corporate Affairs (MCA)
            </Link>
            ,{' '}
            <span className='font-semibold'>
              Company Report and View Public Documents
            </span>{' '}
            will be{' '}
            <span className='font-semibold'>
              unavailable from{' '}
              <span className='font-semibold'>9th July 2025, 12:00 AM</span> to{' '}
              <span className='font-semibold'>13th July 2025, 11:59 PM</span>
            </span>
            . Services will resume normal operations from{' '}
            <span className='font-semibold text-green-700'>14th July 2025</span>{' '}
            onwards, following the MCA V3 portal update. We appreciate your
            understanding and patience during this period.
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className='self-end rounded px-3 py-1 text-orange-700 transition-colors duration-200 hover:bg-orange-100 hover:text-orange-800 md:self-center'
          aria-label='Close maintenance banner'
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default McaMaintenanceBanner;
