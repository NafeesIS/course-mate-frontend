'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export const InstructionsCard = ({ className }: { className?: string }) => {
  return (
    <Card className={cn('border-blue-200 bg-blue-50', className)}>
      <CardContent className='p-4'>
        <div className='flex items-start gap-3'>
          <AlertCircle className='size-4 flex-shrink-0 text-blue-600' />
          <div>
            <h3 className='text-sm font-medium leading-none text-blue-900'>
              How to use this tool
            </h3>
            <ul className='mt-2 list-inside list-disc space-y-1.5 text-xs text-blue-800'>
              <li>
                Enter a valid Director DIN number in the search field above
              </li>
              <li>
                Click &quot;Search&quot; to fetch director information and
                current contact visibility status
              </li>
              <li>
                Use the &quot;Hide Contact&quot; or &quot;Show Contact&quot;
                button to toggle visibility
              </li>
              <li>
                Changes are applied immediately and affect public access to
                contact information
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
