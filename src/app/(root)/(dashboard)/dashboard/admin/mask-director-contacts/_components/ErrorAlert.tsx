'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  error: Error | null;
  className?: string;
}

export const ErrorAlert = ({ error, className }: ErrorAlertProps) => {
  if (!error) return null;

  return (
    <Alert className={cn('border-red-200 bg-red-50', className)}>
      <AlertDescription className='flex items-center gap-2 text-xs text-red-800'>
        <AlertCircle className='size-4 flex-shrink-0 text-red-600' />
        {error.message}
      </AlertDescription>
    </Alert>
  );
};
