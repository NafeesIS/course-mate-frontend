import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';
import { IOrderStatCardProps } from '../_types/types';

export const OrderStatCard: React.FC<IOrderStatCardProps> = ({
  title,
  orderNumber,
  inrAmount,
  usdAmount,
  colorClass,
  onClick,
  status,
  isSelected,
  isLoading,
  isFetching,
}) => {
  // Extract text color class from colorClass (e.g., "text-green-600", "text-yellow-600")
  const textColorClass = colorClass
    .split(' ')
    .find((cls) => cls.startsWith('text-') && cls.match(/text-\w+-\d+/));

  // Convert text color class to border color class (e.g., "border-green-600")
  const borderColorClass = textColorClass
    ? textColorClass.replace('text-', 'border-')
    : 'border-gray-300'; // Default border color if no match

  function formatCurrency(
    amount: string | number, // Accept both string and number
    currency: string = 'INR',
    locale: string = 'en-IN'
  ): string {
    const numericAmount =
      typeof amount === 'number' ? amount : parseFloat(amount); // Convert if needed

    if (isNaN(numericAmount)) {
      return 'Invalid amount'; // Handle invalid values gracefully
    }

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  }

  // Helper function to format INR amounts
  const formatINR = (amount: string): string => {
    const value = parseFloat(amount);
    if (isNaN(value)) return amount;
    if (value >= 10000000) {
      const crores = value / 10000000;
      return `₹${Number.isInteger(crores) ? crores : crores.toFixed(2)} Cr`;
    }
    if (value >= 100000) {
      const lakhs = value / 100000;
      return `₹${Number.isInteger(lakhs) ? lakhs : lakhs.toFixed(2)} L`;
    }
    return `₹${value.toLocaleString('en-IN')}`;
  };

  // Helper function to format USD amounts
  const formatUSD = (amount: string): string => {
    const value = parseFloat(amount);
    if (isNaN(value)) return amount;
    if (value >= 1000000) {
      const millions = value / 1000000;
      return `$${Number.isInteger(millions) ? millions : millions.toFixed(1)}M`;
    }
    if (value >= 1000) {
      const thousands = value / 1000;
      return `$${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}K`;
    }
    return `$${value.toLocaleString('en-US')}`;
  };

  const loading = isLoading || isFetching;

  return (
    <Card
      onClick={onClick}
      className={cn(
        'flex w-full transform cursor-pointer flex-col items-center justify-start rounded-xl border-0 p-2 shadow transition-all duration-0 hover:shadow-md sm:p-4',
        colorClass,
        isSelected &&
          `border-2 ${status === 'CREATED' ? 'border-yellow-600' : status === 'UNKNOWN' ? 'border-purple-600' : `${borderColorClass}`}`
      )}
    >
      <div className='flex w-full flex-row items-center justify-between'>
        <p className='text-xs font-medium text-gray-600 sm:text-sm'>{title}</p>
        {loading ? (
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
        ) : (
          <p className='mt-1 text-xs font-bold sm:text-sm 2xl:text-base'>
            {orderNumber}
          </p>
        )}
      </div>
      <div className='flex w-full flex-row items-center justify-between'>
        <p className='text-xs font-medium text-gray-600 sm:text-sm'>
          INR Amount
        </p>
        {loading ? (
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
        ) : (
          <div>
            <p className='mt-1 text-xs font-bold sm:text-sm lg:hidden 2xl:text-base'>
              {formatINR(inrAmount)}
            </p>
            <p className='mt-1 hidden text-xs font-bold sm:text-sm lg:block 2xl:text-base'>
              {formatCurrency(inrAmount, 'INR')}
            </p>
          </div>
        )}
      </div>
      <div className='flex w-full flex-row items-center justify-between'>
        <p className='text-xs font-medium text-gray-600 sm:text-sm'>
          USD Amount
        </p>
        {loading ? (
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
        ) : (
          <div>
            <p className='mt-1 text-xs font-bold sm:text-sm lg:hidden 2xl:text-base'>
              {formatUSD(usdAmount)}
            </p>
            <p className='mt-1 hidden text-xs font-bold sm:text-sm lg:block 2xl:text-base'>
              {formatCurrency(usdAmount, 'USD')}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default OrderStatCard;
