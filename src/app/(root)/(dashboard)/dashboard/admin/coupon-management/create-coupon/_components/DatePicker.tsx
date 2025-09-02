'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, isBefore, isToday, startOfDay } from 'date-fns';
import { toDate } from 'date-fns-tz'; // Corrected import
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DatePickerProps {
  value?: Date;
  // eslint-disable-next-line no-unused-vars
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
}: DatePickerProps) {
  const [internalDate, setInternalDate] = useState<Date | undefined>();

  useEffect(() => {
    setInternalDate(value);
  }, [value]);

  const selectedDate = value ?? internalDate;

  const handleSelectDate = (date: Date | undefined) => {
    if (date) {
      // Set the time to 23:59:59 in Indian Time (UTC+5:30)
      const timeZone = 'Asia/Kolkata';
      const adjustedDate = toDate(date, { timeZone });
      adjustedDate.setHours(23, 59, 59);

      setInternalDate(adjustedDate);
      onChange?.(adjustedDate);
    } else {
      setInternalDate(undefined);
      onChange?.(undefined);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'w-full justify-start bg-transparent text-left font-normal',
            !selectedDate && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {selectedDate ? (
            format(selectedDate, 'PPP') // e.g., Jan 27, 2025
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={selectedDate}
          onSelect={handleSelectDate}
          initialFocus
          disabled={(date) => {
            // Disable past dates by comparing start of day
            return isBefore(startOfDay(date), startOfDay(new Date()));
          }}
          modifiers={{
            today: (date) => isToday(date),
          }}
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
        />
      </PopoverContent>
    </Popover>
  );
}
