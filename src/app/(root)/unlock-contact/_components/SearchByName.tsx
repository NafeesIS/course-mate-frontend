import { Input } from '@/components/ui/input';
import { toCamelCase } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import useSearchSuggestions from '@/services/search/useSearchSuggestions';
import { useState } from 'react';
import {
  RiArrowRightSLine,
  RiBuildingLine,
  RiCloseCircleLine,
  RiSearchLine,
} from 'react-icons/ri';

const SearchByName = ({
  setDinNumber,
  // fetchDirectorContactStatus,
}: {
  setDinNumber: any;
  fetchDirectorContactStatus?: any;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);

  // GET SEARCH RESULTS
  const {
    data: searchResults,
    isError,
    isLoading,
  } = useSearchSuggestions('directors', searchTerm);

  // Handle search term change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSearchBar(true);
  };

  // Handle selection of a director
  const handleSelectDirector = (din: string) => {
    setDinNumber(din);
    window.history.pushState(null, '', `?din=${din}`);
    // fetchDirectorContactStatus(din);
    setShowSearchBar(false);
    setSearchTerm('');
  };

  return (
    <div className='mt-2'>
      <div className='text-xs'>
        <p className='inline'>
          Not sure about the DIN number? <br /> You can search by the
          director&apos;s name instead.{' '}
        </p>
        <button
          className='inline text-primary transition-all hover:underline'
          onClick={() => setShowSearchBar(!showSearchBar)}
        >
          Click here{' '}
          <RiArrowRightSLine
            className={cn(
              'ml-0.5 inline size-4 rounded-full bg-muted p-0.5 transition-all',
              showSearchBar && 'rotate-90'
            )}
          />
        </button>
      </div>

      <div>
        {showSearchBar && (
          <div className='relative'>
            {/* Search box */}
            <div className='relative mt-2 w-full max-w-80'>
              {/* Search icon */}
              <RiSearchLine className='absolute left-2 top-1/2 -translate-y-1/2 transform text-muted-foreground' />

              {/* Search box */}
              <Input
                type='text'
                placeholder='Enter director name'
                value={searchTerm}
                onChange={handleSearchChange}
                className='pl-8 pr-8' // Add padding to make space for icons
              />

              {/* Reset icon */}
              {searchTerm && (
                <RiCloseCircleLine
                  title='Clear search'
                  className='absolute right-2 top-1/2 -translate-y-1/2 transform cursor-pointer text-base text-muted-foreground hover:text-red-500'
                  onClick={() => setSearchTerm('')}
                />
              )}
            </div>

            {/* Suggestions list */}
            {searchTerm.length > 0 && (
              <div className='absolute left-0 top-10 z-10 mt-1 h-fit max-h-80 w-full max-w-lg overflow-y-auto rounded border bg-background text-xs font-semibold shadow-lg'>
                <div>
                  {isLoading && <p className='p-2'>Loading...</p>}
                  {isError && (
                    <p className='p-2 text-red-600'>
                      Error fetching suggestions
                    </p>
                  )}
                  {searchResults?.data?.length ? (
                    <ul className='divide-y'>
                      {searchResults.data.slice(0, 10).map((director: any) => (
                        <li
                          key={director.din}
                          className='cursor-pointer p-2 hover:bg-muted'
                          onClick={() => handleSelectDirector(director.din)}
                        >
                          <p className='flex items-center gap-2'>
                            <span>
                              {director.fullName && director.fullName.length > 0
                                ? director.fullName
                                : '-'}
                            </span>
                            <span className='text-muted-foreground'>
                              DIN:{' '}
                              {director.din && director.din.length > 0
                                ? director.din
                                : '-'}
                            </span>
                          </p>
                          {director?.companies &&
                            director?.companies.length > 0 && (
                              <ul className='flex items-center gap-1.5 space-y-1 text-muted-foreground'>
                                <RiBuildingLine className='-mb-1 flex-shrink-0 text-base' />
                                {director?.companies
                                  .slice(0, 2)
                                  .map((company: any, index: number) => (
                                    <li
                                      key={index}
                                      className={
                                        company.length > 1 ? 'truncate' : ''
                                      }
                                    >
                                      {company && company.length > 0
                                        ? toCamelCase(company)
                                        : '-'}
                                      {index >= director?.companies.length - 1
                                        ? ''
                                        : ','}
                                    </li>
                                  ))}
                                {director?.companies.length > 3 && (
                                  <li className='whitespace-nowrap'>
                                    ... {director?.companies.length - 2} more
                                  </li>
                                )}
                              </ul>
                            )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    !isLoading && <p className='p-2'>No results found</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchByName;
