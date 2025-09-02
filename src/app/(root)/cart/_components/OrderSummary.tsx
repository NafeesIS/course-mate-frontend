'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { BASE_URL_BACKEND } from '@/constants';
import { cn, formatPriceWithCommas, validateGst } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle2, Info, TicketPercent, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useBillingStore } from '../_store/billingStore';
import type { TCartItem } from '../_store/cartStore';

interface OrderSummaryProps {
  userId: string;
  cartItems: TCartItem[];
  baseTotal: number;
  totalAfterGlobalDiscount: number;
  totalAfterPromoApplied: number;
  gstAmount: number;
  totalIncludingGST: number;
  globalDiscountAmount: number;
  promoCodeDiscountAmount: number;
  totalDiscountAmount: number;
  onPromoApplied: (
    // eslint-disable-next-line no-unused-vars
    promoInfo: {
      code: string;
      type: 'percentage' | 'flat';
      value: number;
      discount: number;
    } | null
  ) => void;
  promoInfo: {
    code: string;
    type: 'percentage' | 'flat';
    value: number;
    discount: number;
  } | null;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  userId,
  cartItems,
  baseTotal,
  totalAfterPromoApplied,
  gstAmount,
  totalIncludingGST,
  globalDiscountAmount,
  // promoCodeDiscountAmount,
  // totalAfterGlobalDiscount,
  // totalDiscountAmount,
  onPromoApplied,
  promoInfo,
}) => {
  const { gstInfo, updateGstInfo } = useBillingStore();
  const [gstError, setGstError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const verifyPromoMutation = useMutation({
    mutationFn: (code: string) => {
      const serviceIds = cartItems.map((item) => item.serviceId);

      return axios.post(`${BASE_URL_BACKEND}/api/v1/coupon/verify`, {
        code,
        orderValue: baseTotal,
        userId,
        serviceIds,
      });
    },
    onSuccess: (response) => {
      const { data } = response.data;
      // Check if promo amount is more than the total amount
      if (data.discount > totalIncludingGST) {
        setPromoError(
          'Promo discount exceeds the total amount. Please choose a different promo code.'
        );
        onPromoApplied(null);
        setIsLoading(false);
        return;
      }

      // Check if promo currency matches the total currency
      // if (data.currency !== cartItems[0]?.currency) {
      //   setPromoError(
      //     'Promo code currency does not match the cart currency. Please choose a different promo code.'
      //   );
      //   onPromoApplied(null);
      //   setIsLoading(false);
      //   return;
      // }

      onPromoApplied(data);
      toast.success('Promo code applied successfully!');
      setIsLoading(false);
    },
    onError: (error: any) => {
      onPromoApplied(null);
      setPromoError(
        error.response?.data?.message ||
          'Something went wrong! Please try again.'
      );
      setIsLoading(false);
      return;
    },
  });

  // when there's change in cart items then we have to refetch verifyPromoMutation to make sure the promo is applicable for that plan options
  useEffect(() => {
    if (promoInfo && promoCode) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        verifyPromoMutation.mutate(promoCode);
      }, 500);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  const handleGstInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const gstNumber = e.target.value.trim();
      updateGstInfo({ gstNumber });

      if (!validateGst(gstNumber)) {
        setGstError('Invalid GST number');
      } else {
        setGstError(null);
      }
    },
    [updateGstInfo]
  );

  const handleApplyPromo = useCallback(() => {
    if (promoCode) {
      if (promoInfo) {
        toast.error(
          'Please remove the current promo code before applying a new one.'
        );
      } else {
        verifyPromoMutation.mutate(promoCode);
      }
    }
  }, [promoCode, promoInfo, verifyPromoMutation]);

  const handleRemovePromo = useCallback(() => {
    onPromoApplied(null);
    setPromoCode('');
    setPromoError(null);
    toast.success('Promo code removed successfully!');
  }, [onPromoApplied]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='rounded-xl border border-gray-200 bg-white p-6 shadow'
    >
      <h2 className='text-base font-semibold text-gray-800 md:text-lg'>
        Order Summary
      </h2>

      <Separator className='my-4' />

      <div className='space-y-4 text-xs md:text-sm'>
        <motion.div
          className='flex items-center justify-between'
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className='text-foreground/80'>Cart Total</span>
          <span className='font-semibold'>
            {isLoading ? (
              <Skeleton className='h-4 w-16' />
            ) : (
              <>
                {cartItems[0]?.currency === 'INR' ? '₹' : '$'}{' '}
                {formatPriceWithCommas(baseTotal, true)}
              </>
            )}
          </span>
        </motion.div>

        {globalDiscountAmount > 0 && (
          <motion.div
            className='flex items-center justify-between text-green-700'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span>Global Discount</span>
            <span>
              - {cartItems[0]?.currency === 'INR' ? '₹' : '$'}{' '}
              {formatPriceWithCommas(globalDiscountAmount, true)}
            </span>
          </motion.div>
        )}

        {promoInfo && (
          <>
            <motion.div
              className='flex items-center justify-between font-bold text-green-700'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className='flex items-center'>
                {/* <Tag className='mr-1 h-4 w-4' /> */}
                <TicketPercent className='mr-2 size-5' />
                Discount
                <span className='ml-1 text-green-600'>
                  (
                  {promoInfo.type === 'percentage'
                    ? `${promoInfo.value}% off`
                    : `₹ ${promoInfo.value} off`}
                  )
                </span>
              </span>
              <span>
                {isLoading ? (
                  <>
                    <Skeleton className='h-4 w-16' />
                  </>
                ) : (
                  <>
                    <span className='mr-1 text-green-600'>(-)</span> ₹{' '}
                    {formatPriceWithCommas(promoInfo.discount, true)}
                  </>
                )}
              </span>
            </motion.div>

            <Separator className='mb-6 mt-8' />

            <motion.div
              className='flex items-center justify-between font-semibold'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span>Subtotal</span>
              {isLoading ? (
                <Skeleton className='h-4 w-16' />
              ) : (
                <span>
                  {cartItems[0]?.currency === 'INR' ? '₹' : '$'}{' '}
                  {formatPriceWithCommas(totalAfterPromoApplied, true)}
                </span>
              )}
            </motion.div>
          </>
        )}

        <motion.div
          className='flex items-center justify-between'
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <span className='text-foreground/80'>GST (18%)</span>
          <span className='font-semibold'>
            {isLoading ? (
              <Skeleton className='h-4 w-16' />
            ) : (
              <>
                {cartItems[0]?.currency === 'INR' ? '₹' : '$'}{' '}
                {formatPriceWithCommas(gstAmount, true)}
              </>
            )}
          </span>
        </motion.div>

        {cartItems[0]?.currency === 'INR' && (
          <div className='space-y-4'>
            <div className='flex items-center gap-2.5'>
              <Checkbox
                id='addGst'
                checked={gstInfo.addGst}
                onCheckedChange={(checked) =>
                  updateGstInfo({ addGst: checked as boolean })
                }
                className='size-4'
              />
              <Label
                htmlFor='addGst'
                className='cursor-pointer text-[10px] text-foreground/70 md:text-xs'
              >
                Add GST Number
              </Label>
            </div>

            {gstInfo.addGst && (
              <>
                <Input
                  id='gstNumber'
                  value={gstInfo.gstNumber}
                  onChange={handleGstInputChange}
                  placeholder='Enter your GST number'
                  className={cn(
                    'w-full transition-all duration-300',
                    gstError
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200'
                  )}
                />
                {gstError && <p className='text-xs text-red-500'>{gstError}</p>}
              </>
            )}
          </div>
        )}

        <Separator className='mb-6 mt-8' />

        <motion.div
          className='flex items-center justify-between text-sm font-semibold md:text-base'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <span>Final Payment ({cartItems[0]?.currency})</span>
          <span className='text-base md:text-lg'>
            {isLoading ? (
              <Skeleton className='h-4 w-16' />
            ) : (
              <>
                {cartItems[0]?.currency === 'INR' ? '₹' : '$'}{' '}
                {formatPriceWithCommas(totalIncludingGST, true)}
              </>
            )}
          </span>
        </motion.div>
      </div>

      <div className='mt-8 space-y-2'>
        <Label htmlFor='promoCode' className='text-xs text-foreground/80'>
          Promo Code
        </Label>
        {!promoInfo ? (
          <>
            <div className='flex gap-2'>
              <div className='relative flex-grow'>
                <Input
                  id='promoCode'
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder='Enter promo code'
                  disabled={!!promoInfo}
                  className='pr-8 transition-all duration-300 focus:border-blue-500 focus:ring focus:ring-blue-200'
                />
                {promoCode && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full'
                    onClick={() => {
                      setPromoCode('');
                      setPromoError(null);
                    }}
                  >
                    <X className='h-3 w-3' />
                    <span className='sr-only'>Clear promo code</span>
                  </Button>
                )}
              </div>
              <Button
                size='sm'
                onClick={handleApplyPromo}
                disabled={!promoCode || verifyPromoMutation.isPending}
                className='bg-blue-600 hover:bg-blue-700 focus:ring focus:ring-blue-200'
              >
                {verifyPromoMutation.isPending ? 'Applying...' : 'Apply'}
              </Button>
            </div>
            {verifyPromoMutation.isError && promoError ? (
              <p className='flex items-center gap-1.5 text-xs text-red-500'>
                <Info className='size-4 flex-shrink-0 text-red-600' />{' '}
                <span>{promoError}</span>
              </p>
            ) : null}
          </>
        ) : (
          <div className='flex items-center justify-between gap-4 rounded-lg border border-green-200 bg-green-50 p-2'>
            <div className='flex items-center gap-2'>
              <CheckCircle2 className='size-8 text-green-600' />
              <p className='flex flex-col gap-0.5 text-sm'>
                <span className='font-semibold text-green-700'>
                  {promoInfo.code}
                </span>
                <span className='text-xs text-green-600'>
                  {promoInfo.type === 'percentage' ? (
                    <span>{promoInfo.value}% off</span>
                  ) : (
                    <span>₹{promoInfo.discount} off</span>
                  )}
                </span>
              </p>
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={handleRemovePromo}
              className='text-xs text-red-600 hover:bg-red-50 hover:text-red-700'
            >
              Remove
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OrderSummary;
