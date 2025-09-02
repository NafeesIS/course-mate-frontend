'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ISmartSwitchProps } from '../_types/types';

const OrderDateSwitch = ({
  checked,
  onChange,
  leftLabel,
  rightLabel,
  setResetDatePicker,
  setDatePickerUpdate,
}: ISmartSwitchProps) => {
  const handleLeftClick = () => {
    onChange('allTime');
    setResetDatePicker?.(true);
    setDatePickerUpdate?.((prev) => !prev);
  };

  const handleRightClick = () => {
    onChange('today');
    setResetDatePicker?.(true);
    setDatePickerUpdate?.((prev) => !prev);
  };

  return (
    <div className='flex w-full items-center justify-between gap-1.5 whitespace-nowrap rounded-full border border-gray-100 bg-white p-1.5 shadow-sm sm:justify-center'>
      {/* Left button - All Orders */}
      <Button
        onClick={handleLeftClick}
        className={cn(
          'flex h-7 w-full items-center justify-center gap-2 rounded-full px-2 py-1 text-center transition-all duration-300',
          checked === 'allTime'
            ? 'bg-primary text-white shadow-md'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        )}
      >
        <span className='text-xs'>{leftLabel}</span>
      </Button>

      {/* Right button - Today's Orders */}
      <Button
        onClick={handleRightClick}
        className={cn(
          'flex h-7 w-full items-center justify-center gap-2 rounded-full px-2 py-1 text-center transition-all duration-300',
          checked === 'today'
            ? 'bg-primary text-white shadow-md'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        )}
      >
        <span className='text-xs'>{rightLabel}</span>
      </Button>
    </div>
  );
};

export default OrderDateSwitch;
