import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const InputField = ({ icon, placeholder, value, setValue, classes }: any) => {
  return (
    <div className='max-w-md'>
      <div
        className={`relative flex w-full items-center gap-2 overflow-hidden rounded border bg-card p-2 text-sm text-gray-500 transition-all focus-within:border-gray-500 focus-within:text-foreground ${classes}`}
      >
        {icon && <div className='grid h-full place-items-center '>{icon}</div>}
        <input
          type='text'
          title={placeholder}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={(e) => setValue(String(e.target.value))}
          className='peer h-full w-full pr-2 outline-none placeholder:font-normal'
        />
      </div>
    </div>
  );
};

const ColumnSearch = ({ column }: any) => {
  return (
    <InputField
      name={column.columnDef.name}
      placeholder={`Search by ${column.columnDef.name}`}
      value={column.getFilterValue()}
      setValue={column.setFilterValue}
      classes='!p-1.5 !text-xs'
    />
  );
};

const BooleanColumnFilter = ({ column }: any) => {
  return (
    <select
      title='Click to filter by true or false'
      value={
        column.getFilterValue() === 'true'
          ? 'true'
          : column.getFilterValue() === 'false'
            ? 'false'
            : 'all'
      }
      onChange={(e) => {
        const selectedValue = e.target.value;
        column.setFilterValue(() => {
          return selectedValue === 'true'
            ? 'true'
            : selectedValue === 'false'
              ? 'false'
              : '';
        });
      }}
      className='cursor-pointer rounded border p-1.5 font-normal text-foreground text-gray-500 outline-none transition-all focus-within:border-gray-500 focus-within:text-gray-700'
    >
      <option value='all'>All</option>
      <option value='true'>Yes</option>
      <option value='false'>No</option>
    </select>
  );
};

const DateColumnFilter = ({ column }: any) => {
  const [date, setDate] = useState<Date | undefined>(
    column.getFilterValue() ? new Date(column.getFilterValue()) : undefined
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!column.getFilterValue()) {
      setDate(undefined); // Reset the date state when filter is cleared
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [column.getFilterValue()]);

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    column.setFilterValue(
      selectedDate ? format(selectedDate, 'MMM-dd-yyyy') : ''
    );
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='w-full justify-start overflow-hidden text-left font-normal'
        >
          <CalendarIcon className='mr-2 h-4 w-3 min-w-3 text-muted-foreground' />
          {date ? (
            format(date, 'dd-MMM-yyyy')
          ) : (
            <span className='text-xs text-muted-foreground'>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={date} // Ensure `undefined` is passed when no date is selected
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

const ArrayColumnFilter = ({ column }: any) => {
  const filterValue = column.getFilterValue();

  return (
    <select
      title='Click to filter'
      value={filterValue || 'all'}
      onChange={(e) =>
        column.setFilterValue(e.target.value !== 'all' ? e.target.value : '')
      }
      className='cursor-pointer rounded border p-1 font-normal text-gray-500 outline-none transition-all focus-within:border-gray-500 focus-within:text-gray-700'
    >
      <option value='all'>All</option>
      {column?.columnDef?.filterOption?.map((option: any, index: any) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

const CouponColumnFilters = ({ column }: any) => {
  const filterType = column.columnDef.filterOption;
  if (filterType === 'date') {
    return <DateColumnFilter column={column} />;
  }
  if (filterType === 'boolean') {
    return <BooleanColumnFilter column={column} />;
  }
  if (Array.isArray(filterType)) {
    return <ArrayColumnFilter column={column} />;
  }
  return <ColumnSearch column={column} />;
};

export default CouponColumnFilters;
