import { cn } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

export const formatFinancialsCurrency = (
  amount: number | string | undefined | null,
  unit: string
) => {
  // Convert undefined or null amount to 0 for formatting
  const numValue =
    amount == null
      ? 0
      : typeof amount === 'string'
        ? parseFloat(amount)
        : amount;
  let convertedAmount = numValue;

  // Adjust the amount based on the specified unit
  switch (unit) {
    case 'raw':
      convertedAmount = numValue;
      break;
    case 'lakhs':
      convertedAmount = numValue / 100000;
      break;
    case 'crores':
      convertedAmount = numValue / 10000000;
      break;
  }

  // Format the amount based on the locale and currency
  return new Intl.NumberFormat('en-IN', {
    // style: 'currency',
    // currency: 'INR',
    // maximumFractionDigits: unit === 'raw' ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(convertedAmount);
};

export const getUnitText = (unit: string) => {
  switch (unit) {
    case 'raw':
      return 'Actual Values';
    case 'lakhs':
      return 'Lakhs (1 Lakh = 100,000)';
    case 'crores':
      return 'Crores (1 Crore = 10,000,000)';
    default:
      return 'Unknown Unit';
  }
};

export const calculatePercentageChange = (
  currentValue: number,
  previousValue: number
) => {
  if (previousValue === 0) return null;
  const change =
    ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
  return change.toFixed(2);
};

export const renderPercentageChange = (
  currentValue: number | string | null | undefined,
  previousValue: number | string | null | undefined
) => {
  // Ensure the values are defined and numbers
  const current =
    currentValue != null ? parseFloat(currentValue.toString()) : NaN;
  const previous =
    previousValue != null ? parseFloat(previousValue.toString()) : NaN;

  // Handle invalid number cases
  if (isNaN(current) || isNaN(previous)) return null;

  // Calculate percentage change
  const percentChange = calculatePercentageChange(current, previous);
  if (percentChange === null) return null;

  // Ensure percentChange is treated as a number
  const percentChangeValue = parseFloat(percentChange.toString());
  const isPositive = percentChangeValue > 0;

  return (
    <span
      className={cn(
        'flex items-center justify-end',
        isPositive ? 'text-green-600' : 'text-red-600'
      )}
    >
      {isPositive ? (
        <ArrowUpIcon className='mr-1 h-3 w-3' />
      ) : (
        <ArrowDownIcon className='mr-1 h-3 w-3' />
      )}
      {Math.abs(percentChangeValue)}%
    </span>
  );
};
