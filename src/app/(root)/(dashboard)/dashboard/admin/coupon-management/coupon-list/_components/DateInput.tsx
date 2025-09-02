'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

interface DatePickerProps {
  selected?: string | undefined;
  // eslint-disable-next-line no-unused-vars
  onSelect: (date: string | undefined) => void;
  placeholderText?: string;
  className?: string;
}

export const DateInput = ({
  selected,
  onSelect,
  placeholderText = 'Pick Order date',
  className = '',
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd'); // Converting to string (YYYY-MM-DD)
      onSelect(formattedDate);
    } else {
      onSelect(undefined);
    }
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
            format(new Date(selected), 'dd-MMM-yyyy')
          ) : (
            <span className='text-xs text-muted-foreground lg:text-sm'>
              {placeholderText}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={selected ? new Date(selected) : undefined}
          onSelect={handleDateChange}
          className='text-xs'
          modifiersStyles={
            !selected // Only apply "today" styles if no date is selected
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
