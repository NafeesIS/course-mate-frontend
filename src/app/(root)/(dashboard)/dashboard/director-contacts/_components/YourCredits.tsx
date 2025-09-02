'use client';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Coins, Lock, Unlock } from 'lucide-react';
import Link from 'next/link';
import { useUnlockBulkPurchaseStore } from '../_store/unlockContactStore';

const YourCredits = () => {
  const availableDirectorUnlockCredits = useUnlockBulkPurchaseStore(
    (state) => state.availableDirectorUnlockCredits
  );

  return (
    <Card className='w-full'>
      <CardHeader className='pb-4'>
        <CardTitle className='text-sm md:text-base'>Your Credits</CardTitle>
        <CardDescription className='text-xs md:text-sm'>
          Available credits for unlocking contacts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-2 sm:flex-row md:flex-col xl:flex-row'>
          <Badge
            variant='secondary'
            className='flex-center h-10 w-full text-sm'
          >
            <Coins className='mr-2 size-5 flex-shrink-0' />
            {availableDirectorUnlockCredits > 0
              ? availableDirectorUnlockCredits
              : 0}{' '}
            Credits
          </Badge>
          <Link
            href='/unlock-contact/bulk-unlock'
            prefetch={false}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'h-10 w-full xl:w-fit'
            )}
          >
            Buy More
          </Link>
        </div>
        <div className='mt-4 space-y-2 text-xs text-gray-500 md:text-sm'>
          <p className='flex items-center'>
            <Lock className='mr-2 size-3 md:size-4' />1 credit = 1 contact
            unlock
          </p>
          <p className='flex items-center'>
            <Unlock className='mr-2 size-3 md:size-4' />
            Includes phone and email
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default YourCredits;
