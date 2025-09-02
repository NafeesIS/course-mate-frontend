/* eslint-disable camelcase */
'use client';

import { useCartStore } from '@/app/(root)/cart/_store/cartStore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { IUnlockPricingOption } from '@/types/ServiceCatalogTypes';
import { sendGTMEvent } from '@next/third-parties/google';
import { motion } from 'framer-motion';
import { Check, LucideIcon, Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BulkPricingCard({
  plan,
  pricingData,
  serviceId,
  serviceType,
  basePrice,
  currency,
  highlighted = false,
}: {
  plan: {
    title: string;
    description: string;
    features: string[];
    icon: LucideIcon;
  };
  pricingData: IUnlockPricingOption[] | undefined;
  serviceId: string | undefined;
  serviceType: string | undefined;
  basePrice: number;
  currency?: string;
  highlighted?: boolean;
}) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] =
    useState<IUnlockPricingOption | null>(null);
  const Icon = plan.icon;
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (pricingData && pricingData.length > 0) {
      setSelectedOption(pricingData[0]);
    }
  }, [pricingData]);

  const handleIncrement = () => {
    if (selectedOption && pricingData) {
      const currentIndex = pricingData.findIndex(
        (option: IUnlockPricingOption) =>
          option.credits === selectedOption.credits
      );
      if (currentIndex < pricingData.length - 1) {
        setSelectedOption(pricingData[currentIndex + 1]);
      }
    }
  };

  const handleDecrement = () => {
    if (selectedOption && pricingData) {
      const currentIndex = pricingData.findIndex(
        (option: IUnlockPricingOption) =>
          option.credits === selectedOption.credits
      );
      if (currentIndex > 0) {
        setSelectedOption(pricingData[currentIndex - 1]);
      }
    }
  };

  const handleCheckboxChange = (option: IUnlockPricingOption) => {
    setSelectedOption(option);
  };

  const totalPrice = selectedOption
    ? selectedOption.credits * selectedOption.price
    : 0;
  const savings = selectedOption
    ? selectedOption.credits * (basePrice - selectedOption.price)
    : 0;

  const handleBuyNow = () => {
    if (selectedOption) {
      addItem({
        serviceId: serviceId || '',
        serviceName: plan.title,
        serviceType: serviceType || '',
        description: plan.description,
        features: plan.features,
        pricing: pricingData || [],
        selectedPricing: {
          credits: selectedOption.credits,
          price: selectedOption.price,
        },
        currency: currency || '',
        basePrice,
      });

      // send gtm events: checkout
      sendGTMEvent({
        event: 'add_to_cart',
        ecommerce: {
          currency: currency || 'INR',
          value: totalPrice,
          items: [
            {
              item_name: `${plan.title} (${selectedOption.credits} credit)`,
              price: totalPrice,
              quantity: 1,
              currency: currency || 'INR',
              service_id: serviceId,
            },
          ],
        },
      });

      // ** Optionally, you can add a notification or redirect to the cart page here
      router.push('/cart');
    }
  };

  if (!pricingData) {
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
        className={cn(
          'flex h-full flex-col overflow-hidden',
          highlighted &&
            'border-2 border-indigo-500 shadow-lg shadow-indigo-200 dark:shadow-indigo-900'
        )}
      >
        <CardHeader className='bg-gradient-to-r from-purple-100 to-indigo-100 p-4 lg:p-6'>
          <div className='mx-auto flex size-10 items-center justify-center rounded-full bg-indigo-500'>
            <Icon className='h-6 w-6 text-white' />
          </div>
          <CardTitle className='mt-6 text-center text-lg font-bold text-gray-800  lg:text-2xl'>
            {plan.title}
          </CardTitle>
          <CardDescription className='mt-3 text-center text-sm lg:text-base'>
            Choose from our pre-set bulk options
          </CardDescription>
        </CardHeader>
        <CardContent className='p-4 lg:p-6'>
          <div className='mb-6 rounded-lg bg-indigo-50 p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='text-xl font-extrabold text-indigo-600 dark:text-indigo-400 lg:text-3xl'>
                  {currency === 'INR' ? '₹' : '$'}
                  {selectedOption && selectedOption.price}
                </div>
                <div className='mt-1 text-xs text-gray-600 dark:text-gray-400 lg:text-sm'>
                  per credit
                </div>
              </div>
              <div className='text-right'>
                <div className='text-lg font-bold text-gray-800 dark:text-white lg:text-2xl'>
                  Total: {currency === 'INR' ? '₹' : '$'}
                  {totalPrice && totalPrice.toLocaleString()}
                </div>
                <div className='mt-1 text-xs font-semibold text-green-600 dark:text-green-400 lg:text-sm'>
                  You save {currency === 'INR' ? '₹' : '$'}
                  {savings && savings.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
          <div className='flex-col-center gap-2 text-center'>
            <label
              htmlFor='credits'
              className='block text-xs font-medium text-gray-700 dark:text-gray-300 lg:text-sm'
            >
              Select Credits
            </label>
            <div className='flex items-center space-x-4'>
              <Button
                variant='outline'
                size='icon'
                onClick={handleDecrement}
                disabled={
                  !selectedOption ||
                  selectedOption.credits === pricingData[0].credits
                }
              >
                <Minus className='h-4 w-4' />
              </Button>
              <Input
                id='credits'
                type='number'
                value={selectedOption ? selectedOption.credits : ''}
                readOnly
                className='w-24 text-center'
              />
              <Button
                variant='outline'
                size='icon'
                onClick={handleIncrement}
                disabled={
                  !selectedOption ||
                  selectedOption.credits ===
                    pricingData[pricingData.length - 1].credits
                }
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>
          </div>
          <div className='mt-4 space-y-2'>
            {pricingData &&
              pricingData.map((option: IUnlockPricingOption, index: number) => (
                <div
                  key={index}
                  onClick={() => handleCheckboxChange(option)}
                  className={cn(
                    'group flex cursor-pointer items-center space-x-2 rounded-md bg-blue-50 p-2 transition-colors duration-300 hover:bg-blue-200',
                    selectedOption &&
                      selectedOption.credits === option.credits &&
                      'bg-blue-400'
                  )}
                >
                  <Checkbox
                    id={`option-${option.credits}`}
                    checked={
                      !selectedOption ||
                      selectedOption.credits === option.credits
                    }
                    onCheckedChange={() => handleCheckboxChange(option)}
                  />
                  <label
                    htmlFor={`option-${option.credits}`}
                    className={cn(
                      'block cursor-pointer text-xs font-medium transition-colors duration-300 lg:text-sm',
                      selectedOption &&
                        selectedOption.credits === option.credits &&
                        'text-white'
                    )}
                  >
                    {option.credits} credits at {currency === 'INR' ? '₹' : '$'}
                    {option.price} each
                  </label>
                </div>
              ))}
          </div>

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
        <CardFooter className='pt-6'>
          <Button
            variant='gooeyLeft'
            disabled={!selectedOption || !pricingData.length}
            onClick={handleBuyNow}
            className='w-full bg-indigo-600 py-6 text-lg text-white hover:bg-indigo-700'
          >
            Buy Now
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
