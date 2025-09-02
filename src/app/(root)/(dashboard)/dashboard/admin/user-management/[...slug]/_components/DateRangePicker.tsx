'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar'; // Replace with your calendar component
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

interface DatePickerProps {
  selectedDate?: Date;
  // eslint-disable-next-line no-unused-vars
  onDateChange: (date: Date | undefined) => void;
  className?: string;
  placeholderText?: string;
}

export const DatePicker = ({
  selectedDate,
  onDateChange,
  className = '',
  placeholderText = 'Pick a date',
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    onDateChange(date); // Pass the selected date back to the parent
    setOpen(false); // Close the calendar popover
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={`flex h-8 justify-between font-normal lg:h-9 ${className}`}
        >
          <CalendarIcon className='max-h-4 max-w-4 -translate-x-1 text-muted-foreground sm:max-h-max sm:min-h-4 sm:min-w-4 sm:max-w-max' />
          <span className='text-xs text-muted-foreground sm:text-[13px]'>
            {selectedDate
              ? format(selectedDate, 'dd-MMM-yyyy')
              : placeholderText}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={selectedDate}
          onSelect={handleDateSelect} // Select a single date
          className='text-xs'
          modifiersStyles={
            !selectedDate // Only apply "today" styles if no date is selected
              ? {
                  today: {
                    backgroundColor: '#93C5FD', // bg-blue-300
                    color: 'black',
                  },
                }
              : {}
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
