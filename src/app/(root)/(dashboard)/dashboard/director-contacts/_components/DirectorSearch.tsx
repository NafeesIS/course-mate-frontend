/* eslint-disable indent */
'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import React, { KeyboardEvent, useCallback, useRef, useState } from 'react';
import {
  fetchCompanySuggestions,
  fetchDirectorSuggestions,
} from '../_services/services';
import { ICompanySuggestion, IDirectorSuggestion } from '../_types/types';
import { useDebounce } from '../_utils/debounce';
import CompanySuggestions from './CompanySuggestions';
import { DirectorInfo } from './DirectorInfo';
import DirectorSuggestions from './DirectorSuggestions';

export function DirectorSearch() {
  const [searchOption, setSearchOption] = useState<'director' | 'company'>(
    'director'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDirector, setSelectedDirector] =
    useState<IDirectorSuggestion | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<(HTMLLIElement | null)[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: suggestions, isLoading } = useQuery<IDirectorSuggestion[]>({
    queryKey: ['suggestions', debouncedSearchTerm],
    queryFn: () => {
      return fetchDirectorSuggestions(debouncedSearchTerm);
    },
    enabled: debouncedSearchTerm.length > 2 && searchOption === 'director',
  });

  const { data: companySuggestions, isLoading: companySuggestionsLoading } =
    useQuery<ICompanySuggestion[]>({
      queryKey: ['suggestions', debouncedSearchTerm],
      queryFn: () => {
        return fetchCompanySuggestions(debouncedSearchTerm);
      },
      enabled: debouncedSearchTerm.length > 2 && searchOption === 'company',
    });

  const handleSearchOptionChange = (value: 'director' | 'company') => {
    setSearchOption(value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedDirector(null);
    setFocusedIndex(-1);
  };

  const handleSelectDirector = (director: IDirectorSuggestion) => {
    setSelectedDirector(director);
    setSearchTerm('');
    setFocusedIndex(-1);
  };

  const resetSearch = () => {
    setSearchTerm('');
    setSelectedDirector(null);
    setFocusedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions || searchOption !== 'director') return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : -1));
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      handleSelectDirector(suggestions[focusedIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setFocusedIndex(-1);
    }
  };

  const setRefForIndex = useCallback(
    (index: number) => (el: HTMLLIElement | null) => {
      suggestionsRef.current[index] = el;
    },
    []
  );

  return (
    <div className='w-full space-y-4'>
      <div className='relative flex items-center'>
        <Select
          onValueChange={handleSearchOptionChange}
          defaultValue='director'
        >
          <SelectTrigger className='h-12 w-fit rounded-r-none text-xs text-muted-foreground md:text-sm'>
            <SelectValue placeholder='Search by' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='director'>DIN/Director</SelectItem>
            <SelectItem value='company'>Company</SelectItem>
          </SelectContent>
        </Select>
        <div className='relative flex-grow'>
          <Input
            ref={inputRef}
            type='text'
            placeholder={
              searchOption === 'director'
                ? 'Search by DIN or Director Name'
                : 'Search by Company Name'
            }
            value={searchTerm}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            className='h-12 rounded-l-none pl-10 pr-10 text-sm'
            aria-label='Search directors'
            aria-autocomplete='list'
            aria-controls='search-suggestions'
            aria-expanded={!!suggestions && suggestions.length > 0}
          />
          <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400' />
          {searchTerm && (
            <button
              onClick={resetSearch}
              className='absolute right-3 top-1/2 -translate-y-1/2 transform'
              aria-label='Reset search'
            >
              <X className='h-5 w-5 text-gray-400' />
            </button>
          )}
        </div>
      </div>
      <AnimatePresence>
        {(isLoading || companySuggestionsLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='space-y-2'
          >
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
          </motion.div>
        )}

        {searchOption === 'director' &&
          suggestions &&
          suggestions.length > 0 &&
          !selectedDirector && (
            <motion.ul
              id='search-suggestions'
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className='divide-y overflow-auto'
              role='listbox'
            >
              {suggestions.slice(0, 10).map((suggestion, index) => (
                <DirectorSuggestions
                  key={index}
                  suggestion={suggestion}
                  index={index}
                  focusedIndex={focusedIndex}
                  handleSelectDirector={handleSelectDirector}
                  setRefForIndex={setRefForIndex}
                  setFocusedIndex={setFocusedIndex}
                />
              ))}
            </motion.ul>
          )}

        {searchOption === 'company' &&
          companySuggestions &&
          companySuggestions.length > 0 &&
          !selectedDirector && (
            <motion.ul
              id='search-suggestions'
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className='divide-y overflow-auto'
              role='listbox'
            >
              {companySuggestions
                .slice(0, 10)
                .map((companySuggestion, index) => (
                  <CompanySuggestions
                    key={index}
                    companySuggestion={companySuggestion}
                    focusedIndex={focusedIndex}
                    handleSelectDirector={handleSelectDirector}
                    setRefForIndex={setRefForIndex}
                    setFocusedIndex={setFocusedIndex}
                  />
                ))}
            </motion.ul>
          )}
      </AnimatePresence>

      {selectedDirector && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <DirectorInfo director={selectedDirector} />
        </motion.div>
      )}
    </div>
  );
}
