'use client';

import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BASE_URL_BACKEND } from '@/constants';
import { formatCurrency, formatToUrl } from '@/lib/formatters';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import axios from 'axios';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  FileText,
  Package,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { OrderDetails, OrderItem } from './_types/order';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function DetailItem({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className='flex justify-between text-xs md:text-sm'>
      <span className='text-muted-foreground'>{label}:</span>
      <span className={`font-medium text-gray-900 ${valueClassName || ''}`}>
        {value}
      </span>
    </div>
  );
}

const getItemLink = (item: OrderItem): string | undefined => {
  if (
    (item.serviceType === 'companyUnlock' ||
      item.serviceType === 'vpdUnlock') &&
    item.customAttributes?.companyId &&
    item.customAttributes?.companyName
  ) {
    return `/dashboard/unlock-companies/company-details/${formatToUrl(item.customAttributes.companyName)}/${item.customAttributes.companyId}`;
  }

  if (item.serviceType === 'companyUnlock') {
    return `/dashboard/unlock-companies`;
  }

  if (item.serviceType === 'directorUnlock') {
    return `/dashboard/director-contacts`;
  }

  return '/dashboard'; // Default fallback
};

const fetchOrderDetails = async (orderId: string): Promise<OrderDetails> => {
  const response = await axios.get(
    `${BASE_URL_BACKEND}/api/v1/orders/order-details/${orderId}`
  );
  return response.data.data;
};

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  const {
    data: orderDetails,
    isLoading,
    error,
  } = useQuery<OrderDetails, Error>({
    queryKey: ['orderDetails', orderId],
    queryFn: () => fetchOrderDetails(orderId!),
    enabled: !!orderId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  });

  if (isLoading) {
    return <LoadingWithSpinner className='h-screen' />;
  }

  if (error) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4'>
        <AlertCircle className='mb-4 h-12 w-12 text-red-500 sm:h-16 sm:w-16' />
        <h1 className='mb-4 text-center text-xl font-bold sm:text-2xl'>
          Oops! Something went wrong
        </h1>
        <p className='mb-6 text-center text-sm text-gray-600 sm:text-base'>
          {error.message}
        </p>
        <Button asChild>
          <Link href='/dashboard'>Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4'>
        <AlertCircle className='mb-4 h-12 w-12 text-yellow-500 sm:h-16 sm:w-16' />
        <h1 className='mb-4 text-center text-xl font-bold sm:text-2xl'>
          Order Not Found
        </h1>
        <p className='mb-6 text-center text-sm text-gray-600 sm:text-base'>
          We couldn&apos;t find the order details you&apos;re looking for.
        </p>
        <Button asChild>
          <Link href='/dashboard'>Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 lg:py-12'
    >
      <div className='mx-auto w-full max-w-5xl px-4 md:px-6'>
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='space-y-8'
        >
          {/* Success Header */}
          <motion.div
            variants={itemVariants}
            className='flex flex-col items-center gap-4 text-center'
          >
            <div className='relative'>
              <CheckCircle className='size-10 text-green-500 md:size-16' />
            </div>
            <h1 className='text-xl font-bold md:text-2xl'>
              Payment Successful!
            </h1>
            <p className='text-sm text-muted-foreground md:text-base'>
              Thank you for your purchase. Here&apos;s your order summary.
            </p>
          </motion.div>

          {/* Order Summary */}
          <motion.div variants={itemVariants}>
            <Card className='relative overflow-hidden border border-gray-100 bg-white shadow-lg'>
              <CardHeader className='bg-gradient-to-r from-blue-600 to-purple-600'>
                <CardTitle className='flex items-center gap-2 text-white'>
                  <FileText className='size-4' />
                  <span className='text-sm md:text-base'>Order Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6 pt-4 md:pt-6'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8'>
                  <div className='space-y-2'>
                    <DetailItem label='Order ID' value={orderDetails.orderId} />
                    <DetailItem
                      label='Date'
                      value={new Date(orderDetails.createdAt).toLocaleString()}
                    />
                    <DetailItem
                      label='Status'
                      value={orderDetails.status}
                      valueClassName='font-semibold text-green-600'
                    />
                  </div>
                  <div className='space-y-2'>
                    <DetailItem
                      label='Customer'
                      value={`${orderDetails.billingDetails.firstName} ${orderDetails.billingDetails.lastName}`}
                    />
                    <DetailItem
                      label='Email'
                      value={orderDetails.billingDetails.email}
                    />
                    <DetailItem
                      label='Phone'
                      value={orderDetails.billingDetails.mobileNumber}
                    />
                  </div>
                </div>

                <Separator className='bg-gray-200' />

                {/* Purchased Items */}
                <div className='space-y-4'>
                  <h3 className='flex items-center gap-2 text-sm font-semibold md:text-base'>
                    <Package className='size-4 text-primary' />
                    Purchased Items
                  </h3>
                  <div className='space-y-4'>
                    {orderDetails.items.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='rounded-lg border bg-muted p-4'
                      >
                        <div className='flex items-start justify-between'>
                          <div className='space-y-2'>
                            <h4 className='text-sm font-medium md:text-base'>
                              {item.serviceName}
                            </h4>
                            {item.customAttributes && (
                              <div className='space-y-1.5 text-xs text-muted-foreground md:text-sm'>
                                {item.customAttributes.companyName && (
                                  <p>
                                    Company: {item.customAttributes.companyName}
                                  </p>
                                )}
                                {item.customAttributes.companyId && (
                                  <p>CIN: {item.customAttributes.companyId}</p>
                                )}
                                {item.customAttributes.companyUnlockCredits &&
                                  item.customAttributes.companyUnlockCredits >
                                    1 && (
                                    <p>
                                      Credits:{' '}
                                      {
                                        item.customAttributes
                                          .companyUnlockCredits
                                      }
                                    </p>
                                  )}
                                {item.customAttributes.bulkUnlockCredits &&
                                  item.customAttributes.bulkUnlockCredits >
                                    1 && (
                                    <p>
                                      Credits:{' '}
                                      {item.customAttributes.bulkUnlockCredits}
                                    </p>
                                  )}
                              </div>
                            )}
                          </div>
                          <span className='text-sm font-semibold text-primary md:text-base'>
                            {formatCurrency(item.price, item.currency)}
                          </span>
                        </div>
                        <Button
                          variant='ghost'
                          asChild
                          className='mt-3 h-8 px-0 text-[10px] text-primary hover:bg-blue-50 md:text-xs'
                        >
                          <Link
                            href={getItemLink(item) || '/dashboard'}
                            prefetch={false}
                          >
                            View Details{' '}
                            <ArrowRight className='ml-1.5 size-3' />
                          </Link>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Separator className='bg-gray-200' />

                {/* Order Total */}
                <div className='space-y-3'>
                  <div className='flex justify-between text-xs text-muted-foreground md:text-sm'>
                    <span>Subtotal</span>
                    <span>
                      {formatCurrency(
                        orderDetails.value,
                        orderDetails.currency
                      )}
                    </span>
                  </div>
                  {orderDetails.discount_amount > 0 && (
                    <div className='flex justify-between text-xs text-green-600 md:text-sm'>
                      <span>Discount</span>
                      <span>
                        -
                        {formatCurrency(
                          orderDetails.discount_amount,
                          orderDetails.currency
                        )}
                      </span>
                    </div>
                  )}
                  <div className='flex justify-between text-xs text-muted-foreground md:text-sm'>
                    <span>GST</span>
                    <span>
                      {formatCurrency(orderDetails.gst, orderDetails.currency)}
                    </span>
                  </div>
                  <div className='flex justify-between pt-2 text-xs font-bold text-primary md:text-sm'>
                    <span>Total Amount</span>
                    <span>
                      {formatCurrency(
                        orderDetails.value +
                          orderDetails.gst -
                          orderDetails.discount_amount,
                        orderDetails.currency
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className='flex flex-col gap-4 sm:flex-row sm:justify-between'
          >
            <Button
              asChild
              className='h-9 bg-blue-600 px-8 text-xs font-medium text-white hover:bg-blue-700 md:text-sm'
            >
              <Link href='/dashboard' prefetch={false}>
                View Dashboard <ArrowRight className='ml-1.5 size-4' />
              </Link>
            </Button>
            <div className='flex items-center gap-2 text-[10px] text-muted-foreground md:text-xs'>
              <InfoCircledIcon className='size-3 text-blue-600' />
              <span>Invoice sent to {orderDetails.billingDetails.email}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
