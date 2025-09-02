import { formatToUrl } from '@/lib/formatters';
import { getStatusBadgeColor } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import { RiArrowRightUpLine } from 'react-icons/ri'; // Import arrow icon
import { Badge } from '../../../../components/ui/badge';
import { Card, CardContent } from '../../../../components/ui/card';

interface DirectorInfo {
  fullName: string;
  din: string;
  Designation: string;
  status: string;
}

interface AssociatedDirectorCardProps {
  directorInfo: DirectorInfo;
}

const AssociatedDirectorCard: React.FC<AssociatedDirectorCardProps> = ({
  directorInfo,
}) => {
  return (
    <Card className='group w-full rounded-md bg-accent transition-all hover:shadow-md sm:max-w-72'>
      <CardContent className='p-0'>
        <Link
          href={`/director/${formatToUrl(directorInfo.fullName)}/${directorInfo.din}`}
          prefetch={false}
          target='_blank'
          className='block p-4'
        >
          <div className='flex items-center justify-between gap-3'>
            <h2 className='truncate text-sm font-semibold md:text-base'>
              {directorInfo.fullName}
            </h2>
            <RiArrowRightUpLine className='flex-shrink-0 text-lg text-primary opacity-70 transition-all group-hover:opacity-100 md:text-xl' />
          </div>
          <p className='mt-2 text-xs tracking-wide text-muted-foreground md:text-sm'>
            {directorInfo.din}
          </p>
          <p className='mt-2 flex items-center gap-2 text-xs tracking-wide text-muted-foreground md:text-sm'>
            <span className='uppercase'>{directorInfo.Designation}</span>
          </p>
          <Badge
            variant='outline'
            className={`mt-2.5 whitespace-nowrap px-4 py-1 ${getStatusBadgeColor(directorInfo.status)}`}
          >
            {directorInfo.status}
          </Badge>
        </Link>
      </CardContent>
    </Card>
  );
};

export default AssociatedDirectorCard;
