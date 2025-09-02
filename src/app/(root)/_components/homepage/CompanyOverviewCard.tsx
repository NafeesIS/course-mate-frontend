import { formatToUrl } from '@/lib/formatters';
import { getStatusBadgeColor } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import { RiArrowRightUpLine } from 'react-icons/ri'; // Import arrow icon
import { Badge } from '../../../../components/ui/badge';
import { Card, CardContent } from '../../../../components/ui/card';

interface CompanyInfo {
  company: string;
  cin: string;
  location: string;
  status: string;
}

interface CompanyOverviewCardProps {
  companyInfo: CompanyInfo;
}

const CompanyOverviewCard: React.FC<CompanyOverviewCardProps> = ({
  companyInfo,
}) => {
  return (
    <Card className='group w-full rounded-md bg-accent transition-all hover:shadow-md sm:max-w-72'>
      <CardContent className='p-0'>
        <Link
          href={`/company/${formatToUrl(companyInfo.company)}/${companyInfo.cin}?tab=about`}
          prefetch={false}
          target='_blank'
          className='block p-4'
        >
          <div className='flex items-center justify-between gap-3'>
            <h4 className='truncate text-sm font-semibold md:text-base'>
              {companyInfo.company}
            </h4>
            <RiArrowRightUpLine className='flex-shrink-0 text-lg text-primary opacity-70 transition-all group-hover:opacity-100 md:text-xl' />
          </div>
          <p className='mt-2 text-xs tracking-wide text-muted-foreground md:text-sm'>
            {companyInfo.cin}
          </p>
          <p className='mt-2 flex items-center gap-2 text-xs tracking-wide text-muted-foreground md:text-sm'>
            <span className='font-semibold'>Location:</span>{' '}
            <span className='uppercase'>{companyInfo.location}</span>
          </p>
          <Badge
            variant='outline'
            className={`mt-2.5 whitespace-nowrap px-4 py-1 ${getStatusBadgeColor(companyInfo.status)}`}
          >
            {companyInfo.status}
          </Badge>
        </Link>
      </CardContent>
    </Card>
  );
};

export default CompanyOverviewCard;
