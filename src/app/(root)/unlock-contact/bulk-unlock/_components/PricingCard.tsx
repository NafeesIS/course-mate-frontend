'use client';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { IUnlockPricingOption } from '@/types/ServiceCatalogTypes';
import { motion } from 'framer-motion';
import { Check, LucideIcon } from 'lucide-react';
import Link from 'next/link';

export default function PricingCard({
  plan,
  pricingData,
  currency,
  highlighted = false,
}: {
  plan: {
    title: string;
    description?: string;
    features: string[];
    icon: LucideIcon;
  };
  pricingData?: IUnlockPricingOption;
  currency?: string;
  highlighted?: boolean;
}) {
  const Icon = plan.icon;

  if (plan.title !== 'Enterprise' && !pricingData) {
    return (
      <Card className='flex h-full flex-col overflow-hidden'>
        <CardHeader className='bg-gradient-to-r from-purple-100 to-indigo-100 p-4 lg:p-6'>
          <Skeleton className='mx-auto h-10 w-10 rounded-full' />
          <Skeleton className='mx-auto mt-6 h-6 w-3/4' />
          <Skeleton className='mx-auto mt-3 h-4 w-1/2' />
        </CardHeader>
        <CardContent className='flex-col-center p-4 lg:p-6'>
          <Skeleton className='mb-6 h-24 w-full' />
          <Skeleton className='mb-4 h-8 w-full' />
          <Skeleton className='mb-2 h-4 w-3/4' />
          <Skeleton className='mb-2 h-4 w-3/4' />
          <Skeleton className='mb-2 h-4 w-3/4' />
        </CardContent>
        <CardFooter className='pt-6'>
          <Skeleton className='h-12 w-full' />
        </CardFooter>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card
        className={`flex h-full flex-col overflow-hidden ${
          highlighted
            ? 'border-2 border-indigo-500 shadow-lg shadow-indigo-200 dark:shadow-indigo-900'
            : ''
        }`}
      >
        <CardHeader className='bg-gradient-to-r from-purple-100 to-indigo-100 p-4 lg:p-6'>
          <div className='mx-auto flex size-10 items-center justify-center rounded-full bg-indigo-500'>
            <Icon className='size-6 text-white' />
          </div>
          <CardTitle className='mt-6 text-center text-lg font-bold text-gray-800 lg:text-2xl'>
            {plan.title}
          </CardTitle>
          {plan.description && (
            <CardDescription className='mt-3 text-center text-sm lg:text-base'>
              {plan.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className='p-4 lg:p-6'>
          {pricingData ? (
            <div className='text-center'>
              <span className='text-xl font-extrabold text-indigo-600 lg:text-3xl'>
                {currency === 'INR' ? '₹' : '$'}
                {pricingData.price}
              </span>
              <span className='mt-2 text-xs text-gray-600 dark:text-gray-400 lg:text-sm'>
                {pricingData.credits > 1 ? 'per credit' : ''}
              </span>
            </div>
          ) : (
            <div className='mb-6 text-center'>
              <span className='text-xl font-bold text-indigo-600 dark:text-indigo-400 lg:text-3xl'>
                Custom Pricing
              </span>
            </div>
          )}
          {pricingData && pricingData.credits && (
            <Badge
              variant='secondary'
              className='mx-auto mt-4 block w-fit bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 lg:text-base'
            >
              {pricingData.credits}{' '}
              {pricingData.credits === 1 ? 'Credit' : 'Credits'}
            </Badge>
          )}
          <ul className='mt-6 space-y-3'>
            {plan.features.map((feature: string, index: number) => (
              <li key={index} className='flex items-center'>
                <Check className='mr-2 size-3 flex-shrink-0 text-green-500 lg:size-4' />
                <span className='text-xs text-gray-900 lg:text-sm'>
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className='pt-4 lg:pt-6'>
          {pricingData ? (
            <Link
              href='/unlock-contact'
              prefetch={false}
              className={cn(
                buttonVariants({ variant: 'gooeyLeft' }),
                'w-full bg-indigo-600 py-6 text-sm text-white hover:bg-indigo-700 lg:text-lg'
              )}
            >
              Buy Now
            </Link>
          ) : (
            <Link
              href='https://api.whatsapp.com/send/?phone=912248933886&text=Hi%2C+I+would+like+to+inquire+about+purchasing+contact+details+in+larger+quantities.+Could+you+please+provide+more+details%3F&type=phone_number&app_absent=0'
              prefetch={false}
              target='_blank'
              className={cn(
                buttonVariants({ variant: 'gooeyLeft' }),
                'w-full bg-indigo-600 py-6 text-sm text-white hover:bg-indigo-700 lg:text-lg'
              )}
            >
              Contact Sales
            </Link>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
