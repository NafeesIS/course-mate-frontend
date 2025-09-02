'use client';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatToUrl, toCamelCase } from '@/lib/formatters';
import { cn, getDirectorStatusColor } from '@/lib/utils';
import { sendAndStoreRecentSearches } from '@/services/insights/recentSearches';
import { TDirectorSuggestion } from '@/types/SearchBarTypes';
import Link from 'next/link';
import {
  RiArrowRightUpFill,
  RiBuildingLine,
  RiUser2Fill,
} from 'react-icons/ri';

const DirectorSuggestion = ({
  index,
  tab,
  inputText,
  item,
  selectedItem,
}: {
  index: number;
  tab: string;
  inputText: string;
  item: TDirectorSuggestion;
  selectedItem: number;
}) => {
  const text = item.fullName;
  const highlight = inputText;
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  const path = `/${tab}/${formatToUrl(item.fullName)}/${item.din}`;

  return (
    <>
      <Link
        href={path}
        prefetch={false}
        key={index}
        onClick={() => {
          sendAndStoreRecentSearches(tab, item);
        }}
        className={cn(
          'group block items-start justify-between space-y-2 p-1 text-sm transition-all hover:bg-muted sm:flex sm:p-2',
          selectedItem === index ? 'bg-muted' : ''
        )}
      >
        <div>
          <div
            className={cn(
              'flex gap-2 text-sm transition-all group-hover:font-medium group-hover:text-primary md:text-base',
              selectedItem === index ? 'font-medium text-primary' : ''
            )}
          >
            <span className='flex-center size-6 rounded-full bg-muted p-1'>
              <RiUser2Fill className='text-base text-muted-foreground' />
            </span>

            <h4 className=''>
              {parts.map((part, i) => (
                <span
                  key={i}
                  className={cn({
                    'font-bold': part.toLowerCase() === highlight.toLowerCase(),
                  })}
                >
                  {part}
                </span>
              ))}
            </h4>
            {/* DIN */}
            {item.din && (
              <p className='flex items-center gap-1 whitespace-nowrap text-xs text-muted-foreground md:text-sm'>
                DIN: {item.din}
              </p>
            )}
            {item.status && (
              <Badge
                variant='outline'
                className={cn(
                  getDirectorStatusColor(item?.status),
                  'ml-4 hidden md:flex'
                )}
              >
                {item?.status}
              </Badge>
            )}

            <RiArrowRightUpFill
              className={cn(
                '-ml-4 scale-0 text-lg text-primary transition-all group-hover:ml-0 group-hover:scale-100',
                selectedItem === index ? 'ml-0 scale-100' : ''
              )}
            />
          </div>

          {item?.companies.length > 0 && (
            <ul className='mt-1 flex items-center gap-1.5 space-y-1 pl-1 text-xs text-gray-500 text-muted-foreground dark:text-gray-400 md:text-sm'>
              <RiBuildingLine className='-mb-1 flex-shrink-0 text-base md:text-base' />
              {item?.companies
                .slice(0, 2)
                .map((company: any, index: number) => (
                  <li
                    key={index}
                    className={company.length > 1 ? 'truncate' : ''}
                  >
                    {company.length > 0 ? toCamelCase(company) : '-'}
                    {index >= item?.companies.length - 1 ? '' : ','}
                  </li>
                ))}
              {item?.companies.length > 3 && (
                <li className='whitespace-nowrap'>
                  ... {item?.companies.length - 2} more
                </li>
              )}
            </ul>
          )}

          {item.status && (
            <Badge
              variant='outline'
              className={cn(
                getDirectorStatusColor(item?.status),
                'mt-2 md:hidden'
              )}
            >
              {item?.status}
            </Badge>
          )}
        </div>
      </Link>
      <Separator className='my-2 last:hidden' />
    </>
  );
};

export default DirectorSuggestion;
