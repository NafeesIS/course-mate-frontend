'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatToUrl } from '@/lib/formatters';
import { cn, getDirectorStatusColor } from '@/lib/utils';
import { sendAndStoreRecentSearches } from '@/services/insights/recentSearches';
import { DotFilledIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Key } from 'react';
import {
  RiArrowRightUpFill,
  RiBuildingLine,
  RiUser2Fill,
} from 'react-icons/ri';

const DirectorCard = ({
  query,
  director,
}: {
  query: string | undefined;
  director: any;
}) => {
  const text = director?.fullName;
  const parts = text && text.split(new RegExp(`(${query})`, 'gi'));

  return (
    <Link
      href={`/director/${formatToUrl(director?.fullName)}/${director?.din}`}
      prefetch={false}
      target='_blank'
      onClick={() => {
        sendAndStoreRecentSearches('director', director);
      }}
      className='group transition-all hover:bg-muted'
    >
      <Card className='space-y-2 rounded-md p-4 group-hover:bg-muted'>
        <CardHeader className='flex-row items-start justify-between p-0'>
          <CardTitle className='flex gap-2 text-sm font-medium transition-all group-hover:font-medium group-hover:text-primary md:text-base'>
            <span className='flex-center size-6 rounded-full bg-muted p-1'>
              <RiUser2Fill className='text-base text-muted-foreground' />
            </span>
            <span>
              {parts.map(
                (part: string | undefined, i: Key | null | undefined) => (
                  <span
                    key={i}
                    className={cn({
                      'font-bold': part?.toLowerCase() === query?.toLowerCase(),
                    })}
                  >
                    {part}
                  </span>
                )
              )}
            </span>
            <RiArrowRightUpFill className='-ml-4 scale-0 text-lg text-primary transition-all group-hover:ml-0 group-hover:scale-100' />
          </CardTitle>
          <Badge
            variant='outline'
            className={cn(getDirectorStatusColor(director?.status))}
          >
            {director?.status}
          </Badge>
        </CardHeader>

        <CardContent className='space-y-2 p-0 text-xs text-muted-foreground md:text-sm'>
          <div className='flex items-center gap-1'>
            {/* DIN */}
            {director?.din && (
              <p className='flex items-center gap-1'>
                DIN: {director?.din}
                <DotFilledIcon />
              </p>
            )}
            {/* DATE OF APPOINTMENT */}
            {director?.dinAllocationDate && (
              <p className='hidden items-center gap-1 md:flex'>
                Date of Appointment: {director?.dinAllocationDate}
                <DotFilledIcon />
              </p>
            )}
            {/* PERSON TYPE */}
            {director?.personType && (
              <p className='hidden items-center gap-1 md:flex'>
                Type: {director?.personType}
                <DotFilledIcon />
              </p>
            )}
            {/* TOTAL DIRECTORSHIP */}
            {director?.totalDirectorshipCount >= 0 && (
              <p className='hidden items-center gap-1 md:flex'>
                Companies: {director?.totalDirectorshipCount}
              </p>
            )}
          </div>

          {/* COMPANIES */}
          {director?.companies?.length > 0 && (
            <div className='flex items-center gap-2'>
              <RiBuildingLine className='text-lg' />
              {/* Display up to two companies */}
              {director?.companies.slice(0, 1).map((company: any, i: any) => (
                <p key={i} className=''>
                  {company.replace(/\w\S*/g, function (txt: string) {
                    return (
                      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                    );
                  })}
                </p>
              ))}
              {/* Show the count of remaining companies if more than one */}
              {director?.companies.length > 1 && (
                <p className=''>
                  {`...${director?.companies.length - 1} more companies`}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default DirectorCard;
