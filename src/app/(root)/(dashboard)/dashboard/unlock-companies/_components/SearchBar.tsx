'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Building, InfoIcon, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, {
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/useDebounce';
import { formatToUrl } from '@/lib/formatters';
import useSearchSuggestions from '@/services/search/useSearchSuggestions';

export default function SearchBar() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<(HTMLLIElement | null)[]>([]);

  const {
    data: searchResult,
    isLoading,
    isError,
  } = useSearchSuggestions('company', debouncedSearchTerm);

  const suggestions = searchResult?.data || [];

  const debouncedSearch = useDebounce((value: string) => {
    setDebouncedSearchTerm(value);
  }, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
    setFocusedIndex(-1);
  };

  const resetSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setFocusedIndex(-1);
    inputRef.current?.focus();
  };

  const handleCompanySelect = (companyName: string, cin: string) => {
    router.push(
      `/dashboard/unlock-companies/company-details/${formatToUrl(companyName)}/${cin}`
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;

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
      handleCompanySelect(
        suggestions[focusedIndex].company,
        suggestions[focusedIndex].cin
      );
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

  useEffect(() => {
    if (focusedIndex !== -1 && suggestionsRef.current[focusedIndex]) {
      suggestionsRef.current[focusedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [focusedIndex]);

  return (
    <div className='w-full space-y-4'>
      <div className='relative flex items-center'>
        <div className='relative flex-grow'>
          <Input
            ref={inputRef}
            type='text'
            placeholder='Search for companies...'
            value={searchTerm}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            className='h-12 pl-10 pr-10 text-sm'
            aria-label='Search companies'
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
        {isLoading && (
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

        {!isLoading && isError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='rounded-md bg-red-50 p-4'
          >
            <p className='text-sm text-red-800'>
              An error occurred while fetching results. Please try again.
            </p>
          </motion.div>
        )}

        {debouncedSearchTerm.length > 0 &&
          !isLoading &&
          !isError &&
          suggestions.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className='flex items-center gap-2 rounded-md bg-gray-50 p-4'
            >
              <InfoIcon className='h-5 w-5 text-gray-800' />
              <p className='text-sm text-gray-800'>
                No results found for &quot;{searchTerm}&quot;. Please try a
                different search term.
              </p>
            </motion.div>
          )}

        {suggestions && suggestions.length > 0 && (
          <motion.ul
            id='search-suggestions'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='divide-y overflow-auto'
            role='listbox'
          >
            {suggestions.slice(0, 10).map((company, index) => (
              <motion.li
                key={company._id}
                ref={setRefForIndex(index)}
                className={`cursor-pointer p-2 hover:bg-gray-100 ${
                  focusedIndex === index ? 'bg-gray-100' : ''
                }`}
                onClick={() =>
                  handleCompanySelect(company.company, company.cin)
                }
                onMouseEnter={() => setFocusedIndex(index)}
                role='option'
                aria-selected={focusedIndex === index}
              >
                <div className='flex items-center'>
                  <Building className='mr-2 h-5 w-5 text-gray-400' />
                  <div>
                    <p className='text-xs font-medium'>{company.company}</p>
                    <p className='mt-1 text-xs text-gray-500'>
                      {company.cin} | {company.state} | {company.status}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
