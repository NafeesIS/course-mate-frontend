// components/ui/DatePicker.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar'; // Replace with the correct calendar component import
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react'; // Replace with your icon library if different
import { useState } from 'react';
import { IDatePickerProps } from '../_types/types';

export const OrderDatePicker = ({
  selected,
  onSelect,
  placeholderText = 'Pick a date',
  className = '',
}: IDatePickerProps) => {
  const [open, setOpen] = useState(false);

  const handleDateChange = (date: Date | undefined) => {
    onSelect(date);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={`w-full justify-start overflow-hidden text-left font-normal ${className}`}
        >
          <CalendarIcon className='mr-2 h-4 w-4 text-muted-foreground' />
          {selected ? (
            format(selected, 'dd-MMM-yyyy')
          ) : (
            <span className='text-xs text-muted-foreground'>
              {placeholderText}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={selected || undefined}
          onSelect={handleDateChange}
          className='text-xs'
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
