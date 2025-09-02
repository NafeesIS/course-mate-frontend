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
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { RiArrowRightSLine } from 'react-icons/ri';

interface FilterBoxProps {
  type?: 'checkbox' | 'radio';
  title: string;
  options: string[];
  searchBar?: boolean;
  selectedValues: string[];
  // eslint-disable-next-line no-unused-vars
  setSelectedValues: (values: string[]) => void;
}

const PartnerFilters: React.FC<FilterBoxProps> = ({
  type = 'checkbox',
  title,
  options,
  searchBar = true,
  selectedValues,
  setSelectedValues,
}) => {
  const [openFilter, setOpenFilter] = useState(true);

  const handleCheckboxChange = (item: string) => {
    if (selectedValues.includes(item)) {
      setSelectedValues(selectedValues.filter((value) => value !== item));
    } else {
      setSelectedValues([...selectedValues, item]);
    }
  };

  const handleRadioChange = (selectedValue: string) => {
    setSelectedValues([selectedValue]);
  };

  return (
    <div>
      <Button
        variant='ghost'
        className='w-full justify-start gap-2 rounded-none p-4 font-semibold'
        onClick={() => setOpenFilter((open) => !open)}
      >
        {title} {selectedValues.length > 0 ? `(${selectedValues.length})` : ''}{' '}
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
                />
              ) : (
                <input
                  type='radio'
                  id={item}
                  value={item}
                  checked={selectedValues.includes(item)}
                  onChange={() => handleRadioChange(item)}
                />
              )}
              <Label htmlFor={item} className='text-xs md:text-sm'>
                {item}
              </Label>
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </div>
  );
};

export default PartnerFilters;
