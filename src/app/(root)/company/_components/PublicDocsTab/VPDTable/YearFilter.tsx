import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { parse } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { useMemo, useState } from 'react';

interface YearFilterProps {
  selectedYears: number[];
  // eslint-disable-next-line no-unused-vars
  onYearsChange: (years: number[]) => void;
  incorporationDate?: string;
  documents: Array<{ filingDate: string }>;
}

export function YearFilter({
  selectedYears,
  onYearsChange,
  incorporationDate,
  documents,
}: YearFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelectedYears, setTempSelectedYears] =
    useState<number[]>(selectedYears);

  // Parse incorporation date and get the year
  const incorporationYear = incorporationDate
    ? parse(incorporationDate, 'dd-MMM-yyyy', new Date()).getFullYear()
    : 2005;

  // Set min year to either 2005 or incorporation year, whichever is newer
  const minYear = Math.max(2005, incorporationYear);
  // Set max year to current year
  const maxYear = new Date().getFullYear();

  // Generate array of years from minYear to maxYear
  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => maxYear - i
  );

  // Calculate document counts per year
  const yearCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    years.forEach((year) => (counts[year] = 0));

    documents.forEach((doc) => {
      const year = parse(
        doc.filingDate,
        'dd-MMM-yyyy',
        new Date()
      ).getFullYear();
      if (counts[year] !== undefined) {
        counts[year]++;
      }
    });

    return counts;
  }, [documents, years]);

  const handleYearToggle = (year: number) => {
    if (tempSelectedYears.includes(year)) {
      setTempSelectedYears(tempSelectedYears.filter((y) => y !== year));
    } else {
      setTempSelectedYears([...tempSelectedYears, year]);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Only select years that have documents
      setTempSelectedYears(years.filter((year) => yearCounts[year] > 0));
    } else {
      setTempSelectedYears([]);
    }
  };

  const handleApply = () => {
    onYearsChange(tempSelectedYears);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempSelectedYears(selectedYears);
    setIsOpen(false);
  };

  const isAllYearsSelected =
    tempSelectedYears.length ===
    years.filter((year) => yearCounts[year] > 0).length;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-9 justify-start whitespace-nowrap bg-white px-3 text-left text-xs font-normal shadow-sm hover:bg-sky-100 md:text-sm',
            selectedYears.length > 0
              ? 'text-primary ring-1 ring-primary'
              : 'text-muted-foreground'
          )}
        >
          <div className='flex items-center gap-2'>
            <CalendarDays className='h-4 w-4' />
            <span className='hidden sm:inline'>
              {selectedYears.length > 0 ? (
                <span className='flex items-center gap-1'>
                  Years
                  <span className='ml-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground md:size-5 md:text-xs'>
                    {selectedYears.length}
                  </span>
                </span>
              ) : (
                'Year of Filing'
              )}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[200px]'>
        <div className='border-b p-3'>
          <h4 className='text-xs font-medium'>Filter by Year</h4>
          <p className='mt-1 text-[10px] text-muted-foreground'>
            Select years to display
          </p>
        </div>
        <div className='max-h-[300px] overflow-y-auto p-2'>
          <div className='flex items-center justify-between rounded-md px-2 py-2 hover:bg-accent'>
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='all-years'
                checked={isAllYearsSelected}
                onCheckedChange={handleSelectAll}
                className='size-3.5'
                checkIconClassName='h-3 w-3'
              />
              <label
                htmlFor='all-years'
                className='text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                All Years
              </label>
            </div>
            <span className='text-xs text-muted-foreground'>
              ({Object.values(yearCounts).reduce((a, b) => a + b, 0)})
            </span>
          </div>
          {years.map((year) => (
            <div
              key={year}
              className='flex items-center justify-between rounded-md px-2 py-2 hover:bg-accent'
            >
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id={`year-${year}`}
                  checked={tempSelectedYears.includes(year)}
                  onCheckedChange={() => handleYearToggle(year)}
                  className='size-3.5'
                  checkIconClassName='h-3 w-3'
                  disabled={yearCounts[year] === 0}
                />
                <label
                  htmlFor={`year-${year}`}
                  className='text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  {year}
                </label>
              </div>
              <span
                className={cn(
                  'text-xs',
                  yearCounts[year] === 0
                    ? 'text-destructive'
                    : 'text-muted-foreground'
                )}
              >
                ({yearCounts[year]})
              </span>
            </div>
          ))}
        </div>
        <div className='flex justify-end gap-2 border-t p-2'>
          <Button
            size='sm'
            variant='outline'
            onClick={handleCancel}
            className='h-8'
          >
            Cancel
          </Button>
          <Button size='sm' onClick={handleApply} className='h-8'>
            Apply
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
