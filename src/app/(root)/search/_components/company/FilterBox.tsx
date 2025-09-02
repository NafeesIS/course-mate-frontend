'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
  convertKeyToPaidUpCapital,
  convertKeyToWhetherListedOrNot,
} from '@/constants/companySearchFilters';
import { cn } from '@/lib/utils';
import { TCompanySearchParams } from '@/types/CompanySearchTypes';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RiArrowRightSLine } from 'react-icons/ri';

interface FilterBoxProps {
  type?: 'checkbox' | 'radio';
  title: string;
  options: string[];
  paramName: keyof TCompanySearchParams;
  searchParams: TCompanySearchParams;
  searchBar?: boolean;
  searchFacets?: any;
  isPending?: boolean;
  startTransition?: any;
}

const FilterBox: React.FC<FilterBoxProps> = ({
  type = 'checkbox',
  title,
  options,
  paramName,
  searchParams,
  searchBar = true,
  searchFacets,
  isPending,
  startTransition,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [openFilter, setOpenFilter] = useState(true);
  const prevPathname = useRef<string>();
  const prevParams = useRef<string>();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  // UPDATE SELECTED VALUES BASED ON CHANGES TO SEARCHPARAMS OR PARAM NAME
  useEffect(() => {
    const values = searchParams[paramName]?.toString().split(',') || [];
    setSelectedValues(values);
  }, [searchParams, paramName]);

  // HANDLE CHECKBOX CHANGES
  const handleCheckboxChange = useCallback(
    (id: string) => {
      setSelectedValues((prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((item) => item !== id)
          : [...prevSelected, id]
      );

      const params = new URLSearchParams();
      // RESET THE PAGE PARAMETER TO 1
      params.set('page', '1');

      Object.entries(searchParams).forEach(([key, value]) => {
        if (value && value !== '' && key !== 'page') {
          params.append(key, value.toString());
        }
      });

      const updatedSelectedValues = selectedValues.includes(id)
        ? selectedValues.filter((item) => item !== id)
        : [...selectedValues, id];

      if (updatedSelectedValues.length > 0) {
        params.set(paramName, updatedSelectedValues.join(','));
      } else {
        params.delete(paramName);
      }

      const newUrl = `${pathname}?${params.toString()}`;

      if (
        prevPathname.current !== pathname ||
        prevParams.current !== params.toString()
      ) {
        startTransition(() => {
          router.push(newUrl, { scroll: false });
        });
      }

      prevPathname.current = pathname;
      prevParams.current = params.toString();
    },
    [selectedValues, searchParams, paramName, pathname, router, startTransition]
  );

  // HANDLE RADIO BUTTON CHANGE
  const handleRadioChange = useCallback(
    (selectedValue: string) => {
      const params = new URLSearchParams();
      // RESET THE PAGE PARAMETER TO 1
      params.set('page', '1');

      Object.entries(searchParams).forEach(([key, value]) => {
        if (value && value !== '' && key !== 'page') {
          params.append(key, value.toString());
        }
      });

      params.set(paramName, selectedValue); // Update selected value for radio button

      const newUrl = `${pathname}?${params.toString()}`;

      if (
        prevPathname.current !== pathname ||
        prevParams.current !== params.toString()
      ) {
        startTransition(() => {
          router.push(newUrl, { scroll: false });
        });
      }

      prevPathname.current = pathname;
      prevParams.current = params.toString();
    },
    [searchParams, paramName, pathname, router, startTransition]
  );

  // CONVERT SEARCH FACETS INTO A MORE CONVENIENT FORMAT
  const convertedSearchFacets = searchFacets?.reduce(
    (acc: Record<string, string>, item: { _id: string; count: number }) => {
      acc[item._id] = item.count.toString();
      return acc;
    },
    {}
  );

  return (
    <div>
      <Button
        variant='ghost'
        className='w-full justify-start gap-2 rounded-none p-4 font-semibold'
        onClick={() => setOpenFilter((open) => !open)}
      >
        {title}{' '}
        {selectedValues && selectedValues.length > 0
          ? `(${selectedValues.length})`
          : ''}{' '}
        <RiArrowRightSLine
          className={cn(
            'h-4 w-4 rotate-0 transition',
            openFilter ? 'rotate-90' : 'rotate-0'
          )}
        />
      </Button>
      <Command
        className={cn('rounded-none border-t', openFilter ? 'block' : 'hidden')}
      >
        <div className={!searchBar ? 'hidden' : ''}>
          <CommandInput placeholder='Search...' />
        </div>
        <CommandList className='p-2'>
          {options.map((item) => (
            <CommandItem key={item} className={cn('gap-2')}>
              {type === 'checkbox' ? (
                <Checkbox
                  id={item}
                  checked={selectedValues.includes(item)}
                  onCheckedChange={() => handleCheckboxChange(item)}
                  disabled={isPending}
                  className={cn(isPending && 'pointer-events-none')}
                />
              ) : (
                <input
                  type='radio'
                  id={item}
                  name={paramName} // Set the same name for all radio buttons
                  value={item}
                  checked={selectedValues.includes(item)} // Check if the current item is selected
                  onChange={() => handleRadioChange(item)} // Call handleRadioChange on change
                />
              )}
              <Label htmlFor={item} className='text-xs md:text-sm'>
                {paramName === 'whetherListedOrNot'
                  ? convertKeyToWhetherListedOrNot(item)
                  : paramName === 'paidUpCapital'
                    ? convertKeyToPaidUpCapital(item)
                    : item}{' '}
                {convertedSearchFacets && (
                  <span className='font-bold text-muted-foreground'>
                    ({convertedSearchFacets[item] || 0})
                  </span>
                )}
              </Label>
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </div>
  );
};

export default FilterBox;
