'use client';

import { useNewCompanyAlertStore } from '@/app/(root)/new-company-alert/_store/company-alert-store';
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
import { useBillingStore } from '../../../_store/billingStore';

interface IOrderSummaryProps {
  userId: string;
  serviceIds: string[];
  itemPrice: number;
  gstOnItemPrice: number;
  subtotalExcGST: number;
  totalPriceAfterDiscount: number;
  gstAfterDiscount: number;
  subtotalAfterDiscount: number;
  promoInfo: {
    code: string;
    type: 'percentage' | 'flat';
    value: number;
    discount: number;
  } | null;
  onPromoApplied: (
    // eslint-disable-next-line no-unused-vars
    promoInfo: {
      code: string;
      type: 'percentage' | 'flat';
      value: number;
      discount: number;
    } | null
  ) => void;
}

const OrderSummary = ({
  userId,
  serviceIds,
  itemPrice, // price before coupon/offer calculation
  subtotalExcGST,
  gstOnItemPrice,
  totalPriceAfterDiscount, // price after calculation
  // gstAfterDiscount,
  // subtotalAfterDiscount,
  onPromoApplied,
  promoInfo,
}: IOrderSummaryProps) => {
  const { gstInfo, updateGstInfo } = useBillingStore();
  const [gstError, setGstError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // company alert store
  const { selectedZones, selectedDuration, selectedPlan } =
    useNewCompanyAlertStore();

  const verifyPromoMutation = useMutation({
    mutationFn: (code: string) =>
      axios.post(`${BASE_URL_BACKEND}/api/v1/coupon/verify`, {
        code,
        orderValue: itemPrice,
        userId,
        serviceIds,
      }),
    onSuccess: (response) => {
      const { data } = response.data;
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
    },
  });

  // when there's change in selectedZones or selectedDuration or selectedPlan the we have to refetch verifyPromoMutation to make sure the promo is applicable for that plan or zone or duration
  useEffect(() => {
    if (promoInfo && promoCode) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        verifyPromoMutation.mutate(promoCode);
      }, 500);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedZones, selectedDuration, selectedPlan]);

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
              <>
                <Skeleton className='h-4 w-16' />
              </>
            ) : (
              <>₹ {formatPriceWithCommas(subtotalExcGST, true)}</>
            )}
          </span>
        </motion.div>
        <motion.div
          className='flex items-center justify-between'
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className='text-foreground/80'>GST (18%)</span>
          <span className='font-semibold'>
            {isLoading ? (
              <>
                <Skeleton className='h-4 w-16' />
              </>
            ) : (
              <>₹ {formatPriceWithCommas(gstOnItemPrice, true)}</>
            )}
          </span>
        </motion.div>

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

          {promoInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Separator className='my-4' />

              <div className='flex justify-between'>
                <span className='text-foreground/80'>Invoice Total</span>
                <span className='font-semibold'>
                  {isLoading ? (
                    <>
                      <Skeleton className='h-4 w-16' />
                    </>
                  ) : (
                    <>₹ {formatPriceWithCommas(itemPrice, true)}</>
                  )}
                </span>
              </div>

              <div className='mt-4 flex justify-between font-semibold text-green-700'>
                <span className='flex items-center'>
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
              </div>
            </motion.div>
          )}
        </div>

        <Separator className='mb-6 mt-8' />

        <motion.div
          className='flex items-center justify-between text-sm font-semibold md:text-base'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span>Final Payment (INR)</span>
          <span className='text-base md:text-lg'>
            {isLoading ? (
              <>
                <Skeleton className='h-4 w-16' />
              </>
            ) : (
              <>₹ {formatPriceWithCommas(totalPriceAfterDiscount, true)}</>
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
            {verifyPromoMutation.isError && promoError && (
              <p className='flex items-center gap-1.5 text-xs text-red-500'>
                <Info className='size-4 flex-shrink-0 text-red-600' />{' '}
                <span>{promoError}</span>
              </p>
            )}
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
