'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export const LoadingCard = ({ className }: { className?: string }) => {
  return (
    <Card className={cn(className)}>
      <CardContent className='p-6'>
        <div className='space-y-4'>
          <Skeleton className='h-6 w-1/3' />
          <Skeleton className='h-4 w-1/2' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
