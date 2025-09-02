/* eslint-disable no-unused-vars */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { cva } from 'class-variance-authority';
import { ChevronDown, XCircle, XIcon } from 'lucide-react';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { fetchUsersByEmail } from '../_services/services';

const MultiSelectUserVariants = cva(
  'm-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:text-black hover:scale-110 duration-300',
  {
    variants: {
      variant: {
        default:
          'border-foreground/10 text-foreground bg-card hover:bg-card/80',
        secondary:
          'border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        inverted: 'inverted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface MultiSelectUserProps {
  options?: {
    label: string;
    value: string;
  }[];
  onValueChange: (value: string[]) => void;
  defaultValue?: string[];
  placeholder?: string;
  formName?: string;
  maxCount?: number;
  className?: string;
}
interface Option {
  value: string;
  label: string;
}
export const MultiSelectUser = forwardRef<
  HTMLButtonElement,
  MultiSelectUserProps
>(
  (
    {
      onValueChange,
      defaultValue = [],
      placeholder = 'Select options',
      formName = 'create form',
      maxCount = 3,
      className,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = useState<
      { value: string; label: string }[]
    >(
      defaultValue.map((item: any) => ({
        value: item.value,
        label: item.label || '', // Will fetch the label when needed
      }))
    );

    useEffect(() => {
      if (defaultValue.length === 0 && formName === 'create form') {
        setSearchTerm('');
        setSelectedValues([]);
      }
    }, [defaultValue, formName]);

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: options = [] } = useQuery({
      queryKey: ['users', searchTerm],
      queryFn: () => fetchUsersByEmail(searchTerm),
      enabled: !!searchTerm.trim(),
      refetchOnWindowFocus: false,
    });

    // Ensure selected options are always included in the dropdown
    const filteredOptions = useMemo(() => {
      const selectedOptions = selectedValues.map((selected) => {
        // Find matching label from `options` if not already present
        const existingOption = options.find(
          (o: any) => o.value === selected.value
        );
        return {
          value: selected.value,
          label: existingOption?.label || selected.label,
        };
      });

      const allOptions = [...selectedOptions, ...options];

      // Remove duplicates based on `value`
      const uniqueOptions = Array.from(
        new Map(allOptions.map((item) => [item.value, item])).values()
      );
      // console.log('uniqueOptions', uniqueOptions);
      // Filter by search term
      // if (searchTerm.trim()) {
      //   return uniqueOptions.filter((option) =>
      //     option.label.toLowerCase().includes(searchTerm.toLowerCase())
      //   );
      // }

      return uniqueOptions; // Return all options if no search term
    }, [selectedValues, options]);
    // console.log('filteredOptions', filteredOptions);
    const toggleOption = (value: string, label: string) => {
      const exists = selectedValues.some(
        (selected) => selected.value === value
      );
      const newSelectedValues = exists
        ? selectedValues.filter((selected) => selected.value !== value)
        : [...selectedValues, { value, label }];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues.map((item) => item.value));
    };

    const handleClear = () => {
      setSelectedValues([]);
      setSearchTerm('');
      onValueChange([]);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxCount);
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues.map((item) => item.value));
    };

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={() => setIsPopoverOpen((prev) => !prev)}
            className={cn(
              'flex h-auto min-h-10 w-full items-center justify-between rounded-md border bg-transparent p-1 text-secondary-foreground hover:bg-transparent hover:text-black',
              className
            )}
          >
            {selectedValues && selectedValues.length > 0 ? (
              <div className='flex w-full items-center justify-between'>
                <div className='flex flex-wrap items-center'>
                  {selectedValues.slice(0, maxCount).map(({ value, label }) => {
                    const option = filteredOptions.find(
                      (o) => o.value === value
                    );
                    const IconComponent = option?.icon;
                    return (
                      <Badge key={value} className='m-1 hover:text-black'>
                        {IconComponent && (
                          <IconComponent className='mr-2 h-4 w-4' />
                        )}
                        {label}
                        <XCircle
                          className='ml-2 h-4 w-4 cursor-pointer'
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleOption(value, label);
                          }}
                        />
                      </Badge>
                    );
                  })}
                  {selectedValues && selectedValues.length > maxCount && (
                    <Badge className='m-1 hover:text-black'>
                      {`+ ${selectedValues.length - maxCount} more`}
                      <XCircle
                        className='ml-2 h-4 w-4 cursor-pointer'
                        onClick={(event) => {
                          event.stopPropagation();
                          clearExtraOptions();
                        }}
                      />
                    </Badge>
                  )}
                </div>
                <div className='flex items-center justify-between'>
                  <XIcon
                    className='mx-2 h-4 cursor-pointer text-muted-foreground'
                    onClick={(event) => {
                      event.stopPropagation();
                      handleClear();
                    }}
                  />
                  <Separator
                    orientation='vertical'
                    className='flex h-full min-h-6'
                  />
                  <ChevronDown className='mx-2 h-4 cursor-pointer text-muted-foreground' />
                </div>
              </div>
            ) : (
              <div className='mx-auto flex w-full items-center justify-between'>
                <span className='mx-3 text-sm text-muted-foreground'>
                  {placeholder}
                </span>
                <ChevronDown className='mx-2 h-4 cursor-pointer text-muted-foreground' />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0' align='start'>
          <div className='w-80'>
            {/* Search Input */}
            <div className=''>
              <div className='relative w-full'>
                {/* Search Icon */}
                <IoSearchOutline className='absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400' />

                {/* Input Field */}
                <input
                  type='text'
                  placeholder='Search by email or phone number . . .'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                  className='w-full rounded-t-md p-2.5 pl-8 text-sm focus:outline-none focus:ring-0'
                />
              </div>
              <Separator className='w-full' />
            </div>

            {/* Options List */}
            <div className='overflow-y-auto'>
              {options.length > 0 ? (
                <ul className=''>
                  {options.map(({ value, label }: Option) => (
                    <li
                      key={value}
                      onClick={() => toggleOption(value, label)} // Select the option
                      className='cursor-pointer p-2.5 text-sm hover:bg-gray-200'
                    >
                      {label}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className='p-2.5 text-center text-sm text-gray-500'>
                  No users available.
                </div>
              )}
            </div>

            {/* Actions */}
            <div
              className={` flex items-center border-t ${
                selectedValues && selectedValues.length > 0
                  ? 'justify-between'
                  : 'justify-center'
              }`}
            >
              {selectedValues && selectedValues.length > 0 && (
                <>
                  <Button
                    onClick={handleClear}
                    className='w-full rounded-none bg-transparent text-center text-sm text-black duration-300 hover:bg-slate-300'
                  >
                    Clear
                  </Button>
                  <Separator
                    orientation='vertical'
                    className='flex h-full min-h-6'
                  />
                </>
              )}
              <Button
                onClick={() => setIsPopoverOpen(false)}
                type='button'
                className='w-full rounded-none bg-transparent text-center text-sm text-black duration-300 hover:bg-slate-300'
              >
                Close
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelectUser.displayName = 'MultiSelectUser';
