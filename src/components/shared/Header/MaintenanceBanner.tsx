'use client';

import { cn } from '@/lib/utils';
import { AlertCircle, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export const MaintenanceBanner = ({ className }: { className?: string }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      className={cn('border-b border-yellow-200 bg-yellow-50 py-2', className)}
    >
      <div className='wrapper flex items-center justify-between'>
        <div className='flex md:items-center'>
          <AlertCircle className='mr-2 size-4 flex-shrink-0 text-yellow-400' />
          <p className='text-[10px] text-yellow-700 md:text-xs'>
            We are currently performing scheduled maintenance to improve our
            services. Temporary disruptions may occur. For assistance, please
            reach out to our{' '}
            <Link
              href='/contact-us'
              prefetch={false}
              className='text-green-700 underline'
            >
              support
            </Link>{' '}
            team.
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className='ml-4 text-yellow-400 hover:text-yellow-500'
          aria-label='Close maintenance banner'
        >
          <X className='size-4' />
        </button>
      </div>
    </div>
  );
};
