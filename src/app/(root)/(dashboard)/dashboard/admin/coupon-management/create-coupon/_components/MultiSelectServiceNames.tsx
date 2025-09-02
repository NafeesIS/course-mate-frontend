/* eslint-disable no-unused-vars */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { usePricingStore } from '@/store/pricingStore';
import { CheckIcon, ChevronDown, XCircle, XIcon } from 'lucide-react';
import { forwardRef, useEffect, useMemo, useState } from 'react';

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
/**
 * Props for MultiSelectServiceNames component
 */
interface MultiSelectServiceNamesProps {
  options?: {
    label: string;
    value: string;
  }[];
  onValueChange: (value: string[]) => void;
  defaultValue?: string[];
  placeholder?: string;
  maxCount?: number;
  className?: string;
}

export const MultiSelectServiceNames = forwardRef<
  HTMLButtonElement,
  MultiSelectServiceNamesProps
>(
  (
    {
      onValueChange,
      defaultValue = [],
      placeholder = 'Select services',
      maxCount = 3,
      className,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] =
      useState<string[]>(defaultValue);
    useEffect(() => {
      setSelectedValues(defaultValue); // Reset state when defaultValue changes
    }, [defaultValue]);

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { serviceCatalogFromDB } = usePricingStore();
    // console.log('serviceCatalogFromDB', serviceCatalogFromDB);
    // const { data: serviceCatalog, isLoading } = useQuery({
    //   queryKey: ['serviceCatalog'], // Unique key for this query
    //   queryFn: getServiceCatalog, // Function that fetches data
    // });

    const filteredOptions = useMemo(() => {
      if (!serviceCatalogFromDB?.serviceCatalog) return [];

      const allOptions = serviceCatalogFromDB.serviceCatalog.map(
        (item: any) => ({
          label: item.name,
          value: item._id,
        })
      );

      const selectedOptions = selectedValues
        .map((selectedValue) =>
          allOptions.find((option) => option.value === selectedValue)
        )
        .filter(Boolean) as { label: string; value: string }[];

      if (!searchTerm.trim()) {
        // If searchTerm is empty, return all options
        return allOptions;
      }

      const filteredResults = allOptions.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Combine selected options with filtered results, avoiding duplicates
      return [
        ...new Map(
          [...selectedOptions, ...filteredResults].map((item) => [
            item.value,
            item,
          ])
        ).values(),
      ];
    }, [serviceCatalogFromDB, searchTerm, selectedValues]);

    const toggleOption = (option: string) => {
      const newSelectedValues = selectedValues.includes(option)
        ? selectedValues.filter((value) => value !== option)
        : [...selectedValues, option];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const handleClear = () => {
      setSelectedValues([]);
      onValueChange([]);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxCount);
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
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
              <div className='flex w-full items-center justify-between hover:text-black'>
                <div className='flex flex-wrap items-center'>
                  {selectedValues.slice(0, maxCount).map((value, index) => {
                    const option = filteredOptions.find(
                      (o) => o.value === value
                    );
                    return (
                      <Badge key={index} className='m-1 hover:text-black'>
                        {option?.label}
                        <XCircle
                          className='ml-2 h-4 w-4 cursor-pointer'
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleOption(value);
                          }}
                        />
                      </Badge>
                    );
                  })}
                  {selectedValues.length > maxCount && (
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
                <XIcon
                  className='mx-2 h-4 cursor-pointer hover:text-black'
                  onClick={(event) => {
                    event.stopPropagation();
                    handleClear();
                  }}
                />
              </div>
            ) : (
              <span className='mx-auto flex w-full justify-between'>
                <span className='mx-3 text-sm text-secondary-foreground'>
                  {placeholder}
                </span>
                <ChevronDown className='mx-2 h-4 cursor-pointer' />
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0' align='start'>
          <Command>
            <CommandInput
              placeholder='Search by service name'
              value={searchTerm}
              onValueChange={(value) => setSearchTerm(value)} // Use the correct prop name
            />

            <CommandList>
              <CommandGroup>
                {filteredOptions && filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => {
                    const isSelected = selectedValues.includes(option.value); // Declare isSelected inside the map function
                    return (
                      <CommandItem
                        key={index}
                        onSelect={() => toggleOption(option.value)}
                      >
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50 [&_svg]:invisible'
                          )}
                        >
                          <CheckIcon className='h-4 w-4' />
                        </div>

                        <span className='w-full cursor-pointer rounded p-1 duration-200 hover:bg-slate-300'>
                          {option.label}
                        </span>
                      </CommandItem>
                    );
                  })
                ) : (
                  <CommandEmpty>No options found.</CommandEmpty>
                )}
              </CommandGroup>

              <Separator />
              <CommandGroup>
                <div className='flex items-center justify-between'>
                  <CommandItem
                    className={`flex w-full justify-center p-0 text-center duration-300 hover:bg-slate-300 ${selectedValues && selectedValues.length > 0 ? 'block' : 'hidden'}`}
                    onSelect={handleClear}
                  >
                    <span className='w-full cursor-pointer rounded-md p-2 duration-300 hover:bg-slate-300'>
                      Clear
                    </span>
                  </CommandItem>
                  <Separator
                    orientation='vertical'
                    className={`flex h-full min-h-6 ${selectedValues && selectedValues.length > 0 ? 'block' : 'hidden'}`}
                  />
                  <CommandItem
                    className='flex w-full justify-center p-0 text-center duration-300 hover:bg-slate-300'
                    onSelect={() => setIsPopoverOpen(false)}
                  >
                    <span className='cursor-pointer rounded-md p-2 duration-300 hover:bg-slate-300'>
                      Close
                    </span>
                  </CommandItem>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelectServiceNames.displayName = 'MultiSelectServiceNames';
