'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { IDateRangePickerProps } from '../_types/types';

export function DateRangePicker({
  className,
  value,
  onChange,
  resetSignal = false,
  onApplySort,
}: IDateRangePickerProps) {
  const [date, setDate] = useState<DateRange | undefined>(value);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (resetSignal) {
      setDate(undefined);
      setIsPopoverOpen(false);
    }
  }, [resetSignal]);

  const handleDateChange = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
  };

  const handleApply = () => {
    onChange(date);
    if (onApplySort) {
      onApplySort('endDate', 'asc'); // Trigger sorting on "endDate" in ascending order
    }
    setIsPopoverOpen(false);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            className={cn(
              'h-9 w-full justify-start overflow-hidden bg-transparent text-left text-xs font-normal lg:text-sm',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 size-4 min-w-4' />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick Expire Date Range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <div className='p-4'>
            <Calendar
              initialFocus
              mode='range'
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateChange}
              numberOfMonths={2}
              modifiersClassNames={{
                selected: 'bg-primary text-white rounded-none', // Highlight for start and end dates
                // eslint-disable-next-line camelcase
                range_middle: 'bg-sky-200 rounded-none', // Highlight for dates in the range
              }}
            />
            <Button className='mt-4 w-full' onClick={handleApply}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
