import { DateRangePicker } from '@/components/vpd-date-range-picker/date-range-picker';
import { parse } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface DateFilterProps {
  dateRange: DateRange | undefined;
  // eslint-disable-next-line no-unused-vars
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  resetSignal?: boolean;
  incorporationDate?: string;
}

export function DateFilter({
  dateRange,
  onDateRangeChange,
  resetSignal,
  incorporationDate,
}: DateFilterProps) {
  // Parse incorporation date and get the year
  const incorporationYear = incorporationDate
    ? parse(incorporationDate, 'dd-MMM-yyyy', new Date()).getFullYear()
    : 2005;

  // Set min date to either 2005 or incorporation year, whichever is newer
  const minDate = new Date(Math.max(2005, incorporationYear), 0, 1);
  // Set max date to today
  const maxDate = new Date();

  return (
    <DateRangePicker
      initialDateFrom={dateRange?.from}
      initialDateTo={dateRange?.to}
      onUpdate={({ range }) => {
        onDateRangeChange(range);
      }}
      showCompare={false}
      locale='en-US'
      align='center'
      resetSignal={resetSignal}
      fromDate={minDate}
      toDate={maxDate}
    />
  );
}

export default DateFilter;
