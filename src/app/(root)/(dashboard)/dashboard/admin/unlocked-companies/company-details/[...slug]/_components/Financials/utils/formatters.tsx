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

  // If both values are 0, return null (no change to display)
  if (current === 0 && previous === 0) return null;

  // If values are the same but not zero, show 0% without arrow
  if (current === previous && current !== 0) {
    return <span className='text-red-500'>0%</span>;
  }

  // Calculate percentage change
  let percentChange: number;
  let isPositive: boolean;

  if (previous === 0) {
    // Handle cases where previous value is 0
    if (current > 0) {
      percentChange = 100;
      isPositive = true;
    } else if (current < 0) {
      percentChange = 100;
      isPositive = false;
    } else {
      return null; // Both are 0, no change to display
    }
  } else {
    // Calculate percentage change for non-zero previous values
    percentChange = ((current - previous) / Math.abs(previous)) * 100;
    isPositive = percentChange > 0;
  }

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
      {Math.abs(percentChange).toFixed(0)}%
    </span>
  );
};

/**
 * Truncates a string in the middle.
 * @param {string} text - The string to truncate.
 * @param {number} maxLength - The maximum length of the resulting string.
 * @returns {string} - The truncated string.
 */
export function truncateMiddle(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;

  const charsToShow = Math.floor((maxLength - 3) / 2);
  const start = text.slice(0, charsToShow);
  const end = text.slice(-charsToShow);

  return `${start}...${end}`;
}
