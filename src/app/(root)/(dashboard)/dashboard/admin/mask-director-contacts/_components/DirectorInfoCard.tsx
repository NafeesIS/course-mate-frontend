'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, User2 } from 'lucide-react';
import { DirectorContactStatus } from '../_types/types';
import { ContactVisibilityControl } from './ContactVisibilityControl';

interface DirectorInfoCardProps {
  directorInfo: DirectorContactStatus;
  onToggleContact: (_action: 'hide' | 'show') => void;
  isUpdating: boolean;
  className?: string;
}

export const DirectorInfoCard = ({
  directorInfo,
  onToggleContact,
  isUpdating,
  className,
}: DirectorInfoCardProps) => {
  return (
    <Card className={cn('border-green-200 bg-green-50', className)}>
      <CardHeader className='p-4'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <CardTitle className='flex items-center gap-2 text-xs text-green-800 md:text-sm'>
            <span className='bg-green-800 p-1 text-white md:p-2'>
              <User2 className='size-3 md:size-4' />
            </span>
            Director Information
          </CardTitle>
          <Badge
            variant={directorInfo.hideContactInfo ? 'destructive' : 'default'}
            className='flex items-center gap-1 text-xs'
          >
            {directorInfo.hideContactInfo ? (
              <>
                <EyeOff className='size-3 flex-shrink-0' />
                Contact Hidden
              </>
            ) : (
              <>
                <Eye className='size-3 flex-shrink-0' />
                Contact Visible
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-6 p-4 pt-0'>
        {/* Basic Information */}
        <div className='grid grid-cols-1 gap-1 md:grid-cols-2'>
          <div>
            <div>
              <label className='text-xs font-medium text-gray-600'>
                Full Name
              </label>
              <p className='text-sm font-semibold text-gray-900'>
                {directorInfo.fullName}
              </p>
            </div>
            <div>
              <label className='text-xs font-medium text-gray-600'>DIN</label>
              <p className='text-sm font-semibold text-gray-900'>
                {directorInfo.din}
              </p>
            </div>
            <div>
              <label className='text-xs font-medium text-gray-600'>
                Status
              </label>
              <p className='text-sm font-semibold text-gray-900'>
                {directorInfo.status}
              </p>
            </div>
          </div>
          {/* Directorship Information */}
          <div className='space-y-1'>
            <label className='text-xs font-medium text-gray-600'>
              Directorships ({directorInfo.totalDirectorshipCount} companies)
            </label>
            <ul className='list-outside list-disc space-y-1 pl-4'>
              {directorInfo.companies.map((company, index) => (
                <li key={index} className='text-sm text-gray-900'>
                  {company}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator />

        {/* Contact Visibility Control */}
        <ContactVisibilityControl
          directorInfo={directorInfo}
          onToggleContact={onToggleContact}
          isUpdating={isUpdating}
        />
      </CardContent>
    </Card>
  );
};
