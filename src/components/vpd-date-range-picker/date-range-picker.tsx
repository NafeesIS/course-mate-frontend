/* eslint-disable max-lines */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
'use client';

import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { type FC, type JSX, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { DateInput } from './date-input';

export interface DateRangePickerProps {
  /** Click handler for applying the updates from DateRangePicker. */
  onUpdate?: (values: { range: DateRange; rangeCompare?: DateRange }) => void;
  /** Initial value for start date */
  initialDateFrom?: Date | string;
  /** Initial value for end date */
  initialDateTo?: Date | string;
  /** Initial value for start date for compare */
  initialCompareFrom?: Date | string;
  /** Initial value for end date for compare */
  initialCompareTo?: Date | string;
  /** Alignment of popover */
  align?: 'start' | 'center' | 'end';
  /** Option for locale */
  locale?: string;
  /** Option for showing compare feature */
  showCompare?: boolean;
  /** Signal to reset the component */
  resetSignal?: boolean;
  /** Minimum date that can be selected */
  fromDate?: Date;
  /** Maximum date that can be selected */
  toDate?: Date;
  /** Optional label for the filter, defaults to 'Filter by Filing Date' */
  filterLabel?: string;
}

const formatDate = (date: Date, locale = 'en-us'): string => {
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
  if (typeof dateInput === 'string') {
    // Split the date string to get year, month, and day parts
    const parts = dateInput.split('-').map((part) => Number.parseInt(part, 10));
    // Create a new Date object using the local timezone
    // Note: Month is 0-indexed, so subtract 1 from the month part
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return date;
  } else {
    // If dateInput is already a Date object, return it directly
    return dateInput;
  }
};

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface Preset {
  name: string;
  label: string;
}

/** The DateRangePicker component allows a user to select a range of dates */
export const DateRangePicker: FC<DateRangePickerProps> & {
  filePath: string;
} = ({
  initialDateFrom,
  initialDateTo,
  initialCompareFrom,
  initialCompareTo,
  onUpdate,
  align = 'end',
  locale = 'en-US',
  showCompare = true,
  resetSignal = false,
  fromDate,
  toDate,
  filterLabel = 'Filter by Filing Date',
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  const [range, setRange] = useState<DateRange>({
    from: initialDateFrom
      ? getDateAdjustedForTimezone(initialDateFrom)
      : undefined,
    to: initialDateTo ? getDateAdjustedForTimezone(initialDateTo) : undefined,
  });

  const [rangeCompare, setRangeCompare] = useState<DateRange | undefined>(
    initialCompareFrom
      ? {
          from: initialCompareFrom
            ? getDateAdjustedForTimezone(initialCompareFrom)
            : undefined,
          to: initialCompareTo
            ? getDateAdjustedForTimezone(initialCompareTo)
            : undefined,
        }
      : undefined
  );

  // Refs to store the values of range and rangeCompare when the date picker is opened
  const openedRangeRef = useRef<DateRange | undefined>();
  const openedRangeCompareRef = useRef<DateRange | undefined>();

  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(
    undefined
  );

  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 960 : false
  );

  useEffect(() => {
    const handleResize = (): void => {
      setIsSmallScreen(window.innerWidth < 960);
    };

    window.addEventListener('resize', handleResize);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const resetValues = (): void => {
    setRange({
      from: initialDateFrom
        ? getDateAdjustedForTimezone(initialDateFrom)
        : undefined,
      to: initialDateTo ? getDateAdjustedForTimezone(initialDateTo) : undefined,
    });
    setRangeCompare(
      initialCompareFrom
        ? {
            from: initialCompareFrom
              ? getDateAdjustedForTimezone(initialCompareFrom)
              : undefined,
            to: initialCompareTo
              ? getDateAdjustedForTimezone(initialCompareTo)
              : undefined,
          }
        : undefined
    );
  };

  // Helper function to check if two date ranges are equal
  const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
    if (!a || !b) return a === b; // If either is undefined, return true if both are undefined
    return (
      a.from?.getTime() === b.from?.getTime() &&
      (!a.to || !b.to || a.to?.getTime() === b.to?.getTime())
    );
  };

  useEffect(() => {
    if (isOpen) {
      openedRangeRef.current = range;
      openedRangeCompareRef.current = rangeCompare;
    }
  }, [isOpen, range, rangeCompare]);

  // Reset the component when resetSignal changes
  useEffect(() => {
    if (resetSignal) {
      setRange({
        from: undefined,
        to: undefined,
      });
      setRangeCompare(undefined);
      setIsOpen(false);
    }
  }, [resetSignal]);

  const calendarClassNames = useMemo(
    () => ({
      selected: 'bg-gray-200',
      range_start:
        'bg-sky-600 rounded-none text-white hover:bg-sky-600 hover:text-white',
      range_end:
        'bg-sky-600 rounded-none text-white hover:bg-sky-600 hover:text-white',
      range_middle:
        'bg-gray-100 rounded-none text-gray-700 hover:bg-gray-100 hover:text-gray-800',
      today: 'bg-accent text-accent-foreground',
      day: 'h-7 w-7',
      weekday: 'text-muted-foreground rounded-md w-7 font-normal text-[0.8rem]',
      day_button: 'h-7 w-7 text-xs',
    }),
    []
  );

  return (
    <Popover
      modal={true}
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          resetValues();
        }
        setIsOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'h-9 justify-start px-3 text-left text-xs font-normal shadow-sm hover:bg-sky-100 sm:px-2 md:px-3 md:text-sm',
            !range?.from
              ? 'text-muted-foreground'
              : 'text-primary ring-1 ring-primary hover:text-primary'
          )}
        >
          <CalendarIcon className='h-4 w-4 sm:mr-2' />
          <span className='hidden sm:inline'>
            {range?.from ? (
              range.to ? (
                <>
                  {format(range.from, 'dd MMM yyyy')} -{' '}
                  {format(range.to, 'dd MMM yyyy')}
                </>
              ) : (
                format(range.from, 'dd MMM yyyy')
              )
            ) : (
              <span>{filterLabel}</span>
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className='ml-4 w-auto'>
        <div className='flex py-2'>
          <div className='flex'>
            <div className='flex flex-col'>
              <div className='flex flex-col items-center justify-end gap-2 rounded-lg border bg-gray-50 p-2 lg:flex-row lg:items-center lg:justify-between'>
                <h3 className='ml-3 text-xs font-medium'>{filterLabel}</h3>

                <div className='flex flex-col gap-2'>
                  <div className='flex items-center gap-2'>
                    <DateInput
                      value={range.from}
                      onChange={(date) => {
                        const toDate =
                          !range.to || date > range.to ? date : range.to;
                        setRange((prevRange) => ({
                          ...prevRange,
                          from: date,
                          to: toDate,
                        }));
                      }}
                      className='bg-white text-xs'
                    />
                    <div>-</div>
                    <DateInput
                      value={range.to}
                      onChange={(date) => {
                        const fromDate =
                          !range.from || date < range.from ? date : range.from;
                        setRange((prevRange) => ({
                          ...prevRange,
                          from: fromDate,
                          to: date,
                        }));
                      }}
                      className='bg-white text-xs'
                    />
                  </div>
                </div>
              </div>

              <div>
                <Calendar
                  initialFocus
                  mode='range'
                  onSelect={(value: { from?: Date; to?: Date } | undefined) => {
                    if (value?.from) {
                      setRange({ from: value.from, to: value?.to });
                    }
                  }}
                  selected={range}
                  numberOfMonths={isSmallScreen ? 1 : 2}
                  defaultMonth={
                    new Date(
                      new Date().setMonth(
                        new Date().getMonth() - (isSmallScreen ? 0 : 1)
                      )
                    )
                  }
                  classNames={calendarClassNames}
                  disabled={(date) => {
                    if (fromDate && date < fromDate) return true;
                    if (toDate && date > toDate) return true;
                    return false;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-end gap-2 py-2 pr-4'>
          <Button
            onClick={() => {
              setIsOpen(false);
              resetValues();
            }}
            variant='ghost'
            size='sm'
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setIsOpen(false);
              if (range?.from) {
                onUpdate?.({ range });
              }
            }}
            size='sm'
          >
            Apply Filter
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

DateRangePicker.displayName = 'DateRangePicker';
DateRangePicker.filePath =
  'libs/shared/ui-kit/src/lib/date-range-picker/date-range-picker.tsx';
