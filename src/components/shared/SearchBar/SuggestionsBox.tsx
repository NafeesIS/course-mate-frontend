/* eslint-disable indent */
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TSearchResult } from '@/types/SearchBarTypes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import { MotionDiv } from '../Motion';
import CompanySuggestion from './CompanySuggestion';
import DirectorSuggestion from './DirectorSuggestion';
import NoResultsFound from './NoResultsFound';
import SearchError from './SearchError';
import SearchResultsLoader from './SearchResultsLoader';

interface SuggestionsBoxProps {
  tab: string;
  inputText: string;
  // eslint-disable-next-line no-unused-vars
  setIsSearchResultsOpen: (isOpen: boolean) => void;
  searchResults: TSearchResult;
  isError: boolean;
  isLoading: boolean;
  selectedItem: number;
}

const SuggestionsBox: FC<SuggestionsBoxProps> = ({
  tab,
  inputText,
  setIsSearchResultsOpen,
  isError,
  isLoading,
  searchResults,
  selectedItem,
}) => {
  const pathname = usePathname();
  const searchPath = pathname.includes('search')
    ? `?query=${inputText}`
    : `/search/${tab}?query=${inputText}`;

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      viewport={{ once: true }}
      className={`absolute left-0 right-0 top-28 z-20 sm:top-14`}
    >
      <Card className='overflow-hidden rounded-t-sm border-0'>
        <CardHeader className='relative flex-row items-center justify-between px-3 pb-0 pt-2 sm:px-4 sm:pt-3'>
          <CardTitle
            className={cn(
              'text-sm text-muted-foreground',
              isError ||
                (searchResults?.success && searchResults?.data?.length === 0)
                ? 'hidden'
                : ''
            )}
          >
            {isLoading ? 'Loading...' : 'Suggestions'}
          </CardTitle>
          {/* CLOSE BUTTON */}
          <Button
            size='icon'
            variant='ghost'
            onClick={() => setIsSearchResultsOpen(false)}
            className='absolute right-1.5 top-0 h-5 w-5 cursor-pointer text-muted-foreground sm:right-2 sm:top-1 md:h-6 md:w-6 md:text-xl'
            asChild
          >
            <RiCloseFill />
          </Button>
        </CardHeader>
        <CardContent className='p-2'>
          {/* SEARCH RESULTS: IF DATA IS PRESENT */}
          {searchResults?.success && (searchResults?.data ?? []).length > 0 ? (
            searchResults?.data
              ?.slice(0, 5)
              ?.map((item, index) =>
                tab === 'company' ? (
                  <CompanySuggestion
                    key={index}
                    index={index}
                    tab={tab}
                    inputText={inputText}
                    item={item}
                    selectedItem={selectedItem}
                  />
                ) : (
                  <DirectorSuggestion
                    key={index}
                    index={index}
                    tab={tab}
                    inputText={inputText}
                    item={item}
                    selectedItem={selectedItem}
                  />
                )
              )
          ) : // NO RESULTS FOUND : NOT AN ERROR
          searchResults?.success && searchResults?.data?.length === 0 ? (
            <NoResultsFound />
          ) : // SERVER ERROR / ERROR FROM BACKEND
          isError || searchResults?.success === false ? (
            <SearchError />
          ) : (
            // FETCHING IN PROGRESS: LOADING
            <SearchResultsLoader />
          )}
        </CardContent>
        <CardFooter className='flex items-center justify-end bg-primary px-4 py-1.5'>
          {/* SEE ALL COMPANIES: GO TO ADVANCED SEARCH */}
          <Link
            href={searchPath}
            prefetch={false}
            className='border-b text-xs leading-tight text-white md:text-sm'
          >
            See all companies
          </Link>
        </CardFooter>
      </Card>
    </MotionDiv>
  );
};

export default SuggestionsBox;
