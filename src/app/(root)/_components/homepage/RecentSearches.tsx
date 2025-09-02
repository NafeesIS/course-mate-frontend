'use client';

import { formatToUrl, toCamelCase } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import { Button } from '../../../../components/ui/button';
import PopularSearches from './PopularSearches';

const RecentSearches = ({ className }: { className?: string }) => {
  // State to hold the recent searches
  const [recentSearches, setRecentSearches] = useState<any[]>([]);

  // Retrieve recent searches from localStorage on component mount
  useEffect(() => {
    const existingSearches = localStorage.getItem('recentSearches');
    if (existingSearches) {
      const searches = JSON.parse(existingSearches);
      // remove duplicates
      const filteredSearches = searches.filter(
        (search: any, index: number, self: any) =>
          index === self.findIndex((s: any) => s.idNo === search.idNo)
      );
      // Get only the latest five searches
      const latestFiveSearches = filteredSearches.slice(0, 5);
      setRecentSearches(latestFiveSearches);
    }
  }, []);

  return (
    <>
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2 whitespace-nowrap text-xs text-gray-200 md:text-sm lg:flex-row',
          recentSearches.length === 0 && 'hidden',
          className
        )}
      >
        Recent Searches:
        <ul className='flex flex-wrap justify-center gap-2'>
          {recentSearches.map((item, index) => (
            <li
              key={index}
              className={cn(
                index === recentSearches.length - 5 && 'hidden xl:block',
                index === recentSearches.length - 4 && 'hidden md:block'
              )}
            >
              <Button
                variant='gooeyLeft'
                title={item.name}
                // className='rounded-full'
                asChild
              >
                <Link
                  href={`${item.tab}/${formatToUrl(item.name)}/${item.idNo}${item.tab === 'company' ? '?tab=about' : ''}`}
                  prefetch={false}
                  className='flex max-w-32 gap-1.5 bg-sky-700 text-xs font-medium tracking-wide text-gray-200 md:max-w-48'
                >
                  <span>
                    <RiSearchLine className='h-4 w-4' />
                  </span>
                  <span className='truncate'>
                    {item.name && item.name.length > 0
                      ? toCamelCase(item.name)
                      : '-'}
                  </span>
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* <PopularSearches className={className} /> */}

      {recentSearches.length === 0 && <PopularSearches className={className} />}
    </>
  );
};

export default RecentSearches;
