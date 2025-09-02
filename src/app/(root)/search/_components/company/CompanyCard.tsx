'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCompanyAgeCompact, formatToUrl } from '@/lib/formatters';
import { cn, getStatusBadgeColor } from '@/lib/utils';
import { sendAndStoreRecentSearches } from '@/services/insights/recentSearches';
import { DotFilledIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Key } from 'react';
import { RiArrowRightUpFill, RiBuilding2Fill } from 'react-icons/ri';

const CompanyCard = ({
  query,
  company,
}: {
  query: string | undefined;
  company: any;
}) => {
  const text = company.company;
  const parts = text && text.split(new RegExp(`(${query})`, 'gi'));

  return (
    <Link
      href={`/company/${formatToUrl(company.company)}/${company.cin}?tab=about`}
      prefetch={false}
      target='_blank'
      onClick={() => {
        sendAndStoreRecentSearches('company', company);
      }}
      className='group transition-all hover:bg-muted'
    >
      <Card className='space-y-1 rounded-md p-4 group-hover:bg-muted'>
        <CardHeader className='flex-row items-start justify-between p-0'>
          <CardTitle className='flex items-center gap-2 text-sm font-medium transition-all group-hover:font-medium group-hover:text-primary md:text-base'>
            <span className='flex-center size-6 rounded-full bg-muted p-1'>
              <RiBuilding2Fill className='text-base text-muted-foreground' />
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
            className={cn(
              'font-semibold antialiased',
              getStatusBadgeColor(company.status)
            )}
          >
            {company.status}
          </Badge>
        </CardHeader>

        <CardContent className='flex items-center gap-1 p-0 text-xs text-muted-foreground md:text-sm'>
          {/* CIN */}
          {company.cin && (
            <p className='flex items-center gap-1'>
              {company.cin}
              <DotFilledIcon />
            </p>
          )}
          {/* CATEGORY */}
          {company.category && (
            <p className='hidden items-center gap-1 md:flex'>
              {company.category}
              <DotFilledIcon />
            </p>
          )}
          {/* CLASS OF COMPANY */}
          {company.classOfCompany && (
            <p className='hidden items-center gap-1 md:flex'>
              {company.classOfCompany}
              <DotFilledIcon />
            </p>
          )}
          {/* INCORPORATION AGE */}
          {company.incorporationAge && (
            <p className='hidden items-center gap-1 md:flex'>
              {formatCompanyAgeCompact(company.incorporationAge)}
              <DotFilledIcon />
            </p>
          )}
          {/* STATE */}
          <p className='flex items-center gap-1'>{company.state}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CompanyCard;
