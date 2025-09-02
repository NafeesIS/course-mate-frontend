'use client';

import { endOfDay, format, startOfDay } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface DateRangePickerProps {
  className?: string;
  value: DateRange | undefined;
  // eslint-disable-next-line no-unused-vars
  onChange: (startDate?: string, endDate?: string) => void;
  resetSignal?: boolean;
}

export function DateRangePicker({
  className,
  value,
  onChange,
  resetSignal = false,
}: DateRangePickerProps) {
  const [date, setDate] = useState<DateRange | undefined>(value);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  // State to track screen size
  const [isSmallScreen, setIsSmallScreen] = useState(true);

  // Reset date picker when resetSignal changes
  useEffect(() => {
    if (resetSignal) {
      setDate(undefined);
      setIsPopoverOpen(false);
    }
  }, [resetSignal]);

  // Handle screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640); // 640px is the 'sm' breakpoint in Tailwind
    };

    // Check on initial render
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleDateChange = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
  };

  const handleApply = () => {
    if (date?.from) {
      const startDate = format(date.from, 'yyyy-MM-dd');
      const endDate = date.to ? format(date.to, 'yyyy-MM-dd') : startDate;
      onChange(startDate, endDate);
    } else {
      onChange(undefined, undefined);
    }
    setIsPopoverOpen(false);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            id='date-picker'
            variant={'outline'}
            className={cn(
              'h-9 w-full justify-start overflow-hidden rounded-none bg-transparent text-left text-xs font-normal lg:text-sm',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 size-4 min-w-4' />
            {date?.from ? (
              date.to ? (
                <>
                  {format(startOfDay(date.from), 'dd MMM yy')} -{' '}
                  {format(endOfDay(date.to), 'dd MMM yy')}
                </>
              ) : (
                format(startOfDay(date.from), 'dd MMM yy')
              )
            ) : (
              <span>Select Date or Date Range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <div>
            <Calendar
              initialFocus
              mode='range'
              defaultMonth={
                date?.from ??
                (isSmallScreen
                  ? new Date() // Current month for small screens
                  : new Date(new Date().setMonth(new Date().getMonth() - 1))) // Previous month for larger screens
              }
              selected={date}
              onSelect={handleDateChange}
              numberOfMonths={isSmallScreen ? 1 : 2} // Responsive number of months
              modifiersClassNames={{
                selected:
                  'bg-primary hover:bg-blue-900 hover:text-white text-white rounded-none',
                // eslint-disable-next-line camelcase
                range_middle:
                  'bg-sky-200 rounded-none hover:bg-primary hover:text-white', // Highlight for dates in the range
              }}
              //   disabled={{ after: new Date() }}
              modifiersStyles={
                !date // Only apply "today" styles if no date is selected
                  ? {
                      today: {
                        backgroundColor: '#93C5FD', // bg-blue-300
                        color: 'black',
                        borderRadius: '50%',
                      },
                    }
                  : {}
              }
            />
            <div className='flex gap-4 p-4'>
              <Button
                className='mt-4 w-full hover:bg-gray-300'
                variant='secondary'
                onClick={() => {
                  setDate(undefined);
                  setIsPopoverOpen(false);
                }}
              >
                Cancel
              </Button>{' '}
              <Button className='mt-4 w-full' onClick={handleApply}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
