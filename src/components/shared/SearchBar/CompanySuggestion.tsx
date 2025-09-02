'use client';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCompanyAgeCompact, formatToUrl } from '@/lib/formatters';
import { cn, getStatusBadgeColor } from '@/lib/utils';
import { sendAndStoreRecentSearches } from '@/services/insights/recentSearches';
import { TCompanySuggestion } from '@/types/SearchBarTypes';
import { DotFilledIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { RiArrowRightUpFill, RiBuilding2Fill } from 'react-icons/ri';

const CompanySuggestion = ({
  index,
  tab,
  inputText,
  item,
  selectedItem,
}: {
  index: number;
  tab: string;
  inputText: string;
  item: TCompanySuggestion;
  selectedItem: number;
}) => {
  const text = item.company;
  const highlight = inputText;
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  const path = `/${tab}/${formatToUrl(item.company)}/${item.cin}`;

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
        <div className='space-y-1'>
          <div
            className={cn(
              'flex gap-2 text-sm transition-all group-hover:font-medium group-hover:text-primary md:text-base',
              selectedItem === index ? 'font-medium text-primary' : ''
            )}
          >
            <span className='flex-center size-6 rounded-full bg-muted p-1'>
              <RiBuilding2Fill className='text-base text-muted-foreground' />
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

            <RiArrowRightUpFill
              className={cn(
                '-ml-4 scale-0 text-lg text-primary transition-all group-hover:ml-0 group-hover:scale-100',
                selectedItem === index ? 'ml-0 scale-100' : ''
              )}
            />
          </div>

          <div className='flex flex-wrap items-center gap-1 text-xs text-muted-foreground md:text-sm'>
            {/* CIN */}
            {item.cin && (
              <p className='flex items-center gap-1 whitespace-nowrap'>
                {item.cin}
              </p>
            )}
            {/* CATEGORY */}
            {item.category && (
              <p className='hidden items-center gap-1 whitespace-nowrap md:flex'>
                <DotFilledIcon />
                {item.category.includes('Company')
                  ? item.category.replace('Company', '').trim()
                  : item.category}
              </p>
            )}
            {/* CLASS OF COMPANY */}
            {item.classOfCompany && (
              <p className='hidden items-center gap-1 whitespace-nowrap md:flex'>
                <DotFilledIcon />
                {item.classOfCompany}
              </p>
            )}
            {/* INCORPORATION AGE */}
            {item.incorporationAge >= 0 && (
              <p className='hidden items-center gap-1 whitespace-nowrap md:flex'>
                <DotFilledIcon />
                {formatCompanyAgeCompact(item.incorporationAge)}
              </p>
            )}
            {/* STATE */}
            <p className='flex items-center gap-1 whitespace-nowrap'>
              <DotFilledIcon />
              {item.state}
            </p>
          </div>
        </div>

        <Badge
          variant='outline'
          className={cn('whitespace-nowrap', getStatusBadgeColor(item.status))}
        >
          {item.status}
        </Badge>
      </Link>
      <Separator className='my-2 last:hidden' />
    </>
  );
};

export default CompanySuggestion;
