'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { AnimatedDiv } from './AnimatedDiv';
import DocSuggestionsBox from './DocSuggestionsBox';

interface DocSearchBarProps {
  searchQuery: string;
  // eslint-disable-next-line no-unused-vars
  setSearchQuery: (q: string) => void;
  isFocused: boolean;
  // eslint-disable-next-line no-unused-vars
  setIsFocused: (f: boolean) => void;
  isSearchResultsOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  setIsSearchResultsOpen: (o: boolean) => void;
  isSearchLoading: boolean;
  results: any[];
  onClear: () => void;
  onSuggestionsClose: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  searchRef: React.RefObject<HTMLDivElement>;
  showPopularTags: boolean;
}

const DocSearchBar = ({
  searchQuery,
  setSearchQuery,
  isFocused,
  setIsFocused,
  isSearchResultsOpen,
  setIsSearchResultsOpen,
  isSearchLoading,
  results,
  onClear,
  onSuggestionsClose,
  inputRef,
  searchRef,
  showPopularTags,
}: DocSearchBarProps) => {
  const handleInputFocus = () => setIsFocused(true);

  const handleInputBlur = (e: React.FocusEvent) => {
    if (!searchRef.current?.contains(e.relatedTarget as Node)) {
      setIsFocused(false);
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <AnimatedDiv className='flex justify-center'>
      <div ref={searchRef} className='relative w-full max-w-4xl'>
        <AnimatedDiv
          className={`relative cursor-text overflow-hidden border bg-white/95  transition-all duration-300 ${
            isFocused
              ? 'border-blue-300 shadow-md shadow-blue-100/50 ring-4 ring-blue-100/20'
              : 'hover:border-slate-300 hover:shadow-md'
          } ${showPopularTags ? 'h-12 rounded-xl shadow backdrop-blur-sm' : 'h-10 rounded-lg shadow-sm'}`}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          onClick={handleContainerClick}
        >
          <div className='flex items-center'>
            <div
              className={`flex shrink-0 items-center justify-center text-slate-400 ${showPopularTags ? 'h-12 w-12 sm:w-14' : 'h-10 w-10 sm:w-10'}`}
            >
              <Search
                className={`${showPopularTags ? 'h-5 w-5 sm:h-6 sm:w-6' : 'h-3 w-3 sm:h-4 sm:w-4'} `}
              />
            </div>

            <Input
              ref={inputRef}
              type='text'
              placeholder='Search documentation, guides, and articles...'
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchResultsOpen(true);
              }}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className={`flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0  ${showPopularTags ? 'px-2 text-sm placeholder:text-base sm:px-4 sm:text-base' : 'px-2 text-xs placeholder:text-sm sm:text-sm'}`}
            />

            {isSearchLoading && (
              <div className='mr-2 h-5 w-5 animate-spin rounded-full border border-primary border-t-transparent sm:mr-3' />
            )}

            {searchQuery && !isSearchLoading && (
              <Button
                onClick={onClear}
                className='mr-2 h-5 rounded-full bg-transparent p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 sm:mr-3'
              >
                <X className='h-4 w-4' />
              </Button>
            )}

            <Button
              className={`mr-2 hidden bg-gradient-to-r from-primary to-indigo-600  text-xs text-white shadow-sm transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-md sm:mr-2 sm:text-sm lg:block ${showPopularTags ? 'h-9 rounded-xl px-3 py-2 font-semibold sm:px-6 sm:py-2' : 'h-7 rounded-lg px-3 py-1 font-medium sm:px-4 sm:py-1'} `}
            >
              <span className='hidden sm:inline'>Search</span>
              <Search className='h-4 w-4 sm:hidden' />
            </Button>
          </div>

          <AnimatedDiv
            className='pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent'
            animate={isFocused ? { translateX: '200%' } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            <></>
          </AnimatedDiv>
        </AnimatedDiv>

        {searchQuery.length > 0 && isSearchResultsOpen && (
          <DocSuggestionsBox
            results={results}
            isLoading={isSearchLoading}
            onClose={onSuggestionsClose}
            searchQuery={searchQuery}
          />
        )}
      </div>
    </AnimatedDiv>
  );
};

export default DocSearchBar;
