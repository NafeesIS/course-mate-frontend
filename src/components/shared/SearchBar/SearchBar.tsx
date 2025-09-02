'use client';

import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { formatToUrl } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import useSearchSuggestions from '@/services/search/useSearchSuggestions';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import SearchButton from './SearchButton';
import SearchTabs from './SearchTabs';
// import SuggestionsBox from './SuggestionsBox';

import { sendAndStoreRecentSearches } from '@/services/insights/recentSearches';
import dynamic from 'next/dynamic';

const SuggestionsBox = dynamic(() => import('./SuggestionsBox'), {
  ssr: false,
});

interface SearchBarProps {
  defaultTab?: string;
  defaultSearchTerm?: string;
  className?: string;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  defaultTab = 'company',
  defaultSearchTerm = '',
  className,
  autoFocus = false,
}) => {
  const router = useRouter();
  const [tab, setTab] = useState(defaultTab);
  const [inputText, setInputText] = useState(defaultSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isSearchResultsOpen, setIsSearchResultsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(-1);
  const [isPending, startTransition] = useTransition();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the search input if autoFocus is true
  useEffect(() => {
    if (autoFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [autoFocus]);

  // DEBOUNCE SEARCH
  const debounce = useDebounce(setDebouncedSearchTerm, 500);

  // EVENT HANDLER FOR SEARCH INPUT
  const handleSearchInput = (value: string) => {
    // Trim leading and trailing spaces
    const trimmedValue = value.trim();
    // Check if the input is not just spaces
    if (trimmedValue === '') {
      setIsSearchResultsOpen(false);
      setInputText('');
      setDebouncedSearchTerm('');
      setSelectedItem(-1);
      return;
    }
    // Allow spaces after writing something, but restrict leading spaces
    const cleanedValue = value.startsWith(' ') ? trimmedValue : value;
    // Replace multiple spaces with a single space
    const singleSpaceValue = cleanedValue.replace(/[^a-zA-Z0-9 & -]/g, '');
    // Update state with the cleaned value
    setInputText(singleSpaceValue);
    // Open the search results box
    setIsSearchResultsOpen(true);
    // Update the search results with debounced search term
    debounce(singleSpaceValue);
  };

  // GET SEARCH RESULTS
  const {
    data: searchResults,
    isError,
    isLoading,
  } = useSearchSuggestions(tab, debouncedSearchTerm);

  const companyUrl = (tab: string, id: number): string =>
    `/${tab}/${formatToUrl(searchResults.data[id].company)}/${searchResults.data[id].cin}`;
  const directorUrl = (tab: string, id: number): string =>
    `/${tab}/${formatToUrl(searchResults.data[id].fullName)}/${searchResults.data[id].din}`;

  // EVENT HANDLERS: KEYDOWN FOR SEARCH INPUT FIELD
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let url = '';

    // EVENT HANDLER FOR CLOSING THE SEARCH RESULTS BOX
    if (e.key === 'Escape') {
      setIsSearchResultsOpen(false);
      // EVENT HANDLER FOR NAVIGATING THROUGH THE SEARCH RESULTS
    } else if (
      e.key === 'ArrowDown' &&
      selectedItem < searchResults?.data?.length - 1
    ) {
      if (!isSearchResultsOpen) setIsSearchResultsOpen(true);
      setSelectedItem(selectedItem + 1);
    } else if (e.key === 'ArrowUp' && selectedItem >= 0) {
      setSelectedItem(selectedItem - 1);
      // EVENT HANDLER FOR NAVIGATE TO THE COMPANY/DIRECTOR PAGE
    } else if (e.key === 'Enter' && inputText.length > 0) {
      if (searchResults?.data?.length === 1) {
        url = tab === 'company' ? companyUrl(tab, 0) : directorUrl(tab, 0);
        sendAndStoreRecentSearches(tab, searchResults.data[0]);
        setIsSearchResultsOpen(false);
        startTransition(() => {
          router.push(url);
        });
      } else if (selectedItem >= 0) {
        url =
          tab === 'company'
            ? companyUrl(tab, selectedItem)
            : directorUrl(tab, selectedItem);
        sendAndStoreRecentSearches(tab, searchResults.data[selectedItem]);
        setIsSearchResultsOpen(false);
        startTransition(() => {
          router.push(url);
        });
      } else {
        url = `/search/${tab}?query=${inputText}`;
        setIsSearchResultsOpen(false);
        startTransition(() => {
          router.push(url);
        });
      }
    }
  };

  // AUTO SCROLL TO TOP WHEN START WRITING
  const searchBarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isSearchResultsOpen) {
      const target =
        searchBarRef.current?.offsetTop && searchBarRef.current?.offsetTop - 80;
      window.scrollTo({
        top: target,
        behavior: 'smooth',
      });
    }
  }, [isSearchResultsOpen]);

  return (
    <div
      ref={searchBarRef}
      className={cn('w-full md:w-10/12 xl:w-9/12', className)}
    >
      <div className='relative'>
        {/* SEARCH BAR */}
        <div className='flex flex-col gap-2 sm:flex-row sm:gap-4'>
          {/* TABS: COMPANY/DIRECTOR */}
          <SearchTabs tab={tab} setTab={setTab} />
          <div className='relative w-full'>
            {/* SEARCH INPUT */}
            <Input
              ref={searchInputRef}
              placeholder={`Search by ${tab === 'company' ? 'Company Name/CIN' : 'Directors Name'}`}
              value={inputText}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className='h-12 w-full rounded-lg bg-background text-sm text-foreground drop-shadow md:px-6 md:text-base'
            />
            {/* SEARCH BUTTON: GO TO ADVANCED SEARCH */}
            <SearchButton
              tab={tab}
              inputText={inputText}
              isPending={isPending}
            />
          </div>
        </div>

        {/* SEARCH RESULTS BOX */}
        {inputText && inputText.length > 0 && isSearchResultsOpen && (
          <SuggestionsBox
            tab={tab}
            inputText={inputText}
            setIsSearchResultsOpen={setIsSearchResultsOpen}
            searchResults={searchResults}
            isError={isError}
            isLoading={isLoading}
            selectedItem={selectedItem}
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
